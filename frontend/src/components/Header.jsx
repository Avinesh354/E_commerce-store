import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCatalog } from "../context/CatalogContext";

const SearchIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

const CartIcon = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20.5 8H6" />
  </svg>
);

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const { count } = useCart();
  const { categories } = useCatalog();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("search") || "");

  const onListing = location.pathname === "/products";
  const activeCategory = onListing ? params.get("category") : null;
  const allActive = onListing && !params.get("category") && !params.get("search");

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  const signOut = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="topline">Free delivery on every order. This is a demo store, so no real payments are taken.</div>

      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">MyShop</Link>

          <form className="search" onSubmit={submit} role="search">
            <input
              aria-label="Search products"
              placeholder="Search for products and categories"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">{SearchIcon}</button>
          </form>

          <nav className="header-actions" aria-label="Account">
            {isLoggedIn ? (
              <>
                <Link to="/orders">Orders</Link>
                <button className="link-btn" onClick={signOut}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="btn-outline">Sign up</Link>
              </>
            )}
            <Link to="/cart" className="cart-link" aria-label={`Cart, ${count} items`}>
              {CartIcon}
              <span className="cart-label">Cart</span>
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          </nav>
        </div>
      </header>

      <nav className="catbar" aria-label="Categories">
        <div className="catbar-inner">
          <Link to="/products" className={allActive ? "active" : ""}>All products</Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/products?category=${c.id}`}
              className={String(c.id) === activeCategory ? "active" : ""}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
