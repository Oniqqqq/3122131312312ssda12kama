export function Advantages() {
  return (
    <section className="advantages" id="advantages" data-testid="section-advantages">
      <div className="container advantages-grid">
        <div>
          <div className="eyebrow">02 / основания</div>
          <h2 className="advantages-title display">Точно.<br />Надолго.</h2>
        </div>
        <div>
          <div className="advantage-statement">
            <p>Мы не просто изготавливаем оборудование — <span className="orange">встраиваем его в жизнь производства.</span></p>
          </div>
          <div className="stats-row">
            <div className="stat"><div className="stat-value">69<sup>лет</sup></div><span className="stat-label">проектируем и создаём оборудование</span></div>
            <div className="stat"><div className="stat-value">12<sup>млн</sup></div><span className="stat-label">единиц оборудования в эксплуатации</span></div>
            <div className="stat"><div className="stat-value">34<sup>страны</sup></div><span className="stat-label">география поставок и партнёрств</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}