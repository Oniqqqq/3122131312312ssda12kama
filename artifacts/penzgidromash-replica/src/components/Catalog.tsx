import { FadeUpScroll, WordReveal } from "./ScrollAnimations";

const products = [
  ["01", "Металлоконструкции", "несущие и ограждающие конструкции любой сложности"],
  ["02", "Сварные балки", "двутавровые балки под заказ по чертежам заказчика"],
  ["03", "Сварной решетчатый настил", "для промышленных полов, переходов, площадок"],
  ["04", "Проектный институт", "разработка КМД и КМ, сопровождение проекта"],
];

export function Catalog() {
  return (
    <section className="catalog" id="catalog" data-testid="section-catalog">
      <div className="container">
        <div className="catalog-header">
          <FadeUpScroll>
            <div><h2 className="section-title display">Каталог<br />продукции</h2></div>
          </FadeUpScroll>
          <WordReveal
            text="Металлоконструкции под задачи строительства и промышленности — от стандартных балок до сложных несущих систем."
            as="p"
            className="section-intro"
          />
        </div>
        <div className="catalog-list">
          {products.map(([number, name, detail], idx) => (
            <FadeUpScroll key={name} delay={idx * 0.08}>
              <a
                className="catalog-item"
                href="https://kzmktempo.ru/services/"
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-catalog-${number}`}
              >
                <span className="catalog-num">{number}</span>
                <span className="catalog-name">{name}</span>
                <span className="catalog-sub">{detail}</span>
                <span className="catalog-arrow">↗</span>
              </a>
            </FadeUpScroll>
          ))}
        </div>
        <FadeUpScroll delay={0.3}>
          <a
            className="catalog-cta"
            href="https://kzmktempo.ru/services/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-full-catalog"
          >
            Смотреть полный каталог <span>→</span>
          </a>
        </FadeUpScroll>
      </div>
    </section>
  );
}