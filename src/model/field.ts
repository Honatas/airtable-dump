import type { AirtableElement } from "./airtable-element";

export interface Field extends AirtableElement {
  type: string;
  postgresType: string | undefined;
  description: string;
}
