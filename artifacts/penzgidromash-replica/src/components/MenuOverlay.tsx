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
        <span className="menu-index">НАВИГАЦИЯ<br />/ 2024—25</span>
        <nav className="menu-list" aria-label="Основная навигация">
          {links.map(([index, label, href]) => (
            <div key={href}>
              <a href={href} onClick={onClose} data-testid={`link-menu-${label}`}>{label}<em>{index}</em></a>
            </div>
          ))}
        </nav>
        <aside className="menu-aside">
          <strong>Производим то,<br />что держит систему.</strong>
          Полный цикл — от инженерного расчёта до монтажа оборудования на объекте заказчика.
        </aside>
      </div>
    </div>
  );
}