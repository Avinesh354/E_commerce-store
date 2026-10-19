import { Link } from "react-router-dom";
import { offPercent, rupees } from "../utils/format";
import ProductImage from "./ProductImage";

export default function DealCard({ title, to, products }) {
  return (
    <section className="deal">
      <h3 className="deal-title">{title}</h3>
      <div className="deal-grid">
        {products.slice(0, 4).map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="deal-item">
            <div className="deal-img">
              <ProductImage product={product} />
            </div>
            <p className="deal-name">{product.name}</p>
            <p className="deal-price">
              <strong>{rupees(product.price)}</strong>
              <span className="price-off">{offPercent(product.price, product.id)}% off</span>
            </p>
          </Link>
        ))}
      </div>
      <Link to={to} className="deal-more">See all in {title}</Link>
    </section>
  );
}
