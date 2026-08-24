import { ArrowDown } from "lucide-react";
import { IndustrialScene } from "./IndustrialScene";

export function Hero() {
  return (
    <section className="hero" id="top" data-testid="section-hero">
      <div className="container">
        <div className="hero-copy">
          <h1 className="hero-title display"><span>Строим</span><span className="outline" data-text="прочность.">прочность.</span></h1>
          <p className="hero-summary"><b>КЗМК ТЭМПО</b> — производство металлоконструкций, сварных балок и решетчатого настила для объектов любой сложности. <span style={{color:"var(--blue-light)", fontWeight:600}}>Проектируем. Производим. Поставляем.</span></p>
        </div>
        <div className="hero-meta">55°44′ N / 52°24′ E<br />NABEREZHNY CHELNY / TATARSTAN</div>
        <div className="scroll-cue">листайте <ArrowDown size={13} strokeWidth={1} /></div>
      </div>
      <div className="hero-scene-wrap"><IndustrialScene mode="hero" /><span className="hero-coordinate">КАМСКИЙ ЗАВОД МЕТАЛЛОКОНСТРУКЦИЙ / 2002—2025</span></div>
    </section>
  );
}