export type ProductDTO = {
  name: string;
  variant: string;
  cashPrice: number;
  listPrice: number;
  discount: number;
  description: string;
  image: string;
  brand: string;
  active: boolean;
  categories: string[];
};

export type Product = ProductDTO & {slug: string};
