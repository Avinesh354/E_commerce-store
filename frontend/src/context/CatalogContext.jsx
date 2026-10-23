import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const EMPTY = { categories: [], products: [], loaded: false, failed: false };
const CatalogContext = createContext(EMPTY);

// The product list is saved inside the website (public/catalog.json), so browsing is instant
// even when the free server is asleep. Login, cart and orders still use the server.
export function CatalogProvider({ children }) {
  const [state, setState] = useState(EMPTY);

  useEffect(() => {
    let active = true;

    fetch("/catalog.json")
      .then((res) => {
        if (!res.ok) throw new Error("catalog.json not found");
        return res.json();
      })
      .then((data) => {
        if (active) setState({ categories: data.categories, products: data.products, loaded: true, failed: false });
      })
      .catch(() => {
        if (active) setState({ ...EMPTY, loaded: true, failed: true });
      });

    // Wake the free server in the background, so login and cart are ready when needed.
    api.get("/categories/").catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return <CatalogContext.Provider value={state}>{children}</CatalogContext.Provider>;
}

export const useCatalog = () => useContext(CatalogContext);
