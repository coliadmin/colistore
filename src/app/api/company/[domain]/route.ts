import {NextResponse} from "next/server";

import {setRevalidate} from "@/modules/twenty/company/redis";

//TODO: Add auth
export async function POST(req: Request, {params}: {params: {domain: string}}) {
  const {domain} = params;

  const response = await setRevalidate(domain);

  return NextResponse.json({revalidated: response});
}
