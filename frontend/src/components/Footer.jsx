import { Link } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";

export default function Footer() {
  const { categories } = useCatalog();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h3>About MyShop</h3>
          <ul>
            <li>About us</li>
            <li>Careers</li>
            <li>Contact us</li>
            <li>Press</li>
          </ul>
        </div>
        <div>
          <h3>Help</h3>
          <ul>
            <li>Payments</li>
            <li>Shipping</li>
            <li>Cancellation and returns</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h3>Policies</h3>
          <ul>
            <li>Terms of use</li>
            <li>Privacy</li>
            <li>Security</li>
          </ul>
        </div>
        <div>
          <h3>Shop</h3>
          <ul>
            {categories.slice(0, 7).map((c) => (
              <li key={c.id}>
                <Link to={`/products?category=${c.id}`}>{c.name}</Link>
              </li>
            ))}
            <li>
              <Link to="/products">All products</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 MyShop. A demo store built with React, Django REST Framework and MySQL.</p>
        <p>Ratings, reviews and discounts shown on products are sample data.</p>
      </div>
    </footer>
  );
}
