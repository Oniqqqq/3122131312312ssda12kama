import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    num: "01",
    year: "2023",
    client: "ПАО «ГАЗПРОМ»",
    name: "Амурский газоперерабатывающий завод",
    location: "г. Свободный, Амурская обл.",
    desc: "Несущие металлоконструкции технологических блоков и эстакад крупнейшего в мире ГПЗ.",
    img: "/project_amur.jpg",
    href: "https://kzmktempo.ru/geografiya-biznesa/geografiya-biznesa_44.html",
  },
  {
    num: "02",
    year: "2022",
    client: "АО «СИБУР»",
    name: "ЗапСибНефтехим — комплекс глубокой переработки",
    location: "г. Тобольск",
    desc: "Металлоконструкции для крупнейшего нефтехимического комплекса России мощностью 2 млн т полиолефинов в год.",
    img: "/project_sibur.jpg",
    href: "https://kzmktempo.ru/geografiya-biznesa/geografiya-biznesa_6.html",
  },
  {
    num: "03",
    year: "2021",
    client: "ПАО «ГАЗПРОМ НЕФТЬ»",
    name: "Московский нефтеперерабатывающий завод",
    location: "г. Москва",
    desc: "Сварные балки и несущие конструкции для масштабной модернизации столичного НПЗ.",
    img: "/project_mnpz.jpg",
    href: "https://kzmktempo.ru/geografiya-biznesa/geografiya-biznesa_37.html",
  },
  {
    num: "04",
    year: "2020",
    client: "ПАО «Татнефть»",
    name: "Комплекс нефтехимических заводов ТАНЭКО",
    location: "г. Нижнекамск, Татарстан",
    desc: "Полный цикл КМД и производство металлоконструкций для многопролётных производственных корпусов.",
    img: "/project_taneco.jpg",
    href: "https://kzmktempo.ru/geografiya-biznesa/geografiya-biznesa_4.html",
  },
  {
    num: "05",
    year: "2019",
    client: "ПАО «ГАЗПРОМ»",
    name: "Лахта Центр — штаб-квартира Газпрома",
    location: "г. Санкт-Петербург",
    desc: "Высотные металлоконструкции для самого северного небоскрёба в мире — 462 м над уровнем Балтики.",
    img: "/project_lakhta.jpg",
    href: "https://kzmktempo.ru/geografiya-biznesa/geografiya-biznesa_36.html",
  },
  {
    num: "06",
    year: "2018",
    client: "АО «НижнекамскНефтехим»",
    name: "Завод по производству полиэтилена",
    location: "г. Нижнекамск, Татарстан",
    desc: "Промышленные металлоконструкции для нефтехимического производства мирового уровня.",
    img: "/project_nknh.jpg",
    href: "https://kzmktempo.ru/geografiya-biznesa/geografiya-biznesa_27.html",
  },
];

export function Projects() {
  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoRef.current) clearInterval(autoRef.current);
      setPrevIdx(idx);
      setIdx(next);
      setBusy(true);
      timerRef.current = setTimeout(() => {
        setPrevIdx(null);
        setBusy(false);
      }, 1000);
    },
    [idx, busy]
  );

  const goPrev = useCallback(() => go((idx - 1 + projects.length) % projects.length), [go, idx]);
  const goNext = useCallback(() => go((idx + 1) % projects.length), [go, idx]);

  useEffect(() => {
    autoRef.current = setInterval(() => {
      go((idx + 1) % projects.length);
    }, 7000);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [idx, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const p = projects[idx];

  return (
    <section className="projects" id="projects" data-testid="section-projects">

      {/* image slides */}
      <div className="projects-slides" aria-hidden="true">
        {projects.map((proj, i) => (
          <div
            key={proj.num}
            className={[
              "projects-slide",
              i === idx ? "is-active" : "",
              i === prevIdx ? "is-exiting" : "",
            ].filter(Boolean).join(" ")}
            style={{ backgroundImage: `url(${proj.img})` }}
          />
        ))}
        <div className="projects-overlay" />
      </div>

      {/* content */}
      <div className="container projects-content">
        <p className="projects-section-label">Знаковые объекты</p>

        <div className="projects-body" key={idx}>
          <div className="projects-meta">
            <span className="projects-meta-num">{p.num}</span>
            <span className="projects-meta-rule" aria-hidden="true" />
            <span className="projects-meta-year">{p.year}</span>
            <span className="projects-meta-client">{p.client}</span>
          </div>

          <h2 className="projects-name display">{p.name}</h2>
          <p className="projects-desc">{p.desc}</p>

          <div className="projects-cta-row">
            <a
              className="projects-link"
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`link-project-${p.num}`}
            >
              Подробнее об объекте
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M1 12L12 1M12 1H4M12 1V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <span className="projects-location">{p.location}</span>
          </div>
        </div>

        {/* bottom bar */}
        <div className="projects-bar">
          <div className="projects-dots" role="tablist" aria-label="Навигация по проектам">
            {projects.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Проект ${projects[i].num}`}
                className={`projects-dot${i === idx ? " is-active" : ""}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <div className="projects-arrows">
            <button className="projects-arrow" onClick={goPrev} aria-label="Предыдущий">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M11 13.5L6.5 9L11 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="projects-arrow" onClick={goNext} aria-label="Следующий">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M7 4.5L11.5 9L7 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <a
            className="projects-all-link"
            href="https://kzmktempo.ru/geografiya-biznesa/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Все объекты <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* progress bar */}
      <div className="projects-progress" aria-hidden="true">
        <div
          className="projects-progress-fill"
          style={{ width: `${((idx + 1) / projects.length) * 100}%` }}
        />
      </div>
    </section>
  );
}