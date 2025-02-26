"use client";

import {Product} from "../sheet/product/types";

import {Cart, CartItem} from "./types";

import {toSlug} from "@/lib/utils";

export enum CartActions {
  ADD,
  UPDATE,
  REMOVE,
}

export interface Payload {
  add: {product: Product; quantity: number};
  update: {product: Product; quantity: number};
}

export function cartReducer(state: Cart, action: {payload: object; type: CartActions}) {
  if (action.type === CartActions.ADD) {
    const {product, quantity} = action.payload as Payload["add"];

    const key = `${toSlug(product.name)}-${toSlug(product.variant)}`;

    const newCart = new Map(state);

    const existingItem = newCart.get(key);
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    newCart.set(key, {...product, quantity: newQuantity});

    return newCart;
  }
  if (action.type === CartActions.UPDATE) {
    const {product, quantity} = action.payload as Payload["update"];
    const key = `${toSlug(product.name)}-${toSlug(product.variant)}`;
    const existingItem = state.get(key);
    const updatedItem = {...existingItem!, quantity};

    return new Map(state.set(key, updatedItem));
  }
  if (action.type === CartActions.REMOVE) {
    const {product} = action.payload as Payload["update"];
    const key = `${toSlug(product.name)}-${toSlug(product.variant)}`;

    state.delete(key);

    return new Map(state);
  }

  return state;
}
