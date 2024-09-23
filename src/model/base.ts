import type { Table } from "./table";

export interface Base {
  id: string;
  name: string;
  tables?: Array<Table>
}

