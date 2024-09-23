export interface Field {
  id: string;
  name: string;
  normalizedName: string;
  type: string;
  postgresType: string | undefined;
  description: string;
}
