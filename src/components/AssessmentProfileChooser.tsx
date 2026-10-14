import type { AttemptProfile } from "@/lib/assessment/attempt-profile";
import { useWords } from "@/lib/editorial";
import { Check } from "lucide-react";

export function AssessmentProfileChooser({
  profile,
  onChange,
  disabled = false,
}: {
  profile: AttemptProfile;
  onChange: (value: AttemptProfile) => void;
  disabled?: boolean;
}) {
  const w = useWords();
  const groups = [
    {
      key: "gender" as const,
      label: w("Gender", "Jins", "Пол"),
      options: [
        { value: "male" as const, label: w("Male", "Erkak", "Мужской") },
        { value: "female" as const, label: w("Female", "Ayol", "Женский") },
      ],
    },
    {
      key: "ageGroup" as const,
      label: w("Age group", "Yosh guruhi", "Возрастная группа"),
      options: [
        {
          value: "child" as const,
          label: w("14 and under", "14 yosh va undan kichik", "14 лет и младше"),
        },
        {
          value: "teen_adult" as const,
          label: w("15 and older", "15 yosh va undan katta", "15 лет и старше"),
        },
      ],
    },
  ];
  return (
    <div className="mt-6 space-y-5 text-left">
      {groups.map((group) => (
        <fieldset key={group.key} disabled={disabled}>
          <legend className="mb-2 text-sm font-semibold">{group.label}</legend>
          <div className="grid grid-cols-2 gap-3">
            {group.options.map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input
                  className="sr-only peer"
                  type="radio"
                  name={`profile-${group.key}`}
                  value={option.value}
                  checked={profile[group.key] === option.value}
                  onChange={() => onChange({ ...profile, [group.key]: option.value })}
                />
                <span className="visual-choice relative flex min-h-16 items-center justify-center gap-2 px-3 py-4 text-center text-sm font-medium transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-primary">
                  {profile[group.key] === option.value && (
                    <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  <span className="assessment-profile-label">{option.label}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <p className="text-xs text-muted-foreground">
        {w(
          "These choices stay in this browser tab for this session. We do not send or save your gender or age group to your account.",
          "Tanlovlar ushbu brauzer oynasida sessiya davomida qoladi. Jins yoki yosh guruhi hisobingizga yuborilmaydi va saqlanmaydi.",
          "Выбор остаётся в этой вкладке на время сеанса. Мы не отправляем и не сохраняем пол или возрастную группу в аккаунте.",
        )}
      </p>
    </div>
  );
}
