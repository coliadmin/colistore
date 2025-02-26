"use client";

import {createContext, useContext} from "react";

import {Company} from "./types";

interface Context {
  company: Company;
}

const CompanyContext = createContext({} as Context);

type Props = {
  children: React.ReactNode;
  company: Company;
};

export function CompanyProviderClient({children, company}: Props) {
  return <CompanyContext.Provider value={{company}}>{children}</CompanyContext.Provider>;
}

export function useCompany(): [Context["company"]] {
  const {company} = useContext(CompanyContext);

  return [company];
}
