"use client";
import type {Product, Product as ProductType} from "@/modules/sheet/product/types";

import Image from "next/image";
import {useMemo, useReducer, useState} from "react";

import {Card, CardContent} from "./ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {ScrollArea} from "./ui/scroll-area";
import {Separator} from "./ui/separator";
import {RadioGroup} from "./ui/radio-group";
import {Input} from "./ui/input";
import {Button} from "./ui/button";
import {Counter} from "./counter";
import {ProductDiscount, ProductDiscountPrice} from "./discount";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {cn} from "@/lib/utils";
import {useCart} from "@/modules/cart/cart-context";
import {productReducer} from "@/modules/cart/product/product-reducer";
import {ProductActions} from "@/modules/cart/product/product-actions";
import {isFeature} from "@/modules/twenty/company/utils";
import {useCompany} from "@/modules/twenty/company/company-context";
import {Features} from "@/modules/twenty/company/features";

type Props = {
  product: ProductType;
};

export function Product({product}: Props) {
  const [, cartActions] = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product>(product);

  const [open, setOpen] = useState<boolean>(false);

  const [company] = useCompany();

  const products = Array.from(company!.products!.values()).filter((p) => p.name === product.name);

  const [customProduct, customProductDispatch] = useReducer(productReducer, {
    ...selectedProduct,
    quantity: 1,
  });

  const quantity = useMemo(() => customProduct.quantity, [customProduct]);

  function handleConfirm() {
    cartActions.addItem({product: customProduct, quantity: customProduct.quantity});
    setOpen(false);
  }

  function handleOnVariantChange(value: string) {
    const newProduct = products.find((p) => p.name === product.name && p.variant === value)!;

    customProductDispatch({
      type: ProductActions.SET_PRODUCT,
      payload: {
        ...newProduct,
        quantity: 1,
      },
    });
  }

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden hover:cursor-pointer",
          "transition-colors duration-200 ease-linear hover:border-muted-foreground",
        )}
        onClick={() => {
          customProductDispatch({
            type: ProductActions.ADD_QUANTITY,
            payload: {
              price: selectedProduct.listPrice,
              quantity: 1,
            },
          });
          setOpen(true);
        }}
      >
        <CardContent className="relative p-0">
          <ProductDiscount percentage={selectedProduct.discount} />
          <div className="border-white/300 flex h-[125px] cursor-pointer items-start gap-3">
            <div className="relative h-32 w-32">
              {selectedProduct?.image ? (
                <Image
                  fill
                  alt={selectedProduct.name}
                  className="object-cover"
                  src={selectedProduct.image}
                />
              ) : (
                <div className="flex aspect-square h-[125px] w-full items-center justify-center overflow-hidden rounded-l-md bg-[#3f3f3f]">
                  <p
                    className="select-none text-8xl text-[#fff]"
                    style={{textShadow: "black 10px 0 10px"}}
                  >
                    ?
                  </p>
                </div>
              )}
            </div>
            <div className="flex h-full flex-1 flex-col justify-between pb-1 pr-1 pt-3">
              <div className="flex items-start gap-2">
                <div className="space-y-1">
                  <h3 className="line-clamp-1 font-medium leading-none">{selectedProduct.name}</h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>
              <div className="">
                <ProductDiscountPrice
                  percentage={selectedProduct.discount}
                  price={selectedProduct.listPrice}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {!open ? null : (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTitle hidden />
          <SheetContent
            className="flex h-full w-full flex-col px-0 sm:w-2/3 sm:pt-0 md:w-1/2 lg:w-[420px]"
            onCloseAutoFocus={(e) => e.preventDefault()}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <ScrollArea className="flex-grow overflow-y-auto px-4">
              <div className="relative h-64 w-full pt-4">
                {customProduct?.image ? (
                  <img
                    alt=""
                    className="m-auto h-full max-h-80 w-full max-w-80 object-cover"
                    src={customProduct?.image}
                  />
                ) : (
                  <div className="flex aspect-square h-[240px] w-full items-center justify-center overflow-hidden rounded-md bg-[#3f3f3f]">
                    <p
                      className="select-none text-9xl text-[#fff]"
                      style={{textShadow: "black 10px 0 10px"}}
                    >
                      ?
                    </p>
                  </div>
                )}
              </div>
              <SheetHeader className="flex flex-col items-center px-4 py-4">
                <div className="flex w-full">
                  <SheetTitle className="text-left text-2xl">{customProduct?.name}</SheetTitle>
                  {customProduct!.variant ? (
                    <Select value={customProduct.variant} onValueChange={handleOnVariantChange}>
                      <SelectTrigger className="ml-4 flex-1">
                        <SelectValue className="w-full">{customProduct.variant}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((item) => (
                          <SelectItem
                            key={`${item.name}-${item.variant}`}
                            className="w-full"
                            value={item.variant}
                          >
                            {item.variant}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                </div>
                <SheetDescription className="w-full text-left">
                  {customProduct?.description}
                </SheetDescription>
              </SheetHeader>
            </ScrollArea>
            <footer className="sticky bottom-0  border-t bg-background px-4 pt-1">
              <div className="flex w-full items-center justify-between gap-2 px-4 py-2 font-bold">
                <p className="text-l font-semibold">Cantidad</p>
                <Counter
                  className="w-fit"
                  disabled={(value) => value === 1}
                  disabledMax={(value) => value === 10000}
                  value={quantity}
                  onChange={(value) =>
                    customProductDispatch({
                      type: ProductActions.ADD_QUANTITY,
                      payload: {
                        quantity: value,
                        price: customProduct.listPrice,
                      },
                    })
                  }
                />
              </div>
              <div className="flex gap-1 px-4">
                <Button className="w-fit" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button className="inline-flex w-full justify-between" onClick={handleConfirm}>
                  <span className="text-start">Agregar</span>
                  <div className="flex-1 text-end">
                    <span>$</span>
                    <span className="inline-block w-12">
                      {customProduct.listPrice * customProduct.quantity}
                    </span>
                  </div>
                </Button>
              </div>
            </footer>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
