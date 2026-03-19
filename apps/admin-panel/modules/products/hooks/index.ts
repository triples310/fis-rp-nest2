/**
 * Products Module Hooks
 */

import { useState, useEffect } from "react";
import { getProducts } from "../api";
import type { Product } from "../types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return { products, loading };
}
