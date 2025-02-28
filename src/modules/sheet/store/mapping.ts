import {FieldMapping} from "../types";

import {Store} from "./types";

import {parseNumber, toList} from "@/lib/utils";

export const storeMapping: Record<string, FieldMapping<Store>> = {
  Nombre: {
    field: "name",
  },
  Descripcion: {
    field: "description",
  },
  Celular: {
    field: "phone",
  },
  Envio: {
    field: "deliveryPrice",
    transform: (value: string) => parseNumber(value),
  },
  Ubicacion: {
    field: "location",
  },
  Instagram: {
    field: "instagram",
  },
  Logo: {
    field: "logo",
  },
  Banner: {
    field: "banner",
  },
  "Opciones de envio": {
    field: "deliveryOptions",
    transform: (value: string) => toList(value),
  },
};
