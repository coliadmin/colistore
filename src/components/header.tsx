import Image from "next/image";

import {Store} from "@/modules/sheet/store/types";
import {cn} from "@/lib/utils";

type Props = {
  store: Store;
};

export function Header({store}: Props) {
  return (
    <header className="relative h-[10vh] min-h-[256px] w-full overflow-hidden sm:h-[30vh] sm:min-h-[320px]">
      {!store.banner ? null : (
        <Image
          fill
          priority
          alt="Restaurant ambiance"
          className="object-cover brightness-[0.7]"
          src={store.banner}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-headerBackground via-headerBackground/20 to-headerBackground/10" />
      <div className="absolute inset-x-0 bottom-0 inline-flex space-x-4 space-y-4 p-6">
        {!store.logo ? null : (
          <div className="inline-flex items-center justify-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-lg border-2 border-headerBackground/20">
              <Image fill alt={store.name} className="object-cover" src={store.logo} />
            </div>
          </div>
        )}
        <div className={cn("w-full space-y-2", !store.logo ? "text-center" : "text-left")}>
          <h1 className="text-2xl font-bold text-headerForeground xl:text-4xl">{store.name}</h1>
          <p className="text-sm text-headerMutedForeground xl:text-lg">{store.description}</p>
        </div>
      </div>
    </header>
  );
}
