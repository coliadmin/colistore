import {redirect} from "next/navigation";

import {ProductTypes} from "@/modules/twenty/company/product";
import {Company} from "@/modules/twenty/company/types";
import {normalizeUrl, toCompany} from "@/modules/twenty/company/utils";

export async function getData(domain: string): Promise<Company | null> {
  const url = normalizeUrl(domain, true) + ":3000";
  const r = url + `/api/company`;

  console.log("lib/domain getDomain | ", r);

  const response = await fetch(r, {next: {tags: [domain]}});

  if (response.status !== 200) {
    return null;
  }

  const json = await response.json();

  const company = toCompany(json);

  return company;
}
