import type {Product} from "@/modules/sheet/product/types";

import {ProductActions} from "./product-actions";

export type OrderProduct = Product & {quantity: number};
type Action<T extends ProductActions> = {type: T; payload: ProductPayload[T]};

interface ProductPayload {
  [ProductActions.ADD_QUANTITY]: {quantity: number; price: number};
  [ProductActions.SET_PRODUCT]: OrderProduct;
}

export type ProductAction =
  | Action<ProductActions.ADD_QUANTITY>
  | Action<ProductActions.SET_PRODUCT>;
