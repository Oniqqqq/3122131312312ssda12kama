type MenuOverlayProps = { open: boolean; onClose: () => void };

const links = [
  ["01", "О компании", "#about"],
  ["02", "Преимущества", "#advantages"],
  ["03", "Отрасли", "#industries"],
  ["04", "Каталог", "#catalog"],
  ["05", "Проекты", "#projects"],
  ["06", "Контакты", "#contacts"],
];

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  return (
    <div className={`menu-overlay ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="container menu-grid">
        <nav className="menu-list" aria-label="Основная навигация">
          {links.map(([index, label, href]) => (
            <div key={href}>
              <a href={href} onClick={onClose} data-testid={`link-menu-${label}`}>{label}<em>{index}</em></a>
            </div>
          ))}
        </nav>
        <aside className="menu-aside">
          <strong>Строим то,<br />что держит форму.</strong>
          Полный цикл — от проектирования КМД до поставки готовых металлоконструкций на объект заказчика.
          <div className="menu-aside-contacts">
            <a href="tel:+78800600979">8 800-600-97-99</a>
            <a href="https://kzmktempo.ru" target="_blank" rel="noopener noreferrer">kzmktempo.ru →</a>
          </div>
        </aside>
      </div>
    </div>
  );
}