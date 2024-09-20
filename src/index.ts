import type { Bases } from "./model/bases";
import type { DatabaseConnectionInfo } from "./model/database-connection-info";
import { AirtableService } from "./service/airtable-service";
import { DumpService } from "./service/dump-service";

const mainDatabaseConnection: DatabaseConnectionInfo = {
  host: process.env.POSTGRES_HOST as string,
  port: +(process.env.POSTGRES_PORT as string),
  database: process.env.POSTGRES_DATABASE as string,
  user: process.env.POSTGRES_USERNAME as string,
  password: process.env.POSTGRES_PASSWORD as string,
}

const service = new AirtableService();
const airtableBases = await service.getBases();


function normalizeName(name: string): string {
  return name.normalize().toLowerCase().replace(/[^a-z ]/g, "").replaceAll(' ', '_');
}


let bases: Bases[] = airtableBases.bases.map(base => ({
  id: base.id,
  name: normalizeName(base.name)
}));

for (const base of bases) {
  const airtableTables = await service.getTables(base.id);
  base.tables = airtableTables.tables.map(table => ({
    id: table.id,
    name: normalizeName(table.name),
    primaryFieldId: table.primaryField,
  }));
}

const dumpService = new DumpService(mainDatabaseConnection);
await dumpService.startDump(bases);
