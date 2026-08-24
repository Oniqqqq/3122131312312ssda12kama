const industries = [
  ["01", "Нефть и газ", "Аппараты и системы подготовки сырья для сложных условий эксплуатации."],
  ["02", "Химия", "Коррозионностойкое оборудование для непрерывных технологических циклов."],
  ["03", "Энергетика", "Ёмкости, сепараторы и теплообменники для объектов большой мощности."],
  ["04", "Атомная отрасль", "Изделия специального назначения с контролем каждого этапа производства."],
  ["05", "Водоканалы", "Решения для очистки, хранения и транспортировки рабочих сред."],
];

export function Industries() {
  return (
    <section className="industries" id="industries" data-testid="section-industries">
      <div className="container">
        <div className="section-heading">
          <div><div className="eyebrow">04 / среда работы</div><h2 className="section-title display">Отрасли</h2></div>
          <p className="section-intro">Там, где среда агрессивна, температура высока, а результат должен быть предсказуемым.</p>
        </div>
        <div className="industry-list">
          {industries.map(([number, name, detail]) => (
            <a className="industry-item" href="#contacts" key={name} data-testid={`link-industry-${number}`}>
              <span className="industry-number">{number}</span><span className="industry-name">{name}</span><span className="industry-detail">{detail}</span><span className="industry-arrow">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}