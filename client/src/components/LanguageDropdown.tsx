import { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { LANGUAGES, type Lang, useLanguage } from "@/contexts/LanguageContext";

interface LanguageDropdownProps {
  /** When true the menu opens upward (useful inside mobile nav at bottom) */
  dropUp?: boolean;
}

export default function LanguageDropdown({ dropUp = false }: LanguageDropdownProps) {
  const { lang, setLang, t, currentOption } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / focus-out
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const choose = (code: Lang) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="lang-dropdown" style={{ position: "relative" }}>
      {/* Trigger */}
      <button
        type="button"
        aria-label={t("lang_selector")}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="lang-trigger"
      >
        <img
          src={currentOption.flag}
          alt={currentOption.label}
          className="h-6 w-6 rounded-full object-cover"
          draggable={false}
        />
        <ChevronDown
          size={14}
          strokeWidth={2.2}
          className="lang-chevron"
          style={{
            transition: "transform 200ms cubic-bezier(0.34,1.36,0.64,1)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Menu */}
      {open && (
        <ul
          role="listbox"
          aria-label={t("lang_selector")}
          className="lang-menu"
          style={{
            position: "absolute",
            ...(dropUp
              ? { bottom: "calc(100% + 8px)", top: "auto" }
              : { top: "calc(100% + 8px)", bottom: "auto" }),
            insetInlineEnd: 0,
            zIndex: 100,
          }}
        >
          {LANGUAGES.map((opt) => (
            <li key={opt.code} role="option" aria-selected={lang === opt.code}>
              <button
                type="button"
                onClick={() => choose(opt.code)}
                className={`lang-menu-item${lang === opt.code ? " lang-menu-item--active" : ""}`}
              >
                <img
                  src={opt.flag}
                  alt={opt.label}
                  className="h-6 w-6 rounded-full object-cover"
                  draggable={false}
                />
                <span>{opt.label}</span>
                {lang === opt.code && (
                  <span className="lang-menu-item-check" aria-hidden="true">✓</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

