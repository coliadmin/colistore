import {authHeader} from "../utils";

import {ProductTypes} from "./product";
import {CompanyDTO} from "./types";
import {getStorageId, normalizeUrl, toCompanyDTO} from "./utils";

import {config} from "@/lib/config";

export async function fetchCompany(domain: string): Promise<CompanyDTO | null> {
  const url = normalizeUrl(domain);

  const endpoint = `${config.api.URL}/companies?filter=domainName.primaryLinkUrl[eq]:${url}`;

  const options = {
    method: "GET",
    headers: {
      ...authHeader,
      Accept: "application/json",
    },
  };

  try {
    const response = await fetch(endpoint, {
      ...options,
    });
    const json = await response.json();

    if (response.status !== 200) {
      throw new Error(JSON.stringify("Error", null, 2));
    }

    const {
      data: {companies},
    } = json;

    if (companies.length === 0) {
      return null;
    }

    const company = toCompanyDTO(companies[0]);

    return company;
  } catch (error) {
    throw error;
  }
}

export async function fetchDomains(): Promise<{domain: string; storage: string}[]> {
  const endpoint = `${config.api.URL}/companies?depth=0`;

  const options = {
    method: "GET",
    headers: {
      ...authHeader,
      Accept: "application/json",
    },
  };

  try {
    const response = await fetch(endpoint, {
      ...options,
    });
    const json = await response.json();

    if (response.status !== 200) {
      throw Error(JSON.stringify("Error", null, 2));
    }

    const {
      data: {companies: companiesBase},
    } = json;

    if (companiesBase.length === 0) {
      return [];
    }

    const companies = companiesBase as {
      domainName: {primaryLinkUrl: string};
      product: string[];
      storage: {primaryLinkUrl: string};
    }[];

    // const domains = companies
    //   .map(
    //     ({
    //       domainName: {primaryLinkUrl: domainUrl},
    //       product,
    //       storage: {primaryLinkUrl: storageUrl},
    //     }) => {
    //       if (!product) return null;

    //       if (
    //         product.includes(ProductTypes.COLISTORE.toUpperCase()) ||
    //         product.includes(ProductTypes.DEV.toLocaleUpperCase())
    //       ) {
    //         const url = domainUrl.split("//")[1];

    //         const storage = storageUrl === "" ? config.api.DEV_STORAGE! : storageUrl;

    //         return {
    //           domain: url,
    //           storage: getStorageId(storage),
    //         };
    //       } else {
    //         return "";
    //       }
    //     },
    //   )
    //   .filter((x) => x !== "");

    // return domains;

    const domains = companies
      .map(
        ({
          domainName: {primaryLinkUrl: domainUrl},
          product,
          storage: {primaryLinkUrl: storageUrl},
        }) => {
          if (!product) return null; // Return null instead of empty string

          if (
            product.includes(ProductTypes.COLISTORE.toUpperCase()) ||
            product.includes(ProductTypes.DEV.toLocaleUpperCase())
          ) {
            const url = domainUrl.split("//")[1];

            const storage = storageUrl === "" ? config.api.DEV_STORAGE! : storageUrl;

            return {
              domain: url,
              storage: getStorageId(storage),
            };
          } else {
            return null; // Return null instead of empty string
          }
        },
      )
      .filter((x): x is {domain: string; storage: string} => x !== null); // Type guard

    return domains;
  } catch (error) {
    throw error;
  }
}
