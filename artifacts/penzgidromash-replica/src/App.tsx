import { Advantages } from "./components/Advantages";
import { Catalog } from "./components/Catalog";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { IndustrialScene } from "./components/IndustrialScene";
import { Industries } from "./components/Industries";
import { Projects } from "./components/Projects";
import { FadeUpScroll, WordReveal } from "./components/ScrollAnimations";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <Hero />

        {/* ── MANIFESTO SECTION ── */}
        <section className="manifesto" id="about" data-testid="section-about">
          <div className="container manifesto-grid">
            <FadeUpScroll>
              <h2 className="manifesto-title display">
                Металл<br />несёт<br />нагрузку.
              </h2>
            </FadeUpScroll>
            <div className="manifesto-copy">
              <WordReveal
                text="С 2002 года мы производим металлоконструкции для крупнейших промышленных объектов России — нефтегазовых комплексов, ТЭЦ, нефтехимических заводов и торговых центров."
                as="p"
                accentWords={["нефтегазовых", "комплексов,", "ТЭЦ,", "нефтехимических", "заводов"]}
              />
              <FadeUpScroll delay={0.2}>
                <p className="manifesto-note">
                  Полный цикл в Набережных Челнах: проектирование КМД, заготовка, сварка, контроль качества, антикоррозионная обработка и поставка на объект.
                </p>
              </FadeUpScroll>
            </div>
          </div>
        </section>

        <Advantages />

        {/* ── STORY SECTION ── */}
        <section className="story" data-testid="section-story">
          <div className="story-sticky">
            <div className="container story-copy">
              <FadeUpScroll>
                <h2 className="story-title display">
                  Расчёт<br />держит<br />форму.
                </h2>
              </FadeUpScroll>
              <FadeUpScroll delay={0.15}>
                <p className="story-description">
                  Каждая конструкция начинается не с листа металла, а с <span style={{ color: "var(--blue-light)", fontWeight: 600 }}>проектной документации</span>, нагрузок и условий эксплуатации объекта.
                </p>
              </FadeUpScroll>
            </div>
            <IndustrialScene mode="story" />
          </div>
        </section>

        <Industries />
        <Catalog />
        <Projects />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false, lerp: 0.085, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <Home />;
}

export default App;