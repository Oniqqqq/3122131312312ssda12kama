export function Footer() {
  return (
    <footer className="footer" id="contacts" data-testid="section-footer">
      <div className="container">
        <div className="footer-grid">
          <div><div className="brand"><span className="brand-mark" aria-hidden="true" /><span className="brand-copy">Пензгидромаш<small>инженерные системы / 1955</small></span></div><p style={{ marginTop: 25 }}>Производство промышленного оборудования. Пенза, Россия.</p></div>
          <div><h4>Контакты</h4><address><a href="tel:+78412202020" data-testid="link-footer-phone">+7 (8412) 20-20-20</a><br /><a href="mailto:info@penzhm.ru" data-testid="link-footer-email">info@penzhm.ru</a><br /><br />440015, г. Пенза,<br />ул. Аустрина, 63</address></div>
          <div><h4>На связи</h4><p>Пн—Пт / 08:00—17:00<br />Отдел продаж и проектирования<br /><br /><a href="#top" data-testid="link-back-top">Вернуться наверх ↑</a></p></div>
        </div>
        <div className="footer-bottom"><span>© 1955—2025 Пензгидромаш</span><span>Проектируем устойчивость / сделано в Пензе</span></div>
      </div>
    </footer>
  );
}