import React, { useEffect, useRef, useState } from "react";
import flower from "../pictures/meadow/flower.png";
import backdrop from "../pictures/meadow/moonlit-meadow-v2.webp";
import firefly from "../pictures/meadow/watercolor-firefly-v2.webp";
import "./MoonlitMeadow.css";

const flowerGatherDuration = 2000;

const fireflies = [
  [13, 23, 56], [27, 39, 42], [79, 26, 62], [88, 49, 46],
  [17, 63, 64], [73, 58, 44], [34, 19, 38], [66, 17, 36],
  [9, 81, 44], [89, 77, 58], [35, 73, 34], [65, 83, 38],
];

export default function MoonlitMeadow({ paused }) {
  const sceneRef = useRef(null);
  const flyRefs = useRef([]);
  const pointerRef = useRef(null);
  const resetTimer = useRef(null);
  const [awake, setAwake] = useState(false);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  useEffect(() => {
    if (paused) {
      flyRefs.current.forEach((fly) => {
        fly.style.transform = "none";
        fly.style.removeProperty("opacity");
      });
      return undefined;
    }
    const scene = sceneRef.current;
    let frame;
    let visible = false;
    let width = scene.clientWidth;
    let height = scene.clientHeight;
    let previous = 0;
    let elapsed = 0;
    const positions = fireflies.map(() => ({ x: 0, y: 0 }));
    const animate = (now) => {
      const delta = previous ? Math.min(now - previous, 40) : 16;
      previous = now;
      elapsed += delta;
      const t = elapsed / 1000;
      const pointer = pointerRef.current;
      const attraction = pointer && now < pointer.until;
      fireflies.forEach(([x, y], i) => {
        const baseX = width * x / 100;
        const baseY = height * y / 100;
        let dx = Math.sin(t * 0.36 + i * 2.1) * 22;
        let dy = Math.cos(t * 0.28 + i * 1.7) * 17;
        const distance = attraction ? Math.hypot(pointer.x - baseX, pointer.y - baseY) : Infinity;
        const nearby = distance < 280 || (attraction && pointer.all);
        if (nearby) {
          const angle = i * 2.4 + t * 0.3;
          const radius = 42 + (i % 3) * 24;
          dx = pointer.x - baseX + Math.cos(angle) * radius;
          dy = pointer.y - baseY + Math.sin(angle) * radius;
        }
        const ease = 1 - Math.exp(-delta / 650);
        positions[i].x += (dx - positions[i].x) * ease;
        positions[i].y += (dy - positions[i].y) * ease;
        const fly = flyRefs.current[i];
        fly.style.transform = `translate(${positions[i].x}px, ${positions[i].y}px) rotate(${Math.sin(t * 0.5 + i) * 12}deg)`;
        fly.style.opacity = nearby ? "1" : String(0.65 + Math.sin(t * 0.7 + i) * 0.18);
      });
      frame = window.requestAnimationFrame(animate);
    };
    const sync = () => {
      window.cancelAnimationFrame(frame);
      previous = 0;
      if (visible && !document.hidden) frame = window.requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    const resize = new ResizeObserver(() => {
      width = scene.clientWidth;
      height = scene.clientHeight;
    });
    observer.observe(scene);
    resize.observe(scene);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.cancelAnimationFrame(frame);
    };
  }, [paused]);

  const attract = (event) => {
    if (paused || event.target.closest("a, button")) return;
    if (pointerRef.current?.all && performance.now() < pointerRef.current.until) return;
    const rect = sceneRef.current.getBoundingClientRect();
    pointerRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      until: performance.now() + 2200,
    };
  };

  const wakeFireflies = () => {
    const scene = sceneRef.current;
    const sceneBounds = scene.getBoundingClientRect();
    const flowerBounds = scene.querySelector(".moonlit-flower").getBoundingClientRect();
    pointerRef.current = {
      x: scene.clientWidth / 2,
      y: flowerBounds.top - sceneBounds.top + flowerBounds.height / 2,
      until: performance.now() + flowerGatherDuration,
      all: true,
    };
    setAwake(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setAwake(false), flowerGatherDuration);
  };

  return (
    <section
      ref={sceneRef}
      id="join"
      className={`moonlit-meadow${awake ? " is-awake" : ""}`}
      aria-labelledby="join-title"
      onPointerMove={(event) => { if (event.pointerType === "mouse") attract(event); }}
      onPointerDown={attract}
      onPointerLeave={() => { if (!pointerRef.current?.all) pointerRef.current = null; }}
    >
      <img className="moonlit-backdrop" src={backdrop} alt="" loading="lazy" decoding="async" />
      <div className="moonlit-fireflies" aria-hidden="true">
        {fireflies.map(([x, y, size], i) => (
          <img
            key={i}
            ref={(node) => { flyRefs.current[i] = node; }}
            className="moonlit-firefly"
            src={firefly}
            alt=""
            width="192"
            height="192"
            loading="lazy"
            draggable="false"
            style={{ left: `${x}%`, top: `${y}%`, "--fly-size": `${size}px` }}
          />
        ))}
      </div>
      <div className="moonlit-content">
        <button
          type="button"
          className="moonlit-flower"
          aria-label="Gather fireflies around the flower"
          onPointerEnter={wakeFireflies}
          onFocus={wakeFireflies}
          onClick={wakeFireflies}
        >
          <img src={flower} alt="" width="2048" height="2048" loading="lazy" decoding="async" draggable="false" />
        </button>
        <h2 id="join-title">See you in<br /><em>the meadow!</em></h2>
        <div className="moonlit-actions">
          <a className="meadow-button moonlit-cta" href="https://www.instagram.com/winghacks/">Follow @winghacks</a>
        </div>
      </div>
    </section>
  );
}
