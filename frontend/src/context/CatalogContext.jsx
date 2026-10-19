import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const CatalogContext = createContext({ categories: [], loaded: false });

export function CatalogProvider({ children }) {
  const [state, setState] = useState({ categories: [], loaded: false });

  useEffect(() => {
    let active = true;
    api
      .get("/categories/")
      .then((res) => active && setState({ categories: res.data, loaded: true }))
      .catch(() => active && setState({ categories: [], loaded: true }));
    return () => {
      active = false;
    };
  }, []);

  return <CatalogContext.Provider value={state}>{children}</CatalogContext.Provider>;
}

export const useCatalog = () => useContext(CatalogContext);
