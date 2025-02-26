import type {Category} from "@/modules/twenty/company/types";

import {notFound} from "next/navigation";

import {getDomain} from "@/lib/domain";
import {Filters} from "@/components/filters";
import {CategorySection, type ViewType} from "@/components/category-section";
import {getData} from "@/lib/data";
import {fetchDomains} from "@/modules/twenty/company/data";
import {CompanyProviderClient} from "@/modules/twenty/company/company-context";
import {CartProviderClient} from "@/modules/cart/cart-context";

// export async function generateStaticParams() {
//   const allDomains = await fetchDomains();

//   const allPaths = allDomains
//     .flatMap(({domain}) => [
//       domain && {
//         domain: `${domain}`,
//       },
//     ])
//     .filter(Boolean);

//   return allPaths;
// }

type Props = {
  params: {product?: [product: string]};
  searchParams: {category: string; view: ViewType};
};

//TODO: Add image fallback(set default image on image error): banner, logo
export default async function HomePage({
  params: {product},
  searchParams: {category = "all", view = "list"},
}: Props) {
  const domain = getDomain();

  const company = await getData(domain);

  if (!company) {
    return notFound();
  }

  const {store, categories, features, products} = company;

  const categoryNames: Category[] = Array.from(categories!).map(
    ([slug, value]) => ({name: value.name, slug}) as Category,
  );

  const isAll = category === "all";

  const activeCategory = categories!.get(category);

  const categoriesList = Array.from(categories!.values());

  return (
    <CompanyProviderClient company={company}>
      <CartProviderClient>
        <div className="flex min-h-screen flex-col">
          <main className="flex flex-1 flex-col">
            <Filters categories={categoryNames} defaultCategory="all" defaultView="list" />
            <div className="space-y-4 p-4">
              {isAll ? (
                categoriesList.map((x) => (
                  <CategorySection key={x.slug} isActive category={x} viewType={view} />
                ))
              ) : (
                <CategorySection isActive category={activeCategory!} viewType={view} />
              )}
            </div>
          </main>
        </div>
      </CartProviderClient>
    </CompanyProviderClient>
  );
}
