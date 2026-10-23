import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useSlowLoading from "../hooks/useSlowLoading";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const slow = useSlowLoading(busy, 3000);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(email, name, password);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.email?.[0] || data?.password?.[0] || "Could not register.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name}
          onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password (min 8 characters)" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        {slow && <p className="muted">Waking up the server, this can take up to a minute...</p>}
        <button type="submit" disabled={busy}>{busy ? "Creating account..." : "Register"}</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
