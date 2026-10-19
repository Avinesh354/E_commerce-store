import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Checkout() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/orders/", { shipping_address: address });
      await api.post(`/orders/${data.id}/pay/`); // demo payment, no real money
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not place the order.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h2>Checkout</h2>
      <form onSubmit={placeOrder}>
        <textarea placeholder="Shipping address" rows="4" value={address}
          onChange={(e) => setAddress(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={busy}>
          {busy ? "Placing order..." : "Place order (demo payment)"}
        </button>
      </form>
      <p className="muted">This is a demo. No real money is charged.</p>
    </div>
  );
}