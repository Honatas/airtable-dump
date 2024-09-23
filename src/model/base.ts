import type { AirtableElement } from "./airtable-element";
import type { Table } from "./table";

export interface Base extends AirtableElement {
  tables?: Array<Table>
}

