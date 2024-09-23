import { DatabaseError } from "pg";
import type { Base } from "../model/base";
import type { DatabaseConnectionInfo } from "../model/database-connection-info";
import type { Field } from "../model/field";
import { CreatedDao } from "../repository/created-dao";
import { MainDao } from "../repository/main-dao";
import { AirtableService } from "./airtable-service";

export class DumpService {

  private mainDao: MainDao;
  
  constructor(private mainDbInfo: DatabaseConnectionInfo) {
    this.mainDao = new MainDao(mainDbInfo);
  }

  public async startDump(bases: Base[]): Promise<void> {
    for (const base of bases) {
      await this.mainDao.createDatabase(base.normalizedName, this.mainDbInfo.user);
      console.log(`Database ${base.name} created`)
      const createdDao = this.getCreatedDao(base);
      await createdDao.connect();
      await this.createTables(base, createdDao);
      await this.loadData(base, createdDao);
      await createdDao.end();
    }
  }

  private getCreatedDao(base: Base): CreatedDao {
    let createdDbInfo = { ...this.mainDbInfo };
    createdDbInfo.database = base.normalizedName;
    return new CreatedDao(createdDbInfo);
  }

  private async createTables(base: Base, createdDao: CreatedDao) {
    if (!base.tables) return;
    for (const table of base.tables) {
      await createdDao.createTable(table.normalizedName);
      console.log(`Table ${table.name} created`)
      for (const field of table.fields) {
        await this.createField(createdDao, table.normalizedName, field);
      }
    }
  }

  private async createField(createdDao: CreatedDao, tableName: string, field: Field): Promise<void> {
    if (field.postgresType == undefined) return;
    try {
      await createdDao.addField(tableName, field);
      console.log(`Field ${field.name} created`);
    } catch (err) {
      if ((err as DatabaseError).code = '42701') { // column with name already exists
        await this.createField(createdDao, tableName, {...field, normalizedName: field.normalizedName + '_1'})
      }
    }
  }

  private async loadData(base: Base, createdDao: CreatedDao): Promise<void> {
    if (!base.tables) return;
    for (const table of base.tables) {
      console.log(`Querying Airtable for ${table.name} data`);
      const tableData = await new AirtableService().getTableData(base.id, table.id);
      // TODO: fetch by offset
      console.log(`Inserting into ${table.name}`);
      for (const record of tableData.records) {
        let fieldNames = [];
        let fieldValues = [];
        for (const field of table.fields) {
          if (!field.postgresType) continue;
          fieldNames.push(field.normalizedName);
          fieldValues.push(record.fields[field.name]);
        }
        await createdDao.insert(table.normalizedName, record.id, fieldNames, fieldValues);
      }
      console.log(`Finished inserting into ${table.name}`);
    }
  }
}
