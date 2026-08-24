const products = [
  ["01", "Сепараторы", "вертикальные / горизонтальные"],
  ["02", "Сосуды давления", "рабочее давление до 25 МПа"],
  ["03", "Теплообменники", "кожухотрубчатые / блочные"],
  ["04", "Ёмкости", "для хранения и транспортировки"],
];

export function Catalog() {
  return (
    <section className="catalog" id="catalog" data-testid="section-catalog">
      <div className="container">
        <div className="catalog-header">
          <div><div className="eyebrow">05 / номенклатура</div><h2 className="section-title display">Каталог<br />оборудования</h2></div>
          <p className="section-intro">От типового изделия до аппарата, рассчитанного под конкретную технологию, среду и объект.</p>
        </div>
        <div className="catalog-list">
          {products.map(([number, name, detail]) => (
            <a className="catalog-item" href="#contacts" key={name} data-testid={`link-catalog-${number}`}>
              <span className="catalog-num">{number}</span><span className="catalog-name">{name}</span><span className="catalog-sub">{detail}</span><span className="catalog-arrow">↗</span>
            </a>
          ))}
        </div>
        <a className="catalog-cta" href="#contacts" data-testid="link-full-catalog">Смотреть весь каталог <span>→</span></a>
      </div>
    </section>
  );
}