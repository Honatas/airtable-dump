import type { Base } from "./model/base";
import type { DatabaseConnectionInfo } from "./model/database-connection-info";
import { AirtableService } from "./service/airtable-service";
import { DumpService } from "./service/dump-service";
import { Utils } from "./utils";

export class BatchRunner {

  public async run(mainDatabaseConnection: DatabaseConnectionInfo): Promise<void> {
    const service = new AirtableService();
    const airtableBases = await service.getBases();


    let bases: Base[] = airtableBases.bases.map(base => ({
      id: base.id,
      name: Utils.normalizeName(base.name)
    }));

    for (const base of bases) {
      const airtableTables = await service.getTables(base.id);
      base.tables = airtableTables.tables.map(table => ({
        id: table.id,
        name: Utils.normalizeName(table.name),
        // primaryFieldId: table.primaryField,
        fields: table.fields.map(field => ({
          id: field.id,
          name: Utils.normalizeName(field.name),
          type: field.type
        })),
      }));
    }

    const dumpService = new DumpService(mainDatabaseConnection);
    await dumpService.startDump(bases);
  }
}
