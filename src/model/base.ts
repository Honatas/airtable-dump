import type { Table } from "./table";

export interface Base {
  id: string;
  name: string;
  normalizedName: string;
  created: boolean;
  tables?: Array<Table>
}

