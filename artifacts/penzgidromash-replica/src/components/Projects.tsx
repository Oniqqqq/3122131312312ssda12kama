export function Projects() {
  return (
    <section className="projects" id="projects" data-testid="section-projects">
      <div className="container projects-grid">
        <div className="projects-side">
          <div className="eyebrow">06 / в деле</div>
          <h2 className="section-title display">Проекты,<br />которым<br />доверяют</h2>
          <p>За каждым изделием — люди, расчёты, металл и годы работы системы. Несколько объектов из последних поставок.</p>
        </div>
        <article className="project-feature">
          <div className="project-visual" aria-hidden="true" />
          <div className="project-meta">2024 / ЯМАЛ / НЕФТЕГАЗ</div>
          <div className="project-info">
            <h3>Комплекс<br />подготовки газа</h3>
            <p>Сепараторы и блочные установки для северного промысла. Поставка, шеф-монтаж, запуск.</p>
          </div>
          <div className="project-count">01 — 03 <span className="orange">/</span> листайте проекты</div>
        </article>
      </div>
    </section>
  );
}