import type { Field } from "./field";

export interface Table {
  id: string,
  name: string,
  normalizedName: string;
  primaryFieldId?: string,
  fields: Array<Field>
}
