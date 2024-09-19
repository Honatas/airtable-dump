import { AirtableService } from "./service/airtable-service";

const service = new AirtableService();
const bases = await service.getBases();
console.log(bases);

for (const base of bases.bases) {
  const tables = await service.getTables(base.id);
  
  console.log(tables.tables[0].fields)
  // for (const table of tables.tables) {
  //   console.log(table.fields);
  // }
}
