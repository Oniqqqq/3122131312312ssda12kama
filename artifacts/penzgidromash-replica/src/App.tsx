import { Advantages } from "./components/Advantages";
import { Catalog } from "./components/Catalog";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { IndustrialScene } from "./components/IndustrialScene";
import { Industries } from "./components/Industries";
import { Projects } from "./components/Projects";
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
        <section className="manifesto" id="about" data-testid="section-about">
          <div className="container manifesto-grid">
            <div><div className="eyebrow">01 / о компании</div><h2 className="manifesto-title display">Металл<br />смысл<br />системы</h2></div>
            <div className="manifesto-copy">
              <p>С 1955 года мы превращаем металл в <strong>надёжные технологические решения.</strong> Наше оборудование работает там, где цена ошибки измеряется остановкой производства.</p>
              <p className="manifesto-note">Полный цикл производства в Пензе: конструкторский расчёт, заготовка, сварка, контроль, испытания и поставка.</p>
            </div>
          </div>
        </section>
        <Advantages />
        <section className="story" data-testid="section-story">
          <div className="story-sticky">
            <div className="story-copy">
              <div className="eyebrow">03 / внутри процесса</div>
              <h2 className="story-title display">Расчёт<br />держит<br />форму.</h2>
              <p className="story-description">Каждый аппарат начинается не с листа металла, а с понимания среды, давления и будущего режима работы.</p>
            </div>
            <IndustrialScene mode="story" />
            <div className="story-progress"><span>SCROLL TO INSPECT</span><i><b /></i><span>01—04</span></div>
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