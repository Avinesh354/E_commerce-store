import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function HeroBanner({ slides }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || paused || prefersReducedMotion()) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 5500);
    return () => clearInterval(timer);
  }, [count, paused]);

  if (count === 0) return null;

  const current = Math.min(index, count - 1);
  const go = (n) => setIndex((n + count) % count);

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="hero-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide, i) => (
          <div
            className="hero-slide"
            key={slide.key}
            style={{ background: slide.color }}
            aria-hidden={i !== current}
          >
            <div className="hero-copy">
              <h2>{slide.title}</h2>
              <p>{slide.text}</p>
              <p className="hero-offer">{slide.offer}</p>
              <Link to={slide.to} className="btn-hero" tabIndex={i === current ? 0 : -1}>
                {slide.cta}
              </Link>
            </div>
            <div className="hero-art" aria-hidden="true">
              {slide.images.slice(0, 3).map((product) => (
                <div className="hero-tile" key={product.id}>
                  <ProductImage product={product} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button className="hero-arrow prev" aria-label="Previous offer" onClick={() => go(current - 1)}>
            ‹
          </button>
          <button className="hero-arrow next" aria-label="Next offer" onClick={() => go(current + 1)}>
            ›
          </button>
          <div className="hero-dots">
            {slides.map((slide, i) => (
              <button
                key={slide.key}
                className={i === current ? "dot active" : "dot"}
                aria-label={`Show offer ${i + 1}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
