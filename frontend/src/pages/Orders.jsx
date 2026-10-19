import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState(null);

  const load = () => api.get("/orders/").then((res) => setOrders(res.data));

  useEffect(() => {
    load();
  }, []);

  const act = async (id, action) => {
    await api.post(`/orders/${id}/${action}/`);
    load();
  };

  if (!orders) return <p>Loading...</p>;
  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div>
      <h2>Your orders</h2>
      {orders.map((o) => (
        <div className="order" key={o.id}>
          <div className="order-head">
            <strong>Order #{o.id}</strong>
            <span className={`badge ${o.status}`}>{o.status}</span>
            <span className="price">₹{o.total}</span>
          </div>
          {o.items.map((i) => (
            <p className="muted" key={i.id}>{i.quantity} x {i.name} - ₹{i.subtotal}</p>
          ))}
          <p className="muted">Ship to: {o.shipping_address}</p>

          <ul className="timeline">
            {o.history.map((h, idx) => (
              <li key={idx}>
                <strong>{h.status}</strong>
                <span className="muted"> {new Date(h.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>

          {o.status === "PENDING" && (
            <div className="actions">
              <button onClick={() => act(o.id, "pay")}>Pay (demo)</button>
              <button className="danger" onClick={() => act(o.id, "cancel")}>Cancel</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
