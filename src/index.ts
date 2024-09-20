import type { Bases } from "./model/bases";
import { AirtableService } from "./service/airtable-service";
import { DumpService } from "./service/dump-service";

const service = new AirtableService();
const airtableBases = await service.getBases();

const bases: Bases[] = airtableBases.bases.map(base => (
  {
    id: base.id,
    name: base.name.normalize().toLowerCase().replace(/[^a-z ]/g, "").replaceAll(' ', '_')
  }
));

for (const base of bases) {
  const airtableTables = await service.getTables(base.id);
  base.tables = airtableTables.tables;
}

const dumpService = new DumpService();
await dumpService.startDump(bases);
