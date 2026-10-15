import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  getCommunityChoice,
  joinCommunity,
  leaveCommunity,
} from "@/lib/community/community.functions";
import { useWords } from "@/lib/editorial";
import { Link } from "@tanstack/react-router";
export function CommunityChoice({
  ownerId,
  onMembershipChange,
}: {
  ownerId: string;
  onMembershipChange?: () => void;
}) {
  const w = useWords();
  const load = useServerFn(getCommunityChoice);
  const join = useServerFn(joinCommunity);
  const leave = useServerFn(leaveCommunity);
  const [data, setData] = useState<Awaited<ReturnType<typeof getCommunityChoice>> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    let live = true;
    setData(null);
    setError(false);
    setDismissed(false);
    try {
      setDismissed(localStorage.getItem(`abilitio.community-notice.${ownerId}`) === "seen");
    } catch {
      /* optional */
    }
    load()
      .then((d) => {
        if (live) setData(d);
      })
      .catch(() => {
        if (live) setError(true);
      });
    return () => {
      live = false;
    };
  }, [load, ownerId]);
  async function act(id: string, joining: boolean) {
    setBusy(true);
    setError(false);
    try {
      if (joining) await join({ data: { communityId: id, consent: true } });
      else await leave({ data: { communityId: id } });
      setData(await load());
      onMembershipChange?.();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  const member = data?.memberships.find((m) => m.id === data.suggested?.id);
  return (
    <section
      className="panel my-6 rounded-2xl p-5 text-base"
      aria-label={w("Optional community", "Ixtiyoriy hamjamiyat", "Необязательное сообщество")}
    >
      <h2 className="text-lg">
        {w(
          "Explore with others, if you choose",
          "Xohlasangiz, boshqalar bilan o‘rganing",
          "Изучайте вместе, если хотите",
        )}
      </h2>
      <p className="mt-2 text-base">
        {w(
          "Joining is optional. Members can see your display name, avatar and messages you post. Your private assessment report is not shared. You can leave at any time; existing messages remain.",
          "Qo‘shilish ixtiyoriy. A’zolar ismingiz, avataringiz va yozgan xabarlaringizni ko‘radi. Shaxsiy test hisobotingiz ulashilmaydi. Istalgan payt chiqishingiz mumkin; oldingi xabarlar qoladi.",
          "Участие необязательно. Участники видят ваше имя, аватар и опубликованные сообщения. Личный отчёт не передаётся. Можно выйти в любое время; прежние сообщения сохранятся.",
        )}
      </p>
      {!dismissed && data?.memberships.some((m) => !m.consented_at) && (
        <div role="status" className="mt-3 border-l-4 border-primary pl-3">
          <p>
            {w(
              "Earlier versions may have joined a community automatically. Review your memberships below.",
              "Oldingi versiya sizni hamjamiyatga avtomatik qo‘shgan bo‘lishi mumkin. Quyida a’zoliklarni ko‘rib chiqing.",
              "Прежняя версия могла добавить вас автоматически. Проверьте участие ниже.",
            )}
          </p>
          <button
            className="field-button my-2"
            onClick={() => {
              setDismissed(true);
              try {
                localStorage.setItem(`abilitio.community-notice.${ownerId}`, "seen");
              } catch {
                /* optional */
              }
            }}
          >
            {w("Dismiss notice", "Bildirishni yopish", "Скрыть уведомление")}
          </button>
        </div>
      )}
      {data?.memberships.map((m) => (
        <div key={m.id} className="mt-3 flex flex-wrap gap-3 items-center">
          <span>{m.name}</span>
          <button disabled={busy} className="field-button" onClick={() => act(m.id, false)}>
            {w("Leave community", "Hamjamiyatdan chiqish", "Выйти из сообщества")}
          </button>
          <Link to="/community" className="field-button">
            {w("Open community", "Hamjamiyatni ochish", "Открыть сообщество")}
          </Link>
        </div>
      ))}
      {data?.suggested && !member && (
        <button
          disabled={busy}
          className="field-button mt-4"
          onClick={() => act(data.suggested!.id, true)}
        >
          {w(
            `Join the ${data.suggested.name} community?`,
            `${data.suggested.name} hamjamiyatiga qo‘shilasizmi?`,
            `Присоединиться к сообществу ${data.suggested.name}?`,
          )}
        </button>
      )}
      {error && (
        <p role="alert" className="mt-3">
          {w(
            "Community choices could not be loaded or saved. Please retry after reloading.",
            "Hamjamiyat tanlovlarini yuklash yoki saqlash imkoni bo‘lmadi. Sahifani yangilab qayta urinib ko‘ring.",
            "Не удалось загрузить или сохранить выбор. Обновите страницу и повторите.",
          )}
        </p>
      )}
    </section>
  );
}
