import type { AirtableElement } from "./model/airtable-element";
import type { Base } from "./model/base";
import type { DatabaseConnectionInfo } from "./model/database-connection-info";
import { AirtableService } from "./service/airtable-service";
import { DumpService } from "./service/dump-service";
import { Utils } from "./utils";

export class BatchRunner {

  public async run(mainDatabaseConnection: DatabaseConnectionInfo): Promise<void> {
    const service = new AirtableService();
    const airtableBasesResponse = await service.getBases();

    let bases: Base[] = airtableBasesResponse.bases.map(base => ({
      id: base.id,
      name: base.name,
      normalizedName: Utils.normalizeName(base.name),
      created: false,
    }));

    for (const base of bases) {
      const airtableTablesResponse = await service.getTables(base.id);
      base.tables = airtableTablesResponse.tables.map(table => ({
        id: table.id,
        name: table.name,
        normalizedName: Utils.normalizeName(table.name),
        created: false,
        // primaryFieldId: table.primaryField,
        fields: table.fields.map(field => ({
          id: field.id,
          name: field.name,
          normalizedName: Utils.normalizeName(field.name),
          type: field.type,
          postgresType: this.getPostgresType(field.type),
          description: field.description,
        })),
      }));
      this.deduplicateNormalizedNames(base.tables);
      for (const table of base.tables) {
        this.deduplicateNormalizedNames(table.fields);
      }
    }

    const dumpService = new DumpService(mainDatabaseConnection);
    await dumpService.startDump(bases);
  }

  private getPostgresType(type: string): string | undefined {
    if (type === 'singleLineText' || type === 'richText' || type === 'singleSelect') {
      return 'TEXT';
    }
    return undefined;
  }

  private deduplicateNormalizedNames(elements: Array<AirtableElement>): void {
    for (let i=0; i<elements.length; i++) {
      let suffixIndex = 1;
      for (let j=i+1; j<elements.length; j++) {
        if (elements[i].normalizedName == elements[j].normalizedName) {
          elements[j].normalizedName += '_' + suffixIndex;
          suffixIndex++;
        }
      }
    }
  }
}
