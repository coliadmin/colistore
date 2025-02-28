import {cn} from "@/lib/utils";
import {useCompany} from "@/modules/twenty/company/company-context";
import {Features} from "@/modules/twenty/company/features";
import {isFeature} from "@/modules/twenty/company/utils";

export function ProductDiscount({percentage}: {percentage: number}) {
  // QA BYPASS
  // const [company] = useCompany();
  // if (!isFeature(company.features, Features.DISCOUNT) || percentage === 0) {
  //   return null;
  // }

  return (
    <>
      {percentage === 0 ? null : (
        <div className="absolute right-[0%] top-0 z-20 flex h-[100%] w-[100%] rotate-0 items-start justify-start bg-gradient-to-t from-transparent via-transparent to-emerald-900/25">
          <span className="w-32 bg-green-900/25 px-2 py-[0.125rem] text-center text-xs font-bold backdrop-blur-md">
            🔥 {percentage}% OFF
          </span>
        </div>
      )}
    </>
  );
}

export function ProductDiscountPrice({percentage, price}: {percentage: number; price: number}) {
  // QA BYPASS
  // const [company] = useCompany();
  // if (!isFeature(company.features, Features.DISCOUNT) || percentage === 0) {
  //   return <span className={cn("text-sm font-medium")}>$ {p}</span>;
  // }

  const discountPrice = Math.round(price - price * (percentage / 100));

  return (
    <>
      {percentage === 0 ? (
        <span className={cn("text-sm font-medium")}>${price}</span>
      ) : (
        <div className="space-x-2">
          <span className="text-sm font-medium tracking-wide text-green-500">${discountPrice}</span>
          <span className={cn("text-xs text-muted-foreground line-through")}>${price}</span>
        </div>
      )}
    </>
  );
}
