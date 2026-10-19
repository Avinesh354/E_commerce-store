import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");

  const load = () => api.get("/cart/").then((res) => setCart(res.data));

  useEffect(() => {
    load();
  }, []);

  const changeQty = async (item, qty) => {
    setError("");
    try {
      const res = await api.patch(`/cart/items/${item.id}/`, { quantity: qty });
      setCart(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update.");
    }
  };

  const remove = async (item) => {
    const res = await api.delete(`/cart/items/${item.id}/`);
    setCart(res.data);
  };

  if (!cart) return <p>Loading...</p>;

  return (
    <div>
      <h2>Your cart</h2>
      {error && <p className="error">{error}</p>}
      {cart.items.length === 0 ? (
        <p>Your cart is empty. <Link to="/">Browse products</Link></p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div className="row" key={item.id}>
              <div className="grow">
                <strong>{item.product.name}</strong>
                <p className="muted">₹{item.product.price} each</p>
              </div>
              <div className="qty">
                <button onClick={() => changeQty(item, item.quantity - 1)}
                  disabled={item.quantity <= 1}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => changeQty(item, item.quantity + 1)}>+</button>
              </div>
              <div className="price">₹{item.subtotal}</div>
              <button className="danger" onClick={() => remove(item)}>Remove</button>
            </div>
          ))}
          <h3 className="total">Total: ₹{cart.total}</h3>
          <Link to="/checkout" className="btn">Proceed to checkout</Link>
        </>
      )}
    </div>
  );
}