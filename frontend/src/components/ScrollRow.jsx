import { useCallback, useEffect, useRef, useState } from "react";

// A row that scrolls sideways, with arrow buttons that appear when there is more to see.
export default function ScrollRow({ children }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scrollBy = (direction) => {
    const el = ref.current;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: calm ? "auto" : "smooth" });
  };

  return (
    <div className="scroller">
      {!edges.start && (
        <button className="scroll-arrow prev" aria-label="Scroll left" onClick={() => scrollBy(-1)}>
          ‹
        </button>
      )}
      <div className="row-scroll" ref={ref} onScroll={update}>
        {children}
      </div>
      {!edges.end && (
        <button className="scroll-arrow next" aria-label="Scroll right" onClick={() => scrollBy(1)}>
          ›
        </button>
      )}
    </div>
  );
}
