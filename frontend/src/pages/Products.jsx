import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../context/CatalogContext";
import useSlowLoading from "../hooks/useSlowLoading";

const PAGE_SIZE = 12;

export default function Products() {
  const [params, setParams] = useSearchParams();
  const { categories } = useCatalog();

  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const ordering = params.get("ordering") || "";
  const page = Number(params.get("page") || 1);
  const key = `${search}|${category}|${ordering}|${page}`;

  const [result, setResult] = useState({ key: null, data: { results: [], count: 0 } });
  const loading = result.key !== key;
  const slow = useSlowLoading(loading);

  useEffect(() => {
    let active = true;
    api
      .get("/products/", {
        params: {
          search: search || undefined,
          category: category || undefined,
          ordering: ordering || undefined,
          page,
        },
      })
      .then((res) => active && setResult({ key, data: res.data }))
      .catch(() => active && setResult({ key, data: { results: [], count: 0 } }));
    return () => {
      active = false;
    };
  }, [key, search, category, ordering, page]);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([name, value]) => {
      if (value) next.set(name, value);
      else next.delete(name);
    });
    if (!("page" in changes)) next.delete("page");
    setParams(next);
  };

  const activeCategory = categories.find((c) => String(c.id) === category);
  let heading = "All products";
  if (search) heading = `Results for "${search}"`;
  else if (activeCategory) heading = activeCategory.name;

  const { results, count } = result.data;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
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
            {!loading && (
              <p className="muted">
                {count} {count === 1 ? "product" : "products"} found
              </p>
            )}
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

        {loading && <Loading slow={slow} />}

        {!loading && results.length === 0 && (
          <div className="empty">
            <h2>No products found</h2>
            <p className="muted">Try a different word, or browse everything we have.</p>
            <Link to="/products" className="btn-link">Show all products</Link>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
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
