import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Products() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories/").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products/", {
        params: { search: search || undefined, category: category || undefined, page },
      })
      .then((res) => {
        setProducts(res.data.results);
        setHasNext(!!res.data.next);
      })
      .finally(() => setLoading(false));
  }, [search, category, page]);

  const addToCart = async (id) => {
    if (!isLoggedIn) return navigate("/login");
    try {
      await api.post("/cart/add/", { product_id: id, quantity: 1 });
      setMessage("Added to cart");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Could not add to cart.");
    }
  };

  return (
    <div>
      <div className="filters">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {message && <p className="message">{message}</p>}
      {loading && <p>Loading...</p>}
      {!loading && products.length === 0 && <p>No products found.</p>}

      <div className="grid">
        {products.map((p) => (
          <div className="product" key={p.id}>
            {p.image ? <img src={p.image} alt={p.name} /> : <div className="noimg">No image</div>}
            <h3>{p.name}</h3>
            <p className="muted">{p.category_name}</p>
            <p className="price">₹{p.price}</p>
            <button onClick={() => addToCart(p.id)} disabled={p.stock === 0}>
              {p.stock === 0 ? "Out of stock" : "Add to cart"}
            </button>
          </div>
        ))}
      </div>

      <div className="pager">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)} disabled={!hasNext}>Next</button>
      </div>
    </div>
  );
}