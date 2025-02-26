import type {CompanyDTO} from "./types";

import {ProductTypes} from "./product";

import {getRedisClient} from "@/lib/redis";
import {compressString, decompressString} from "@/lib/compression";

const product = ProductTypes.COLISTORE;

export const getRevalidate = async (domain: string) => {
  const redis = await getRedisClient();

  return await redis.get(`${product}:revalidate:${domain}`);
};

export const setRevalidate = async (domain: string) => {
  const redis = await getRedisClient();

  return await redis.set(`${product}:revalidate:${domain}`, "true");
};

export const delRevalidate = async (domain: string) => {
  const redis = await getRedisClient();

  return await redis.del(`${product}:revalidate:${domain}`);
};

export const getCachedCompany = async (domain: string) => {
  const redis = await getRedisClient();

  const gzip = await redis.get(`${product}:${domain}`);

  if (!gzip) return null;

  const json = await decompressString(gzip);

  const obj: CompanyDTO = JSON.parse(json);

  console.log("twenty/company getCachedCompany | Get company from REDIS");

  return obj;
};

export const setCachedCompany = async (domain: string, company: CompanyDTO) => {
  const redis = await getRedisClient();

  const json = JSON.stringify(company);

  const gzip = await compressString(json);

  return await redis.set(`${product}:${domain}`, gzip);
};
