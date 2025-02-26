import type {
  ProductsPerCategoryRecord,
  Company,
  CompanyCRM,
  CompanyDTO,
  Feature,
  Category,
} from "./types";

import {isLinkEmpty} from "../utils";

import {Features} from "./features";

import {config} from "@/lib/config";
import {toSlug} from "@/lib/utils";
import {Product} from "@/modules/sheet/product/types";

export function normalizeUrl(url: string, useHttp: boolean = false): string {
  if (useHttp) {
    return url.includes("http") ? url : "http://" + url;
  }

  return url.includes("https") ? url : "https://" + url;
}

export function isFeature(companyFeatures: Feature | null, toCheck: Features): boolean {
  if (!companyFeatures) return false;

  return companyFeatures[toCheck];
}

export function toCompanyDTO({
  id,
  name,
  domainName,
  product,
  features,
  storage: storageCRM,
}: CompanyCRM): CompanyDTO {
  const storage = isLinkEmpty(storageCRM) ? config.api.DEV_STORAGE! : storageCRM.primaryLinkUrl;

  const storageId = getStorageId(storage);

  const base: CompanyDTO = {
    id,
    name,
    domain: domainName.primaryLinkUrl,
    product: product === null ? null : product[0],
    features,
    storage: storageId,
  };

  return base;
}

export function toCompany(companyDTO: CompanyDTO): Company {
  const categories = new Map<Category["slug"], Category>();

  // Crear un mapa temporal para agrupar productos por categoría
  const categoryRecord: ProductsPerCategoryRecord = {};

  companyDTO.products?.forEach((product) => {
    product.categories?.forEach((category) => {
      if (!categoryRecord[category]) {
        categoryRecord[category] = [];
      }
      categoryRecord[category].push(product);
    });
  });

  // Convertir el mapa temporal en un `Map` con slugs como claves
  Object.entries(categoryRecord).forEach(([categoryName, products]) => {
    const slug = toSlug(categoryName);

    const prds: Product[] = products.map((x) => ({...x, slug: toSlug(x.name)}) as Product);

    categories.set(slug, {
      name: categoryName,
      slug,
      products: prds,
    });
  });

  const productsMap: Company["products"] = new Map();

  companyDTO.products!.forEach((p) => {
    const slug = toSlug(`${p.name}-${p.variant}`);
    const prd: Product = {...p, slug: toSlug(`${p.name}-${p.variant}`)};

    productsMap.set(slug, prd);
  });

  const company: Company = {
    ...companyDTO,
    categories,
    products: productsMap,
  };

  return company;
}

export function getStorageId(url: string): string {
  const regex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);

  const id = match ? match[1] : null;

  if (id === null) throw new Error("Error trying to get `storage id`");

  return id;
}
