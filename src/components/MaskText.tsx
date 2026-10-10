export function MaskText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`mask-text ${className}`}>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((word, i) => (
        <span className="word-mask" key={i} aria-hidden>
          <span className="masked-word">
            {word}
            {i < text.split(" ").length - 1 ? "\u00a0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
