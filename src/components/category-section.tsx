import type {Category} from "@/modules/twenty/company/types";

import {Product} from "./product";

import {Product as ProductType} from "@/modules/sheet/product/types";

export type ViewType = "grid" | "list";

type CategorySectionProps = {
  category: Category;
  isActive: boolean;
  viewType: ViewType;
};

export function CategorySection({category, isActive, viewType}: CategorySectionProps) {
  if (!isActive) return null;

  const seenNames = new Set<string>();
  const uniqueProducts = category.products!.filter((product) => {
    if (seenNames.has(product.name)) {
      return false;
    }
    seenNames.add(product.name);

    return true;
  });

  return (
    <section className="mb-8">
      <h3 className="mb-4 text-xl font-semibold">{category.name}</h3>
      {viewType === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {uniqueProducts.map((product) => (
            <Product key={product.name} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {uniqueProducts.map((product) => (
            <Product key={product.name} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
