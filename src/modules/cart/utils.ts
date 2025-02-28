import type {Cart, CartItem, OrderDetails} from "./types";

import {PaymentMethod} from "./payment-method";

import {Store} from "@/modules/sheet/store/types";

export function generateWhatsAppOrderMessage(
  orderDetails: OrderDetails,
  cart: CartItem[],
  total: number,
) {
  let msg = "*Pedido:*\n";

  cart.sort((a, b) => a.quantity * a.listPrice - b.quantity * b.listPrice);

  cart.forEach((item) => {
    msg += `- (${item.quantity}) ${item.name} > $${item.listPrice * item.quantity}\n`;
  });

  msg += `\n`;

  msg += `*Datos:*\n`;
  msg += `- Pedido a nombre de: ${orderDetails.customerName}\n`;

  if (orderDetails.address) {
    msg += `- Entrega: Envío a *${orderDetails.address}*\n`;
  } else {
    msg += `- Entrega: *Retiro en ${orderDetails.storeAddress}*\n`;
  }

  msg += `- Forma de pago: ${orderDetails.paymentMethod}\n`;

  if (orderDetails.paymentMethod === PaymentMethod.EFECTIVO) {
    msg += `- Paga con: $${orderDetails.cashAmount}\n\n`;
  } else {
    msg += `\n`;
  }

  if (orderDetails.address) {
    msg += `*Total (incluye envío): $${total}*\n`;
  } else {
    msg += `*Total: $${total}*\n`;
  }

  if (orderDetails.paymentMethod === PaymentMethod.EFECTIVO) {
    const change = orderDetails.cashAmount - total;

    if (change > 0) {
      msg += `*Vuelto: $${change}*\n`;
    }
  }

  return msg;
}

export function Checkout(orderDetails: OrderDetails, cart: Cart, store: Store, total: number) {
  const values = Array.from(cart.values());

  const msg = generateWhatsAppOrderMessage(orderDetails, values, total);

  const wpp = `https://wa.me/${store.phone}?text=${encodeURIComponent(msg)}`;

  window.open(wpp, "_blank");
}
