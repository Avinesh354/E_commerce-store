import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../context/CatalogContext";

const PAGE_SIZE = 12;

export default function Products() {
  const [params, setParams] = useSearchParams();
  const { categories, products, loaded } = useCatalog();

  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const ordering = params.get("ordering") || "";
  const page = Math.max(1, Number(params.get("page") || 1));

  const filtered = useMemo(() => {
    const words = search.toLowerCase().split(/\s+/).filter(Boolean);
    let list = products.filter((p) => {
      if (category && String(p.category) !== category) return false;
      const text = `${p.name} ${p.description} ${p.category_name}`.toLowerCase();
      return words.every((word) => text.includes(word));
    });
    if (ordering === "price") list = [...list].sort((a, b) => a.price - b.price);
    if (ordering === "-price") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, search, ordering]);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([name, value]) => {
      if (value) next.set(name, value);
      else next.delete(name);
    });
    if (!("page" in changes)) next.delete("page");
    setParams(next);
  };

  if (!loaded) return <Loading slow={false} />;

  const activeCategory = categories.find((c) => String(c.id) === category);
  let heading = "All products";
  if (search) heading = `Results for "${search}"`;
  else if (activeCategory) heading = activeCategory.name;

  const count = filtered.length;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const results = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pages = totalPages <= 10 ? Array.from({ length: totalPages }, (_, i) => i + 1) : [];

  return (
    <div className="listing">
      <aside className="sidebar">
        <h2>Categories</h2>
        <ul>
          <li>
            <button
              className={!category ? "side-item active" : "side-item"}
              onClick={() => update({ category: "" })}
            >
              All products
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button
                className={String(c.id) === category ? "side-item active" : "side-item"}
                onClick={() => update({ category: String(c.id) })}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="results">
        <div className="results-head">
          <div>
            <h1>{heading}</h1>
            <p className="muted">
              {count} {count === 1 ? "product" : "products"} found
            </p>
          </div>
          <label className="sort">
            Sort by
            <select value={ordering} onChange={(e) => update({ ordering: e.target.value })}>
              <option value="">Newest first</option>
              <option value="price">Price: low to high</option>
              <option value="-price">Price: high to low</option>
            </select>
          </label>
        </div>

        {results.length === 0 && (
          <div className="empty">
            <h2>No products found</h2>
            <p className="muted">Try a different word, or browse everything we have.</p>
            <Link to="/products" className="btn-link">Show all products</Link>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pager">
            <button disabled={page <= 1} onClick={() => update({ page: String(page - 1) })}>
              Previous
            </button>
            {pages.map((n) => (
              <button
                key={n}
                className={n === page ? "page-num active" : "page-num"}
                onClick={() => update({ page: String(n) })}
              >
                {n}
              </button>
            ))}
            {pages.length === 0 && <span className="muted">Page {page} of {totalPages}</span>}
            <button disabled={page >= totalPages} onClick={() => update({ page: String(page + 1) })}>
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
