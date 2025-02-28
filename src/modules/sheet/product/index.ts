import type {Product, ProductDTO} from "./types";

import {ranges} from "../ranges";
import {fetchProductsFromSheet} from "../utils";

import {toSlug} from "@/lib/utils";

export async function fetchProduct(url: string): Promise<ProductDTO[]> {
  const products = await fetchProductsFromSheet(
    url,
    ranges.product, // Ajustar el rango según tus columnas
  );

  return products;
}

export async function getProduct(url: string): Promise<Product[]> {
  const products = await fetchProduct(url);

  const prds: Product[] = products.map((x) => ({...x, slug: toSlug(`${x.name}-${x.variant}`)}));

  return prds;
}
