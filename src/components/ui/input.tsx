import * as React from "react";

import {cn} from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({className, type, ...props}, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-gray-600 bg-transparent px-3 py-1 text-base transition-all",
          "placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-0",
          "disabled:cursor-not-allowed disabled:border-gray-600 disabled:opacity-50",
          className,
        )}
        type={type}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export {Input};
