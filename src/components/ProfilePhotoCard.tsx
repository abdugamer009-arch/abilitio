import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import { Camera, Loader2, Trash2, UploadCloud, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export async function resolveAvatarUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 365);
  return data?.signedUrl ?? null;
}

export function ProfilePhotoCard({
  userId,
  avatarPath,
  initials,
  onChange,
}: {
  userId: string;
  avatarPath: string | null;
  initials: string;
  onChange: (newPath: string | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [resolved, setResolved] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    resolveAvatarUrl(avatarPath).then((u) => {
      if (!cancelled) setResolved(u);
    });
    return () => {
      cancelled = true;
    };
  }, [avatarPath]);

  const displayed = preview ?? resolved;

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!ACCEPTED.includes(file.type)) {
        setError("Please upload a JPG, PNG, or WEBP image.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("Image must be smaller than 5 MB.");
        return;
      }

      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
      setBusy(true);
      setProgress(15);

      try {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${userId}/avatar-${Date.now()}.${ext}`;
        setProgress(45);

        const { error: upErr } = await supabase.storage
          .from("avatars")
          .upload(path, file, { upsert: true, contentType: file.type });
        if (upErr) throw upErr;
        setProgress(75);

        // Remove previous avatar file
        if (avatarPath && !avatarPath.startsWith("http")) {
          await supabase.storage.from("avatars").remove([avatarPath]);
        }

        const { error: dbErr } = await supabase
          .from("user_stats")
          .upsert({ user_id: userId, avatar_url: path }, { onConflict: "user_id" });
        if (dbErr) throw dbErr;

        const signed = await resolveAvatarUrl(path);
        setResolved(signed);
        setPreview(null);
        URL.revokeObjectURL(localUrl);
        setProgress(100);
        onChange(path);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed.");
        setPreview(null);
      } finally {
        setBusy(false);
        setTimeout(() => setProgress(0), 600);
      }
    },
    [avatarPath, onChange, userId],
  );

  async function remove() {
    setError(null);
    setBusy(true);
    try {
      if (avatarPath && !avatarPath.startsWith("http")) {
        await supabase.storage.from("avatars").remove([avatarPath]);
      }
      const { error: dbErr } = await supabase
        .from("user_stats")
        .upsert({ user_id: userId, avatar_url: null }, { onConflict: "user_id" });
      if (dbErr) throw dbErr;
      setResolved(null);
      setPreview(null);
      onChange(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Remove failed.");
    } finally {
      setBusy(false);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/30 via-background/40 to-background/30 p-7 backdrop-blur-xl"
      style={{ boxShadow: "0 10px 40px -20px oklch(0.55 0.22 295 / 0.25)" }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.4), transparent 70%)" }}
      />

      <h2 className="flex items-center gap-2 text-base font-semibold">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_3px_10px_-3px_var(--glow)]">
          <Camera className="h-3.5 w-3.5" />
        </span>
        Profile Photo
      </h2>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {/* Avatar preview */}
        <div className="relative shrink-0">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary via-accent to-primary opacity-70 blur-md" />
          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground shadow-2xl">
            {displayed ? (
              <img src={displayed} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
            {busy && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>

        {/* Drop zone */}
        <div className="flex-1 w-full">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-7 text-center transition-all",
              dragOver
                ? "border-primary/70 bg-primary/10"
                : "border-primary/30 bg-secondary/20 hover:border-primary/60 hover:bg-primary/5",
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/10 ring-1 ring-primary/30 shadow-[0_4px_14px_-4px_var(--glow)] transition-transform duration-300 group-hover:scale-105">
              <UploadCloud className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <p className="mt-3 text-sm font-medium">
              Drag & drop or <span className="text-primary">browse</span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">JPG, PNG or WEBP · up to 5 MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </div>

          {progress > 0 && (
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300"
                style={{ width: `${progress}%`, boxShadow: "0 0 8px oklch(0.65 0.22 295 / 0.7)" }}
              />
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary/20 disabled:opacity-50"
            >
              <Camera className="h-3.5 w-3.5" /> {displayed ? "Change photo" : "Upload photo"}
            </button>
            {displayed && (
              <button
                type="button"
                disabled={busy}
                onClick={remove}
                className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-1.5 text-xs font-medium text-destructive transition-all hover:bg-destructive/20 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            )}
            {!displayed && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5 text-[11px] text-muted-foreground">
                <UserIcon className="h-3 w-3" /> Using default avatar
              </span>
            )}
          </div>

          {error && (
            <p className="mt-3 text-xs font-medium text-destructive">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
