export interface FieldMapping<T> {
  field: keyof T;
  transform?: (value: string) => T[keyof T];
}
