import type {Product} from "@/modules/sheet/product/types";

import {PaymentMethod} from "./payment-method";

export interface CartItem extends Product {
  quantity: number;
}

export type Cart = Map<string, CartItem>;

export interface OrderDetails {
  paymentMethod: PaymentMethod;
  address: string;
  customerName: string;
  cashAmount: number;
  totalAmount: number;
  storeAddress: string;
}
