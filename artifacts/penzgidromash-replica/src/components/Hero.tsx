import { ArrowDown } from "lucide-react";
import { IndustrialScene } from "./IndustrialScene";

export function Hero() {
  return (
    <section className="hero" id="top" data-testid="section-hero">
      <div className="container">
        <div className="hero-copy">
          <div className="hero-kicker eyebrow">Пензенский завод / 01</div>
          <h1 className="hero-title display"><span>Создаём</span><span className="outline">давление.</span></h1>
          <p className="hero-summary"><b>Пензгидромаш</b> — промышленное оборудование для процессов, где нет права на остановку. Проектируем. Производим. Отвечаем.</p>
        </div>
        <div className="hero-meta">55°06′ N / 32°20′ E<br />PENZA / RUSSIA</div>
        <div className="scroll-cue">листайте <ArrowDown size={13} strokeWidth={1} /></div>
      </div>
      <div className="hero-scene-wrap"><IndustrialScene mode="hero" /><span className="hero-coordinate">ТЕХНОЛОГИЧЕСКИЙ КОНТУР / 1955—2025</span></div>
    </section>
  );
}