export function Footer() {
  return (
    <footer className="footer" id="contacts" data-testid="section-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <img src="/kzmk-bel.svg" alt="КЗМК ТЭМПО" className="footer-logo-img" />
            <p style={{ marginTop: 20 }}>Производство металлоконструкций, сварных балок и решетчатого настила. Набережные Челны, Татарстан.</p>
          </div>
          <div>
            <h4>Контакты</h4>
            <address>
              <a href="tel:+78800600979" data-testid="link-footer-phone">8 800-600-97-99</a><br />
              <a href="tel:+78552202053">8 8552 20-20-53</a><small> — приёмная</small><br />
              <a href="tel:+78552202099">8 8552 20-20-99</a><small> — отдел заказов</small><br /><br />
              423822, Республика Татарстан,<br />
              г. Набережные Челны,<br />
              ул. Моторная, корп. 38
            </address>
          </div>
          <div>
            <h4>Производство</h4>
            <nav aria-label="Навигация по продуктам">
              <a href="https://kzmktempo.ru/services/metallokonstruktsii/" target="_blank" rel="noopener noreferrer">Металлоконструкции</a><br />
              <a href="https://kzmktempo.ru/services/svarnye-balki/" target="_blank" rel="noopener noreferrer">Сварные балки</a><br />
              <a href="https://kzmktempo.ru/services/svarnoy-reshetchatyy-nastil/" target="_blank" rel="noopener noreferrer">Сварной решетчатый настил</a><br />
              <a href="https://kzmktempo.ru/proektnyy-institut/" target="_blank" rel="noopener noreferrer">Проектный институт</a><br /><br />
              <a href="#top" data-testid="link-back-top">Вернуться наверх ↑</a>
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2002—2025 КЗМК ТЭМПО</span>
          <span>Камский завод металлоконструкций / Холдинг ТЭМПО</span>
        </div>
      </div>
    </footer>
  );
}