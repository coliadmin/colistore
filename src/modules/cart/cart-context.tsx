"use client";

import type {Cart, CartItem, OrderDetails} from "./types";
import type {Product} from "@/modules/sheet/product/types";
import type {Company} from "../twenty/company/types";

import {createContext, useContext, useMemo, useReducer, useState} from "react";
import {Item} from "@radix-ui/react-radio-group";
import {SearchCode} from "lucide-react";

import {useCompany} from "../twenty/company/company-context";

import {CartActions, cartReducer, Payload} from "./cart-reducer";
import {Checkout} from "./utils";
import {PaymentMethod} from "./payment-method";

import {Button} from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Counter} from "@/components/counter";

interface Context {
  state: {
    cart: Cart;
    total: number;
    quantity: number;
  };
  actions: {
    addItem: (product: Payload["add"]) => void;
    // removeItem: (id: string) => void;
    updateItem: (product: Payload["update"]) => void;
  };
}

const CartContext = createContext({} as Context);

type Props = {
  children: React.ReactNode;
};

export function CartProviderClient({children}: Props) {
  const [cart, dispatch] = useReducer(cartReducer, new Map());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [company] = useCompany();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.MERCADO_PAGO);
  const [cashAmount, setCashAmount] = useState<number>();
  const [customerName, setCustomerName] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const deliveryOptions = company.store?.deliveryOptions || [];
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "take-away">(
    deliveryOptions.includes("envio") && !deliveryOptions.includes("take-away")
      ? "delivery"
      : deliveryOptions.includes("take-away") && !deliveryOptions.includes("envio")
        ? "take-away"
        : "delivery",
  );

  const istakeaway = deliveryMethod === "take-away";

  const items = useMemo(() => Array.from(cart.values()), [cart]);
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const basePrice = paymentMethod === PaymentMethod.EFECTIVO ? item.cashPrice : item.listPrice;

      const discountedPrice = item.discount ? basePrice * (1 - item.discount / 100) : basePrice;

      return Math.round(acc + item.quantity * discountedPrice);
    }, 0);
  }, [items, paymentMethod]);

  const total = useMemo(() => {
    const deliveryPrice = istakeaway ? 0 : company.store?.deliveryPrice || 0;

    return Math.round(subtotal + deliveryPrice);
  }, [subtotal, company, istakeaway]);

  const totalSavings = useMemo(() => {
    return items.reduce((acc, item) => {
      const listPriceTotal = item.listPrice * item.quantity * (1 - item.discount / 100);
      const cashPriceTotal = item.cashPrice * item.quantity * (1 - item.discount / 100);

      return Math.round(acc + (listPriceTotal - cashPriceTotal));
    }, 0);
  }, [items]);

  const quantity = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);

  const state: Context["state"] = {
    cart,
    quantity,
    total,
  };

  const actions: Context["actions"] = {
    addItem: function (prd: Payload["add"]) {
      dispatch({payload: prd, type: CartActions.ADD});
    },
    updateItem: function (prd: Payload["update"]) {
      if (prd.quantity === 0) {
        dispatch({payload: prd, type: CartActions.REMOVE});
        setIsOpen(false);
      } else {
        dispatch({payload: prd, type: CartActions.UPDATE});
      }
    },
  };

  const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseInt(e.target.value.replace(/[^0-9]/g, ""));

    setCashAmount(rawValue);
  };

  const isOrderValid = () => {
    if (!customerName.trim() || customerName.trim().length < 3) return false;
    if ((paymentMethod === PaymentMethod.EFECTIVO && !cashAmount) || cashAmount! < total)
      return false;
    if (deliveryMethod === "delivery" && address.trim().length === 0) return false;

    return true;
  };

  return (
    <CartContext.Provider value={{state, actions}}>
      <>
        {children}
        {Boolean(quantity) && (
          <div className="sticky bottom-0 z-50 flex w-full justify-center pb-4 sm:m-auto">
            <Button
              aria-label="Ver pedido"
              className="m-auto mx-2 max-w-[300] self-center bg-muted shadow-lg backdrop-blur"
              data-testid="show-cart"
              size="lg"
              type="button"
              variant="ghost"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <p className="leading-6">Ver pedido</p>
                  <p className="rounded-sm bg-black/25 px-2 py-1 text-xs font-semibold text-white/90">
                    {quantity} item
                  </p>
                </div>
                <p className="leading-6">${total}</p>
              </div>
            </Button>
          </div>
        )}
        {isOpen ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTitle hidden />
            <SheetContent className="flex h-full w-full flex-col px-0 sm:w-2/3 sm:pt-0 md:w-1/2 lg:w-[420px]">
              <SheetDescription hidden />
              <ScrollArea className="flex-grow overflow-y-auto px-4">
                <SheetHeader>
                  <div className="flex items-center justify-between pt-3">
                    <h2 className="text-xl font-bold">Tu pedido</h2>
                  </div>
                </SheetHeader>

                <section>
                  <ul className="mt-4 flex flex-col gap-1">
                    {items.map((item) => (
                      <>
                        <li
                          key={item.slug + "-" + item.quantity}
                          className="flex items-center justify-between"
                        >
                          <div className="ml-1 mt-1 flex w-full justify-between gap-2">
                            {item.variant ? (
                              <p className="self-top flex-grow whitespace-normal break-words text-lg font-semibold">
                                {item.name} ({item.variant})
                              </p>
                            ) : (
                              <p className="self-top flex-grow text-lg  font-semibold">
                                {item.name}
                              </p>
                            )}

                            <div className="mt-1 flex flex-col justify-between gap-1">
                              <div className="flex w-full justify-end place-self-end px-1 font-bold">
                                <Counter
                                  className="w-fit"
                                  disabled={(value) => value === 0}
                                  disabledMax={(value) => value >= 10000}
                                  value={item.quantity}
                                  onChange={(value) => {
                                    actions.updateItem({product: item!, quantity: value});
                                  }}
                                />
                              </div>
                              {paymentMethod === PaymentMethod.EFECTIVO ? (
                                <div className="mt-2 flex justify-end gap-2">
                                  <p className="text-md place-self-end align-bottom font-semibold text-green-600">
                                    $
                                    {Math.round(
                                      item.cashPrice * item.quantity * (1 - item.discount / 100),
                                    )}
                                  </p>
                                  <p className="text-md place-self-end align-bottom text-muted-foreground line-through">
                                    $
                                    {Math.round(
                                      item.listPrice * item.quantity * (1 - item.discount / 100),
                                    )}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-md mt-2 place-self-end font-semibold">
                                  $
                                  {Math.round(
                                    item.listPrice * item.quantity * (1 - item.discount / 100),
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </li>
                        <Separator />
                      </>
                    ))}
                  </ul>
                </section>

                {/* FORMULARIO */}
                <section className="mt-4 flex flex-col gap-4">
                  <h3 className="text-xl font-bold">Detalles del pedido</h3>

                  <h4 className="text-lg font-semibold">Medios de pago:</h4>
                  <RadioGroup
                    defaultValue={PaymentMethod.MERCADO_PAGO}
                    onValueChange={(e) => setPaymentMethod(e as PaymentMethod)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="r1" value={PaymentMethod.MERCADO_PAGO} />
                      <Label htmlFor="r1">{PaymentMethod.MERCADO_PAGO}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="r2" value={PaymentMethod.EFECTIVO} />
                      <Label htmlFor="r2">
                        {PaymentMethod.EFECTIVO}{" "}
                        {totalSavings > 0 && (
                          <span className="text-green-600">(ahorra ${totalSavings})</span>
                        )}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="r3" value={PaymentMethod.DEBITO_CREDITO} />
                      <Label htmlFor="r3">{PaymentMethod.DEBITO_CREDITO}</Label>
                    </div>
                  </RadioGroup>

                  {deliveryOptions.includes("envio") && deliveryOptions.includes("take-away") ? (
                    <>
                      <h4 className="text-lg font-semibold">Método de entrega:</h4>
                      <RadioGroup
                        defaultValue="delivery"
                        onValueChange={(e) => setDeliveryMethod(e as "delivery" | "take-away")}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="delivery" value="delivery" />
                          <Label htmlFor="delivery">Envío a domicilio</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="take-away" value="take-away" />
                          <Label htmlFor="take-away">Retiro en el local</Label>
                        </div>
                      </RadioGroup>

                      <div className="flex flex-col gap-2">
                        <h4 className="text-lg font-semibold">Datos personales:</h4>
                        <Input
                          placeholder="Nombre"
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />

                        <Input
                          disabled={deliveryMethod === "take-away"}
                          placeholder={
                            deliveryMethod === "take-away" ? "Retiro en el local" : "Dirección"
                          }
                          type="text"
                          value={deliveryMethod === "take-away" ? "" : address}
                          onChange={(e) => setAddress(e.target.value)}
                        />

                        <Input
                          disabled={paymentMethod !== PaymentMethod.EFECTIVO}
                          placeholder={
                            paymentMethod === PaymentMethod.EFECTIVO
                              ? "Con cuanto abonas?"
                              : "Pago con " + paymentMethod
                          }
                          type="text"
                          value={
                            paymentMethod === PaymentMethod.EFECTIVO
                              ? cashAmount
                                ? `$${cashAmount}`
                                : ""
                              : ""
                          }
                          onChange={handleCashChange}
                        />

                        {/* <Input
                          disabled={paymentMethod !== PaymentMethod.EFECTIVO}
                          placeholder={
                            paymentMethod === PaymentMethod.EFECTIVO
                              ? "Con cuanto abonas?"
                              : "Pago con " + paymentMethod
                          }
                          type="text"
                          value={cashAmount ? `$${cashAmount}` : ""}
                          onChange={handleCashChange}
                        /> */}
                      </div>
                    </>
                  ) : deliveryOptions.includes("envio") ? (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-lg font-semibold">Datos personales:</h4>
                      <Input
                        placeholder="Nombre"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />

                      <Input
                        id="address"
                        placeholder="Dirección"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />

                      <Input
                        disabled={paymentMethod !== PaymentMethod.EFECTIVO}
                        placeholder={
                          paymentMethod === PaymentMethod.EFECTIVO
                            ? "Con cuanto abonas?"
                            : "Pago con " + paymentMethod
                        }
                        type="text"
                        value={cashAmount ? `$${cashAmount}` : ""}
                        onChange={handleCashChange}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-lg font-semibold">Datos personales:</h4>
                      <Input
                        placeholder="Nombre"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />

                      <Input
                        disabled={paymentMethod !== PaymentMethod.EFECTIVO}
                        placeholder={
                          paymentMethod === PaymentMethod.EFECTIVO
                            ? "Con cuanto abonas?"
                            : "Pago con " + paymentMethod
                        }
                        type="text"
                        value={cashAmount ? `$${cashAmount}` : ""}
                        onChange={handleCashChange}
                      />
                    </div>
                  )}
                </section>
              </ScrollArea>
              {(deliveryOptions.includes("envio") && deliveryOptions.includes("take-away")) ||
                (deliveryOptions.includes("envio") ? null : (
                  <div className="px-0">
                    <Separator className="mb-3 flex items-stretch" />
                    <p className="mx-4 text-sm">Retira por {company.store?.location}</p>
                  </div>
                ))}
              {(deliveryOptions.includes("envio") && deliveryOptions.includes("take-away")) ||
              deliveryOptions.includes("envio") ? (
                <footer className="sticky bottom-0 space-y-1 border-t bg-background px-0">
                  <div className="gap-1">
                    <div className="flex items-center justify-between px-4 pt-2 text-muted-foreground">
                      <p className="text-sm">Envío</p>
                      {istakeaway ? (
                        <p className="text-sm">+ $0</p>
                      ) : (
                        <p className="text-sm">+ ${company.store?.deliveryPrice}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between px-4">
                      <p className="text-lg font-semibold ">Total</p>
                      <p className="text-lg font-semibold">${total}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-2 px-4 pt-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      className="flex flex-1 justify-center"
                      disabled={!isOrderValid()}
                      onClick={() =>
                        Checkout(
                          {
                            address: istakeaway === true ? "" : address,
                            cashAmount:
                              paymentMethod === PaymentMethod.EFECTIVO ? Number(cashAmount) : 0,
                            customerName,
                            paymentMethod,
                            totalAmount: total,
                            storeAddress: company.store!.location,
                          },
                          cart,
                          company.store!,
                          total,
                        )
                      }
                    >
                      <span>Confirmar pedido</span>
                    </Button>
                  </div>
                </footer>
              ) : (
                <div className="px-0">
                  <footer className="sticky bottom-0 space-y-3 border-t bg-background">
                    <div className="flex justify-between self-center px-4 pb-0 pt-3">
                      <p className="text-lg font-semibold">Total</p>
                      <p className="text-lg font-semibold">${total}</p>
                    </div>

                    <Separator className="px-0" />

                    <div className="flex gap-2 px-4">
                      <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancelar
                      </Button>
                      <Button
                        className="flex flex-1 justify-center"
                        disabled={!isOrderValid()}
                        onClick={() =>
                          Checkout(
                            {
                              address: istakeaway === true ? "" : address,
                              cashAmount:
                                paymentMethod === PaymentMethod.EFECTIVO ? Number(cashAmount) : 0,
                              customerName,
                              paymentMethod,
                              totalAmount: total,
                              storeAddress: company.store!.location,
                            },
                            cart,
                            company.store!,
                            total,
                          )
                        }
                      >
                        <span>Confirmar pedido</span>
                      </Button>
                    </div>
                  </footer>
                </div>
              )}
            </SheetContent>
          </Sheet>
        ) : null}
      </>
    </CartContext.Provider>
  );
}

export function useCart(): [Context["state"], Context["actions"]] {
  const {state, actions} = useContext(CartContext);

  return [state, actions];
}
