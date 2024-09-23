export interface TableData {
  records: [{
    id: string;
    fields: Record<string, unknown>;
  }]
  offset: string;
}
