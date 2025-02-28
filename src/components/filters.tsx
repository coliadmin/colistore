"use client";
import type {Category} from "@/modules/twenty/company/types";

import {useSearchParams, useRouter, usePathname} from "next/navigation";
import {LayoutGrid, LayoutList} from "lucide-react";

import {Button} from "./ui/button";

import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";

interface CategoryNavProps {
  categories: Category[];
  defaultCategory: "all";
  defaultView: "list" | "grid";
}

export function Filters({categories, defaultCategory, defaultView}: CategoryNavProps) {
  const categoryKey = "category";
  const viewKey = "view";
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const pathname = usePathname();

  const activeCategory = searchParams.get(categoryKey) ?? defaultCategory;
  const activeView = searchParams.get(viewKey) ?? defaultView;

  function handleOnChange(category: string) {
    if (category === activeCategory) {
      return;
    }

    params.delete(categoryKey);
    params.set(categoryKey, category);
    router.replace(`${pathname}?${params}`);
  }

  function handleClick() {
    const view = activeView === "list" ? "grid" : "list";

    params.delete(viewKey);
    params.set(viewKey, view);
    router.replace(`${pathname}?${params}`);
  }

  return (
    <div className="border-b">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 p-4">
          <Button
            className={cn(
              "rounded-[999900px] px-2 py-1 text-sm transition-colors",
              "border hover:bg-accent",
              "hidden sm:block",
            )}
            size="icon"
            type="button"
            variant="outline"
            onClick={handleClick}
          >
            {activeView === defaultView ? <LayoutGrid /> : <LayoutList />}
          </Button>
          <button
            className={cn(
              "rounded-full px-4 py-2 text-sm transition-colors",
              "border hover:bg-accent",
              activeCategory === defaultCategory &&
                "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
            type="button"
            onClick={() => handleOnChange(defaultCategory)}
          >
            Todos
          </button>
          {categories.map(({name, slug}) => (
            <button
              key={slug}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-colors",
                "border hover:bg-accent",
                activeCategory === slug && "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
              type="button"
              onClick={() => handleOnChange(slug)}
            >
              {name}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
