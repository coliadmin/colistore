import type {Link} from "./types";

import {config} from "@/lib/config";

export const authHeader = {
  Authorization: `Bearer ${config.api.TOKEN}`,
};

export function isLinkEmpty(link: Link): boolean {
  return link.primaryLinkUrl === "";
}
