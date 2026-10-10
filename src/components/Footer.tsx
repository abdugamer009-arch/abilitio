import { Link } from "@tanstack/react-router";
import { useWords } from "@/lib/editorial";
import { useMotion } from "./MotionProvider";
import { BrandMark } from "./BrandMark";
export function Footer() {
  const w = useWords();
  const { enabled, toggle } = useMotion();
  return (
    <footer className="field-footer">
      <div className="field-wrap footer-compact">
        <Link to="/" className="field-brand">
          <BrandMark />
          <span>
            abilitio<span className="brand-dot">.</span>
          </span>
        </Link>
        <nav aria-label={w("Footer navigation", "Quyi menyu", "Навигация внизу")}>
          <Link to="/universities">{w("Universities", "Universitetlar", "Университеты")}</Link>
          <Link to="/privacy">{w("Privacy", "Maxfiylik", "Конфиденциальность")}</Link>
          <Link to="/terms">{w("Terms", "Shartlar", "Условия")}</Link>
          <Link to="/contact">{w("Contact", "Aloqa", "Контакты")}</Link>
        </nav>
        <button className="motion-toggle" onClick={toggle} aria-pressed={enabled}>
          <span className="motion-status" aria-hidden="true" />
          {w("Motion", "Harakat", "Анимация")}:{" "}
          {enabled ? w("on", "yoqilgan", "вкл") : w("off", "o‘chirilgan", "выкл")}
        </button>
        <small>
          © {new Date().getFullYear()} Abilitio ·{" "}
          {w("Career exploration", "Kasbiy izlanish", "Исследование профессий")}
        </small>
      </div>
    </footer>
  );
}
