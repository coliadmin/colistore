import type {Store} from "@/modules/sheet/store/types";
import type {Product, ProductDTO} from "@/modules/sheet/product/types";

import {Link} from "../types";

export type Feature = {
  [featureName: string]: boolean;
};

interface CompanyBase {
  id: string;
  name: string;
  domain: string;
  product: string | null;
  features: Feature | null;
  storage: string;
}

export type CompanyCRM = Omit<CompanyBase, "product" | "storage" | "domain"> & {
  product: string[] | null;
  storage: Link;
  domainName: Link;
};

export interface CompanyDTO extends CompanyBase {
  store?: Store;
  products?: ProductDTO[];
}

export interface Category {
  name: string;
  slug: string;
  products?: Product[];
}

export type ProductsPerCategoryRecord = Record<string, ProductDTO[]>;

export type Company = Omit<CompanyDTO, "products"> & {
  categories?: Map<Category["slug"], Category>;
  products?: Map<string, Product>;
};
