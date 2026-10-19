import { demoRating, demoReviews } from "../utils/format";

export default function Rating({ id }) {
  return (
    <div className="rating">
      <span className="rating-chip">{demoRating(id)} ★</span>
      <span className="muted">({demoReviews(id).toLocaleString("en-IN")})</span>
    </div>
  );
}
