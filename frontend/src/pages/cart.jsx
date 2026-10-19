import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Loading from "../components/Loading";
import ProductImage from "../components/ProductImage";
import { useCart } from "../context/CartContext";
import useSlowLoading from "../hooks/useSlowLoading";
import { demoMrp, rupees } from "../utils/format";

export default function Cart() {
  const { refreshCart } = useCart();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const slow = useSlowLoading(cart === null);

  useEffect(() => {
    let active = true;
    api
      .get("/cart/")
      .then((res) => active && setCart(res.data))
      .catch(() => active && setCart({ items: [], total: 0 }));
    return () => {
      active = false;
    };
  }, []);

  const changeQty = async (item, qty) => {
    setError("");
    try {
      const res = await api.patch(`/cart/items/${item.id}/`, { quantity: qty });
      setCart(res.data);
      refreshCart();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update the quantity.");
    }
  };

  const remove = async (item) => {
    const res = await api.delete(`/cart/items/${item.id}/`);
    setCart(res.data);
    refreshCart();
  };

  if (cart === null) return <Loading slow={slow} />;

  if (cart.items.length === 0) {
    return (
      <div className="empty">
        <h2>Your cart is empty</h2>
        <p className="muted">Add something you like and it will show up here.</p>
        <Link to="/products" className="btn-link">Start shopping</Link>
      </div>
    );
  }

  const units = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = Number(cart.total);
  const mrpTotal = cart.items.reduce(
    (sum, item) => sum + demoMrp(item.product.price, item.product.id) * item.quantity,
    0
  );
  const savings = Math.max(0, mrpTotal - total);

  return (
    <div className="cart-layout">
      <section className="cart-list">
        <h1>Your cart ({units} {units === 1 ? "item" : "items"})</h1>
        {error && <p className="error">{error}</p>}
        {cart.items.map((item) => (
          <div className="cart-row" key={item.id}>
            <Link to={`/product/${item.product.id}`} className="cart-thumb">
              <ProductImage product={item.product} />
            </Link>
            <div className="cart-info">
              <Link to={`/product/${item.product.id}`} className="cart-name">{item.product.name}</Link>
              <p className="muted">{item.product.category_name}</p>
              <p className="cart-price">{rupees(item.product.price)} each</p>
              <div className="cart-controls">
                <div className="qty">
                  <button onClick={() => changeQty(item, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease quantity">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => changeQty(item, item.quantity + 1)} aria-label="Increase quantity">+</button>
                </div>
                <button className="link-btn danger-text" onClick={() => remove(item)}>Remove</button>
              </div>
            </div>
            <div className="cart-subtotal">{rupees(item.subtotal)}</div>
          </div>
        ))}
      </section>

      <aside className="summary">
        <h2>Price details</h2>
        <dl>
          <div><dt>Price ({units} {units === 1 ? "item" : "items"})</dt><dd>{rupees(mrpTotal)}</dd></div>
          <div><dt>Discount</dt><dd className="green">-{rupees(savings)}</dd></div>
          <div><dt>Delivery charges</dt><dd className="green">Free</dd></div>
          <div className="summary-total"><dt>Total amount</dt><dd>{rupees(total)}</dd></div>
        </dl>
        <p className="green save-note">You will save {rupees(savings)} on this order</p>
        <Link to="/checkout" className="btn-buy block-btn">Proceed to checkout</Link>
      </aside>
    </div>
  );
}
