import { FadeUpScroll, WordReveal } from "./ScrollAnimations";

const industries = [
  ["01", "Нефть и газ", "Металлоконструкции для НПЗ, ГПЗ, нефтехимических комплексов и добычных объектов."],
  ["02", "Химическая промышленность", "Несущие конструкции для заводов удобрений, аммиака, полиэтилена и полипропилена."],
  ["03", "Энергетика", "Конструкции для ТЭЦ, ГЭС, объектов тепло- и электроснабжения промышленных зон."],
  ["04", "Строительство и торговля", "Каркасы для ТРЦ, складов, многофункциональных комплексов и логистических центров."],
  ["05", "Транспортная инфраструктура", "Перекрытия платформ, пассажирских павильонов, аэропортов и железнодорожных объектов."],
];

export function Industries() {
  return (
    <section className="industries" id="industries" data-testid="section-industries">
      <div className="container">
        <div className="section-heading">
          <FadeUpScroll>
            <div><h2 className="section-title display">Отрасли</h2></div>
          </FadeUpScroll>
          <WordReveal
            text="Наши металлоконструкции работают на объектах Газпрома, Татнефти, ЛУКОЙЛа, СИБУРа и других промышленных гигантов России."
            as="p"
            className="section-intro"
            accentWords={["Газпрома,", "Татнефти,", "ЛУКОЙЛа,", "СИБУРа"]}
          />
        </div>
        <div className="industry-list">
          {industries.map(([number, name, detail], idx) => (
            <FadeUpScroll key={name} delay={idx * 0.08}>
              <a className="industry-item" href="#contacts" data-testid={`link-industry-${number}`}>
                <span className="industry-number">{number}</span>
                <span className="industry-name">{name}</span>
                <span className="industry-detail">{detail}</span>
                <span className="industry-arrow">↗</span>
              </a>
            </FadeUpScroll>
          ))}
        </div>
      </div>
    </section>
  );
}