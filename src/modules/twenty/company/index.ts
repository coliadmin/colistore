import type {CompanyDTO} from "./types";

import {fetchCompany} from "./data";
import {delRevalidate, getCachedCompany, getRevalidate, setCachedCompany} from "./redis";
import {toCompany} from "./utils";
import {ProductTypes} from "./product";

import {fetchStore} from "@/modules/sheet/store";
import {fetchProduct} from "@/modules/sheet/product";
import {sendAlert} from "@/modules/discord";

//TODO: Convert to redisAdapter https://github.com/redis-developer/session-store-nextjs/blob/main/lib/redis-adapter.js

export async function getCompany(domain: string): Promise<CompanyDTO | null> {
  const forceRevalidate = await getRevalidate(domain);

  let cachedCompany = null;

  if (!forceRevalidate) {
    cachedCompany = await getCachedCompany(domain);
  }

  if (cachedCompany) {
    return cachedCompany;
  }

  const company = await fetchCompany(domain);

  if (!company) {
    return null;
  }

  const sheetId = company.storage;

  const [store, product] = await Promise.all([fetchStore(sheetId), fetchProduct(sheetId)]);

  company.store = store;
  company.products = product;

  await setCachedCompany(domain, company);

  if (forceRevalidate) {
    await delRevalidate(domain);
  }

  if (company.product === null && company.product !== ProductTypes.DEV) {
    await sendAlert(
      `⚠️ WARNING ⚠️\n Cliente ${company.name}(${company.domain}) está usando '${ProductTypes.COLISTORE}' y no esta registrado en el CRM`,
    );
  }

  return company;
}
