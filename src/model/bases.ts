export interface Bases {
  id: string;
  name: string;
  tables?: Array<{
    id: string,
    name: string,
    primaryFieldId: string,
  }>
}