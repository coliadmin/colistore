import {NextResponse} from "next/server";

import {getDomain} from "@/lib/domain";
import {getCompany} from "@/modules/twenty/company";

export async function GET() {
  const domain = getDomain();

  const company = await getCompany(domain);

  if (!company) {
    return NextResponse.json({error: "Company not found"}, {status: 404});
  }

  return NextResponse.json(company);
}
