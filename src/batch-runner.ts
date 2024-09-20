import type { Bases } from "./model/bases";
import type { DatabaseConnectionInfo } from "./model/database-connection-info";
import { AirtableService } from "./service/airtable-service";
import { DumpService } from "./service/dump-service";
import { Utils } from "./utils";

export class BatchRunner {

  public async run(mainDatabaseConnection: DatabaseConnectionInfo): Promise<void> {
    const service = new AirtableService();
    const airtableBases = await service.getBases();


    let bases: Bases[] = airtableBases.bases.map(base => ({
      id: base.id,
      name: Utils.normalizeName(base.name)
    }));

    for (const base of bases) {
      const airtableTables = await service.getTables(base.id);
      base.tables = airtableTables.tables.map(table => ({
        id: table.id,
        name: Utils.normalizeName(table.name),
        // primaryFieldId: table.primaryField,
      }));
    }

    const dumpService = new DumpService(mainDatabaseConnection);
    await dumpService.startDump(bases);
  }
}
