import type {ProductDTO} from "./product/types";
import type {FieldMapping} from "./types";

import {productMapping} from "./product/mapping";

import {sheets as google} from "@/lib/google";
import {config} from "@/lib/config";

export async function fetchDataFromSheet<T>(
  spreadsheetId: string, // ID de la hoja de cálculo
  range: string, // Rango, ej: "Tienda!A2:I"
  mapping: Record<string, FieldMapping<T>>,
  defaultObject: T, // Objeto base con valores por defecto
): Promise<T> {
  const {data} = await google.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const values = data.values;

  if (!values || values.length < 2) {
    throw new Error(
      `Datos insuficientes en el rango "${range}". Se necesitan al menos encabezados y una fila de datos.`,
    );
  }

  const headers = values[0];
  const dataRow = values[1];

  // Copia el objeto por defecto para no mutarlo
  const result = {...defaultObject};

  headers.forEach((header, i) => {
    if (Object.prototype.hasOwnProperty.call(mapping, header)) {
      const {field, transform} = mapping[header];
      const rawValue = dataRow[i] ?? "";

      result[field] = transform ? transform(rawValue) : (rawValue as T[keyof T]);
    } else {
      console.warn(`modules/sheet fetchDataFromSheet | Columna "${header}" no está mapeada.`);
    }
  });

  return result;
}

export async function fetchListFromSheet<T>(
  spreadsheetId: string,
  range: string,
  mapping: Record<string, FieldMapping<T>>,
  defaultObject: T,
): Promise<T[]> {
  const {data} = await google.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const values = data.values;

  if (!values || values.length < 2) {
    throw new Error(
      `Datos insuficientes en el rango "${range}". Se esperan al menos encabezados y una fila de datos.`,
    );
  }

  const headers = values[0]; // primera fila: encabezados
  const dataRows = values.slice(1); // resto: filas de datos

  const results: T[] = [];

  for (const row of dataRows) {
    // Creamos un objeto partiendo del objeto por defecto
    const obj: T = {...defaultObject};

    headers.forEach((header, i) => {
      const rawValue = row[i] ?? "";

      if (Object.prototype.hasOwnProperty.call(mapping, header)) {
        const {field, transform} = mapping[header];

        obj[field] = transform ? transform(rawValue) : (rawValue as T[keyof T]);
      } else {
        console.warn(`modules/sheet fetchListFromSheet | Columna "${header}" no está mapeada.`);
      }
    });

    results.push(obj);
  }

  return results;
}

export async function fetchProductsFromSheet(
  spreadsheetId: string,
  range: string,
): Promise<ProductDTO[]> {
  const {data} = await google.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const values = data.values;

  if (!values || values.length < 2) {
    throw new Error(
      `Datos insuficientes en el rango "${range}". Se esperan encabezados y al menos una fila de datos.`,
    );
  }

  const headers = values[0];
  const dataRows = values.slice(1);

  const results: ProductDTO[] = [];

  for (const row of dataRows) {
    const product: ProductDTO = {
      name: "",
      variant: "",
      cashPrice: 0,
      listPrice: 0,
      discount: 0,
      description: "",
      image: "",
      brand: "",
      active: false,
      categories: [],
    };

    headers.forEach((header, i) => {
      const rawValue = (row[i] ?? "").toString();

      if (productMapping[header]) {
        const {field, transform} = productMapping[header];

        (product[field] as ProductDTO[keyof ProductDTO]) = transform
          ? transform(rawValue)
          : (rawValue as ProductDTO[keyof ProductDTO]);
      }
    });

    results.push(product);
  }

  return results;
}
