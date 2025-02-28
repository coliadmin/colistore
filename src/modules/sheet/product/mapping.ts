import type {ProductDTO} from "./types";
import type {FieldMapping} from "../types";

import {parseDiscount, parsePrice, toBoolean, toList} from "@/lib/utils";

export const productMapping: Record<string, FieldMapping<ProductDTO>> = {
  Nombre: {
    field: "name",
  },
  Variante: {
    field: "variant",
  },
  "Precio en Efectivo": {
    field: "cashPrice",
    transform: (value: string) => parsePrice(value),
  },
  "Precio de Lista": {
    field: "listPrice",
    transform: (value: string) => parsePrice(value),
  },
  Descuento: {
    field: "discount",
    transform: (value: string) => parseDiscount(value),
  },
  Descripcion: {
    field: "description",
  },
  Imagen: {
    field: "image",
  },
  Marca: {
    field: "brand",
  },
  Activo: {
    field: "active",
    transform: (value: string) => toBoolean(value),
  },
  Categoria: {
    field: "categories",
    transform: (value: string) => toList(value),
  },
};
