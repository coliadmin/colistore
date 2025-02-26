import {Inter} from "next/font/google";

import "./globals.css";

import {getDomain} from "@/lib/domain";
import {cn} from "@/lib/utils";
import {Header} from "@/components/header";
import {getData} from "@/lib/data";
import {CartProviderClient} from "@/modules/cart/cart-context";
import {CompanyProviderClient} from "@/modules/twenty/company/company-context";

const inter = Inter({subsets: ["latin"]});

// export async function generateMetadata() {
//   const domain = getDomain();

//   const company = await getData(domain);

//   if (!company) {
//     return {
//       title: "Not found",
//     };
//   }

//   return {
//     title: company.name,
//   };
// }

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const domain = getDomain();
  const company = await getData(domain);

  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <div
          className={cn(
            inter.className,
            "min-h-screen border-border bg-background text-foreground antialiased 3xl:container",
          )}
        >
          {!company ? null : <Header store={company.store!} />}

          {children}

          <footer className="text-center leading-[4rem] opacity-70">
            © {new Date().getFullYear()} coli-store | by <em>colidevs</em>
          </footer>
        </div>
      </body>
    </html>
  );
}
