import type { AirtableElement } from "./airtable-element";
import type { Field } from "./field";

export interface Table extends AirtableElement {
  primaryFieldId?: string,
  fields: Array<Field>
}
