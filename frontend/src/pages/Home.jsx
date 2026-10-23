import { useMemo } from "react";
import { Link } from "react-router-dom";
import DealCard from "../components/DealCard";
import HeroBanner from "../components/HeroBanner";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import ScrollRow from "../components/ScrollRow";
import TrustStrip from "../components/TrustStrip";
import { useCatalog } from "../context/CatalogContext";
import { offPercent } from "../utils/format";

const COLORS = ["#1e40af", "#9a3412", "#9d174d", "#166534", "#5b21b6", "#0f766e", "#b45309"];

const COPY = {
  "Mobiles & Accessories": ["Phones and everything that goes with them", "Smartphones, cases, chargers and earphones."],
  Electronics: ["Gadgets that keep up with you", "Headphones, speakers, smart watches and TVs."],
  "Computers & Laptops": ["Work and play, sorted", "Laptops, monitors, keyboards and storage."],
  "Men's Fashion": ["Style that suits every day", "T-shirts, shirts, jeans, jackets and more."],
  "Women's Fashion": ["A fresh wardrobe for every day", "Kurtis, sarees, dresses and accessories."],
  Footwear: ["Find your next pair", "Running shoes, sneakers, sandals and formals."],
  "Watches & Accessories": ["The finishing touches", "Watches, sunglasses, wallets and bags."],
  "Home & Kitchen": ["Everything for a better kitchen", "Cookware, appliances and storage."],
  Furniture: ["Make your home feel finished", "Sofas, beds, desks and storage for every room."],
  "Home Decor & Lighting": ["Little things that make a home", "Lamps, frames, curtains and wall art."],
  Appliances: ["Big appliances, better prices", "Refrigerators, washing machines and more."],
  "Beauty & Personal Care": ["Look and feel your best", "Skincare, haircare and grooming."],
  "Sports & Fitness": ["Get moving", "Yoga, gym, cricket and cycling gear."],
  Books: ["Read something worth keeping", "Programming, finance and bestselling titles."],
  "Toys & Games": ["Fun for every age", "Blocks, board games, puzzles and more."],
};

const DEAL_CARDS = 9;

export default function Home() {
  const { categories, products, loaded, failed } = useCatalog();

  const sections = useMemo(
    () =>
      categories
        .map((category) => {
          const list = products.filter((p) => p.category === category.id);
          return { category, count: list.length, products: list.slice(0, 12) };
        })
        .filter((s) => s.count > 0),
    [categories, products]
  );

  if (!loaded) return <Loading slow={false} />;

  if (failed || sections.length === 0) {
    return (
      <div className="empty">
        <h2>The store is getting stocked</h2>
        <p className="muted">Products will appear here as soon as they are added.</p>
      </div>
    );
  }

  const slides = sections.slice(0, 4).map((s, i) => {
    const [title, text] = COPY[s.category.name] || [`Shop ${s.category.name}`, `Browse ${s.count} products.`];
    const best = Math.max(...s.products.map((p) => offPercent(p.price, p.id)));
    return {
      key: s.category.id,
      title,
      text,
      offer: `Up to ${best}% off`,
      cta: `Shop ${s.category.name}`,
      to: `/products?category=${s.category.id}`,
      color: COLORS[i % COLORS.length],
      images: s.products,
    };
  });

  const dealSections = sections.slice(0, DEAL_CARDS);
  // With many categories, the rows cover the ones after the deal cards.
  // With few categories, they reuse all of them with different products.
  const manyCategories = sections.length > DEAL_CARDS;
  const rowSections = manyCategories ? sections.slice(DEAL_CARDS) : sections;
  const rowOffset = manyCategories ? 0 : 4;

  return (
    <>
      <HeroBanner slides={slides} />
      <TrustStrip />

      <section className="deals" aria-label="Deals by category">
        {dealSections.map((s) => (
          <DealCard
            key={s.category.id}
            title={s.category.name}
            to={`/products?category=${s.category.id}`}
            products={s.products}
          />
        ))}
      </section>

      <section className="block">
        <h2 className="block-title">Shop by category</h2>
        <div className="cat-tiles">
          {sections.map((s) => (
            <Link key={s.category.id} to={`/products?category=${s.category.id}`} className="cat-tile">
              <div className="cat-tile-media">
                <ProductImage product={s.products[0]} />
              </div>
              <div className="cat-tile-text">
                <h3>{s.category.name}</h3>
                <p className="muted">{s.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {rowSections.map((s) => (
        <section className="block" key={s.category.id}>
          <div className="block-head">
            <h2 className="block-title">Best of {s.category.name}</h2>
            <Link to={`/products?category=${s.category.id}`} className="view-all">
              View all
            </Link>
          </div>
          <ScrollRow>
            {s.products.slice(rowOffset, rowOffset + 12).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollRow>
        </section>
      ))}
    </>
  );
}
