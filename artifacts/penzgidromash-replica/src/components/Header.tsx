import { useEffect, useRef, useState } from "react";
import { MenuOverlay } from "./MenuOverlay";

// Modern asymmetric two-line menu icon
function IconMenu() {
  return (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" aria-hidden="true">
      <line x1="0" y1="1.5" x2="24" y2="1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="14.5" x2="24" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Modern close icon — thin diagonal cross
function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <line x1="1" y1="1" x2="19" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="1" x2="1" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const darkSelectors = [".hero", ".story", ".projects", ".cta"];

    const checkSection = () => {
      const header = headerRef.current;
      if (!header) return;
      const headerMid = header.getBoundingClientRect().bottom - 1;

      let isDark = false;
      for (const sel of darkSelectors) {
        const els = document.querySelectorAll(sel);
        for (const el of Array.from(els)) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerMid && rect.bottom >= headerMid) {
            isDark = true;
            break;
          }
        }
        if (isDark) break;
      }
      setOnDark(isDark || open);
    };

    checkSection();
    window.addEventListener("scroll", checkSection, { passive: true });
    window.addEventListener("resize", checkSection, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkSection);
      window.removeEventListener("resize", checkSection);
    };
  }, [open]);

  return (
    <>
      <header className={`header${onDark ? " header--dark" : ""}`} ref={headerRef}>
        <div className="header-inner">
          <a className="brand" href="#top" data-testid="link-brand" onClick={() => setOpen(false)}>
            <img
              src={onDark ? "/kzmk-bel.svg" : "/kzmk-siniy.svg"}
              alt="КЗМК ТЭМПО"
              className="brand-logo-img"
            />
          </a>
          <div className="header-actions">
            <a className="header-phone" href="tel:+78800600979" data-testid="link-header-phone">
              <span>8 800</span> 600-97-99
            </a>
            <button
              className={`menu-trigger ${open ? "is-open" : ""}`}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
              data-testid="button-menu"
            >
              {open ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}