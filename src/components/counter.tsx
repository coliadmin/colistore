"use client";

import {MinusCircle, PlusCircle} from "lucide-react";
import {useEffect, useState} from "react";

import {Button} from "./ui/button";

import {cn} from "@/lib/utils";

export type CounterProps = {
  onChange?: (value: number) => void;
  value?: number;
  step?: number;
  disabled?: (value: number) => boolean;
  disabledMax?: (value: number) => boolean;
  className?: string;
  children?: React.ReactNode;
};

export function Counter({
  onChange = () => {},
  value = 1,
  step = 1,
  disabled = (value) => value === 1,
  disabledMax = (value) => value >= 10,
  className,
  children,
}: CounterProps) {
  const [count, setCount] = useState(value);

  function handleSetCustomQuantity(quantityLambda: (x: number) => number) {
    setCount((x) => {
      const q = quantityLambda(x);

      return q;
    });
  }

  useEffect(() => {
    onChange(count);
  }, [count]);

  return (
    <div className={cn("flex w-full items-center justify-between", className)}>
      <span>{children}</span>
      <div className="-mr-3 flex">
        <Button
          className="m-0 h-7 p-0"
          disabled={disabled(count)}
          size="icon"
          variant="ghost"
          onClick={() => handleSetCustomQuantity((x) => x - step)}
        >
          <MinusCircle className="m-0 p-0" />
        </Button>
        <span className="ml-1 mr-1 w-4 items-center justify-center self-center text-center font-semibold">
          {count}
        </span>
        <Button
          className="m-0 h-7 p-0"
          disabled={disabledMax(count)}
          size="icon"
          variant="ghost"
          onClick={() => handleSetCustomQuantity((x) => x + step)}
        >
          <PlusCircle className="m-0 p-0" />
        </Button>
      </div>
    </div>
  );
}
