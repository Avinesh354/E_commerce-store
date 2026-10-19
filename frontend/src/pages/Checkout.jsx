import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Loading from "../components/Loading";
import ProductImage from "../components/ProductImage";
import { useCart } from "../context/CartContext";
import useSlowLoading from "../hooks/useSlowLoading";
import { rupees } from "../utils/format";

export default function Checkout() {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
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

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/orders/", { shipping_address: address });
      await api.post(`/orders/${data.id}/pay/`); // demo payment, no real money
      await refreshCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not place the order.");
    } finally {
      setBusy(false);
    }
  };

  if (cart === null) return <Loading slow={slow} />;

  if (cart.items.length === 0) {
    return (
      <div className="empty">
        <h2>Nothing to check out</h2>
        <p className="muted">Your cart is empty.</p>
        <Link to="/products" className="btn-link">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <form className="checkout-form" onSubmit={placeOrder}>
        <h1>Delivery address</h1>
        <textarea
          placeholder="House number, street, city, state and PIN code"
          rows="5"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-buy" disabled={busy}>
          {busy ? "Placing order..." : `Place order (${rupees(cart.total)})`}
        </button>
        <p className="muted">This is a demo checkout. No real money is charged.</p>
      </form>

      <aside className="summary">
        <h2>Order summary</h2>
        {cart.items.map((item) => (
          <div className="mini-row" key={item.id}>
            <div className="mini-thumb"><ProductImage product={item.product} /></div>
            <div>
              <p className="mini-name">{item.product.name}</p>
              <p className="muted">Qty {item.quantity}</p>
            </div>
            <span>{rupees(item.subtotal)}</span>
          </div>
        ))}
        <dl>
          <div><dt>Delivery charges</dt><dd className="green">Free</dd></div>
          <div className="summary-total"><dt>Total amount</dt><dd>{rupees(cart.total)}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
