const icon = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ITEMS = [
  {
    title: "Free delivery",
    text: "No delivery charge on any order",
    svg: (
      <svg viewBox="0 0 24 24" width="30" height="30" {...icon}>
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    ),
  },
  {
    title: "Secure checkout",
    text: "Protected sign-in and your own cart",
    svg: (
      <svg viewBox="0 0 24 24" width="30" height="30" {...icon}>
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Easy cancellation",
    text: "Cancel a pending order and stock returns",
    svg: (
      <svg viewBox="0 0 24 24" width="30" height="30" {...icon}>
        <path d="M4 12a8 8 0 0 1 14-5.3" />
        <path d="M20 4v4h-4" />
        <path d="M20 12a8 8 0 0 1-14 5.3" />
        <path d="M4 20v-4h4" />
      </svg>
    ),
  },
  {
    title: "Order tracking",
    text: "See every status update on a timeline",
    svg: (
      <svg viewBox="0 0 24 24" width="30" height="30" {...icon}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
];

export default function TrustStrip() {
  return (
    <section className="trust" aria-label="Shopping benefits">
      {ITEMS.map((item) => (
        <div className="trust-item" key={item.title}>
          <span className="trust-icon">{item.svg}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
