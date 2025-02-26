import {OrderProduct, ProductAction} from "./types";
import {ProductActions} from "./product-actions";

export function productReducer(state: OrderProduct, action: ProductAction): OrderProduct {
  const {payload, type} = action;

  if (type === ProductActions.ADD_QUANTITY) {
    const {price, quantity} = payload;

    return {...state, quantity: quantity, listPrice: price};
  }

  if (type === ProductActions.SET_PRODUCT) {
    return payload;
  }

  return state;
}
