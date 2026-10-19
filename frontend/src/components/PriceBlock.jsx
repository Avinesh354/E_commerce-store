import { demoMrp, offPercent, rupees } from "../utils/format";

export default function PriceBlock({ product, large = false }) {
  return (
    <div className={large ? "price-block large" : "price-block"}>
      <span className="price-now">{rupees(product.price)}</span>
      <span className="price-mrp">{rupees(demoMrp(product.price, product.id))}</span>
      <span className="price-off">{offPercent(product.price, product.id)}% off</span>
    </div>
  );
}
