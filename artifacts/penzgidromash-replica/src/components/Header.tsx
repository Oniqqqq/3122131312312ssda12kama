import { Menu, X } from "lucide-react";
import { useState } from "react";
import { MenuOverlay } from "./MenuOverlay";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <a className="brand" href="#top" data-testid="link-brand" onClick={() => setOpen(false)}>
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-copy">Пензгидромаш<small>инженерные системы / 1955</small></span>
          </a>
          <div className="header-actions">
            <a className="header-phone" href="tel:+78412202020" data-testid="link-header-phone"><span>+7 (8412)</span> 20-20-20</a>
            <button className={`menu-trigger ${open ? "is-open" : ""}`} onClick={() => setOpen((value) => !value)} aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open} data-testid="button-menu">
              {open ? <X size={18} strokeWidth={1.3} /> : <Menu size={18} strokeWidth={1.3} />}
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}