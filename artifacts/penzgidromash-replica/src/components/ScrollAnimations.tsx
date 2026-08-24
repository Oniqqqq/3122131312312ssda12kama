import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * AnimatedCounter component for stats.
 * Animates from 0 to `target` every time it enters the viewport (scroll down & scroll back up).
 */
interface AnimatedStatProps {
  target: number;
  suffix?: string;
  isSup?: boolean;
  label: string;
}

export const AnimatedStat: React.FC<AnimatedStatProps> = ({
  target,
  suffix = "",
  isSup = false,
  label,
}) => {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const objRef = useRef({ val: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isMobile = window.innerWidth <= 800;

    const tween = gsap.to(objRef.current, {
      val: target,
      duration: isMobile ? 1.0 : 1.6,
      ease: "power2.out",
      paused: true,
      onUpdate: () => {
        setCount(Math.floor(objRef.current.val));
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: isMobile ? "top 95%" : "top 88%",
      end: "bottom 10%",
      onEnter: () => {
        objRef.current.val = 0;
        setCount(0);
        tween.restart();
      },
      onEnterBack: () => {
        objRef.current.val = 0;
        setCount(0);
        tween.restart();
      },
      onLeave: () => {
        tween.pause();
        objRef.current.val = 0;
        setCount(0);
      },
      onLeaveBack: () => {
        tween.pause();
        objRef.current.val = 0;
        setCount(0);
      },
    });

    return () => {
      trigger.kill();
      tween.kill();
    };
  }, [target]);

  return (
    <div className="stat" ref={containerRef}>
      <div className="stat-value">
        {count}
        {suffix && (isSup ? <sup>{suffix}</sup> : suffix)}
      </div>
      <span className="stat-label">{label}</span>
    </div>
  );
};

/**
 * WordReveal component (Apple style).
 * On Mobile: triggers earlier & completes faster so text is already 100% visible when scrolled into view.
 * On Desktop: smooth scrubbed illumination.
 */
interface WordRevealProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  accentWords?: string[];
}

export const WordReveal: React.FC<WordRevealProps> = ({
  text,
  className = "",
  as: Component = "p",
  accentWords = [],
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLSpanElement>(".reveal-word");
    if (!words.length) return;

    const isMobile = window.innerWidth <= 800;

    const st = gsap.fromTo(
      words,
      { opacity: 0.15, y: isMobile ? 3 : 6, filter: isMobile ? "blur(1px)" : "blur(3px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: isMobile ? 0.04 : 0.1,
        ease: "power1.out",
        scrollTrigger: {
          trigger: el,
          start: isMobile ? "top 96%" : "top 82%",
          end: isMobile ? "top 55%" : "bottom 35%",
          scrub: isMobile ? 0.2 : 0.6,
        },
      }
    );

    return () => {
      st.scrollTrigger?.kill();
      st.kill();
    };
  }, [text]);

  const words = text.split(" ");

  return (
    <Component className={className} ref={containerRef as any}>
      {words.map((word, i) => {
        const isAccent = accentWords.some((acc) =>
          word.toLowerCase().includes(acc.toLowerCase())
        );

        return (
          <span
            key={i}
            className={`reveal-word ${isAccent ? "blue" : ""}`}
            style={{ display: "inline-block", marginRight: "0.26em" }}
          >
            {word}
          </span>
        );
      })}
    </Component>
  );
};

/**
 * FadeUpScroll component (Revolut style).
 * On Mobile: triggers instantly at top 96% with faster duration so text is visible on scroll.
 */
interface FadeUpScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FadeUpScroll: React.FC<FadeUpScrollProps> = ({
  children,
  className = "",
  delay = 0,
}) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const isMobile = window.innerWidth <= 800;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: isMobile ? 18 : 36, filter: isMobile ? "blur(2px)" : "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: isMobile ? 0.5 : 0.9,
        delay: isMobile ? delay * 0.4 : delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: isMobile ? "top 96%" : "top 88%",
          end: "bottom 10%",
          toggleActions: "play reverse play reverse",
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
};
