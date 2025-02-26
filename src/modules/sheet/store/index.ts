import {ranges} from "../ranges";
import {fetchDataFromSheet} from "../utils";

import {storeMapping} from "./mapping";
import {Store} from "./types";

export async function fetchStore(url: string): Promise<Store> {
  const defaultStore: Store = {
    name: "",
    description: "",
    phone: "",
    deliveryPrice: 0,
    location: "",
    instagram: "",
    logo: "",
    banner: "",
    deliveryOptions: [],
  };

  const store = await fetchDataFromSheet<Store>(url, ranges.store, storeMapping, defaultStore);

  return store;
}
