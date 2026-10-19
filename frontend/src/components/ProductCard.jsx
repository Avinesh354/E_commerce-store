import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import PriceBlock from "./PriceBlock";
import ProductImage from "./ProductImage";
import Rating from "./Rating";

export default function ProductCard({ product }) {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const soldOut = product.stock === 0;

  const add = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    await addToCart(product.id, 1);
  };

  let note = "Free delivery";
  if (soldOut) note = "Currently unavailable";
  else if (product.stock <= 5) note = `Only ${product.stock} left`;

  return (
    <article className="pcard">
      <Link to={`/product/${product.id}`} className="pcard-link">
        <div className="pcard-media">
          <ProductImage product={product} />
          {soldOut && <span className="pcard-flag">Out of stock</span>}
        </div>
        <h3 className="pcard-name">{product.name}</h3>
        <Rating id={product.id} />
        <PriceBlock product={product} />
        <p className={soldOut || product.stock <= 5 ? "pcard-note warn" : "pcard-note"}>{note}</p>
      </Link>
      <button className="btn-cart" onClick={add} disabled={soldOut}>
        {soldOut ? "Out of stock" : "Add to cart"}
      </button>
    </article>
  );
}
