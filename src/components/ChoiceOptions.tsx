import { Check, X, ArrowUpRight } from "lucide-react";

/** Shared by the actual assessment and public workshop. Native radios retain keyboard behavior. */
export function ChoiceOptions({
  options,
  value,
  onChange,
  name,
  feedback,
  correct,
}: {
  options: string[];
  value: number | null;
  onChange: (value: number) => void;
  name: string;
  feedback?: number;
  correct?: number;
}) {
  return (
    <div className="choice-options" role="radiogroup" aria-label={name}>
      {options.map((option, i) => (
        <label
          key={i}
          className={`choice-option ${value === i ? "is-selected" : ""} ${feedback !== undefined ? (i === correct ? "is-correct" : i === feedback ? "is-wrong" : "is-muted") : ""}`}
        >
          <input type="radio" name={name} checked={value === i} onChange={() => onChange(i)} />
          <span className="choice-letter" aria-hidden>
            {String.fromCharCode(65 + i)}
          </span>
          <span>{option}</span>
          <span className="choice-check" aria-hidden>
            {feedback !== undefined && i === correct ? (
              <Check size={24} />
            ) : feedback !== undefined && i === feedback ? (
              <X size={24} />
            ) : value === i ? (
              <Check size={24} />
            ) : (
              <ArrowUpRight size={20} />
            )}
          </span>
        </label>
      ))}
    </div>
  );
}
