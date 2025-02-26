import {headers} from "next/headers";

export function getDomain(): string {
  const h = headers();
  const d = h.get("host") || "colidevs.com";
  const domain = d.split(":")[0].toLowerCase();

  console.log("lib/domain getDomain | ", domain);

  return domain;
}
