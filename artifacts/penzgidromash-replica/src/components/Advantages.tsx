import { AnimatedStat, FadeUpScroll, WordReveal } from "./ScrollAnimations";

export function Advantages() {
  return (
    <section className="advantages" id="advantages" data-testid="section-advantages">
      <div className="container advantages-grid">
        <div>
          <FadeUpScroll>
            <h2 className="advantages-title display">Точно.<br />Надёжно.</h2>
          </FadeUpScroll>
        </div>
        <div>
          <div className="advantage-statement">
            <WordReveal
              text="Мы не просто изготавливаем металлоконструкции — создаём несущий каркас вашего производства."
              as="p"
              accentWords={["создаём", "несущий", "каркас"]}
            />
          </div>
          <div className="stats-row">
            <AnimatedStat
              target={23}
              suffix="года"
              isSup
              label="в производстве металлоконструкций"
            />
            <AnimatedStat
              target={30}
              suffix="+"
              label="реализованных проектов по всей России"
            />
            <AnimatedStat
              target={100}
              suffix="%"
              label="контроль качества по ГОСТ и ISO"
            />
          </div>
        </div>
      </div>
    </section>
  );
}