import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Loading from "../components/Loading";
import PriceBlock from "../components/PriceBlock";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import ScrollRow from "../components/ScrollRow";
import Rating from "../components/Rating";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import useSlowLoading from "../hooks/useSlowLoading";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const [state, setState] = useState({ id: null, product: null, related: [] });
  const [qty, setQty] = useState(1);

  const loading = state.id !== id;
  const slow = useSlowLoading(loading);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const { data } = await api.get(`/products/${id}/`);
        if (!active) return;
        setQty(1);
        setState({ id, product: data, related: [] });
        try {
          const rel = await api.get("/products/", { params: { category: data.category } });
          if (active) {
            setState({
              id,
              product: data,
              related: rel.data.results.filter((p) => String(p.id) !== String(id)).slice(0, 12),
            });
          }
        } catch {
          // Related products are optional.
        }
      } catch {
        if (active) setState({ id, product: null, related: [] });
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <Loading slow={slow} />;

  const { product, related } = state;

  if (!product) {
    return (
      <div className="empty">
        <h2>We could not find that product</h2>
        <p className="muted">It may have been removed.</p>
        <Link to="/products" className="btn-link">Browse all products</Link>
      </div>
    );
  }

  const soldOut = product.stock === 0;
  const maxQty = Math.min(product.stock, 10);

  const add = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return false;
    }
    return addToCart(product.id, qty);
  };

  const buyNow = async () => {
    if (await add()) navigate("/cart");
  };

  let stockLine = "In stock";
  if (soldOut) stockLine = "Currently unavailable";
  else if (product.stock <= 5) stockLine = `Only ${product.stock} left in stock`;

  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`}>{product.category_name}</Link>
        <span>/</span>
        <span className="current">{product.name}</span>
      </nav>

      <div className="detail">
        <div className="detail-media">
          <ProductImage product={product} />
        </div>

        <div className="detail-info">
          <h1>{product.name}</h1>
          <Rating id={product.id} />
          <PriceBlock product={product} large />
          <p className="muted">Inclusive of all taxes</p>
          <p className={soldOut || product.stock <= 5 ? "stock warn" : "stock"}>{stockLine}</p>

          {!soldOut && (
            <label className="qty-pick">
              Quantity
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          )}

          <div className="detail-actions">
            <button className="btn-cart" onClick={add} disabled={soldOut}>Add to cart</button>
            <button className="btn-buy" onClick={buyNow} disabled={soldOut}>Buy now</button>
          </div>

          <h2 className="detail-sub">About this item</h2>
          <p>{product.description || "Details for this product will be added soon."}</p>

          <table className="specs">
            <tbody>
              <tr><th>Category</th><td>{product.category_name}</td></tr>
              <tr><th>Availability</th><td>{stockLine}</td></tr>
              <tr><th>Delivery</th><td>Free</td></tr>
              <tr><th>Cancellation</th><td>Free until the order ships</td></tr>
              <tr><th>Payment</th><td>Demo checkout, nothing is charged</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {related.length > 0 && (
        <section className="block">
          <h2 className="block-title">More in {product.category_name}</h2>
          <ScrollRow>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ScrollRow>
        </section>
      )}
    </>
  );
}
