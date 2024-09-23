import type { Field } from "./field";

export interface Table {
  id: string,
  name: string,
  normalizedName: string;
  created: boolean;
  primaryFieldId?: string,
  fields: Array<Field>
}
