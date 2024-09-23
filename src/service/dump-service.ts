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
      await this.createDatabase(base);
      const createdDao = this.getCreatedDao(base);
      await createdDao.connect();
      await this.createTables(base, createdDao);
      await this.loadData(base, createdDao);
      await createdDao.end();
    }
  }

  private async createDatabase(base: Base): Promise<void> {
    await this.mainDao.createDatabase(base.normalizedName, this.mainDbInfo.user);
    base.created = true;
    console.log(`Database ${base.name} created`)
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
      table.created = true;
      console.log(`Table ${table.name} created`)
      for (const field of table.fields) {
        await this.createField(createdDao, table.normalizedName, field);
        // console.log(`Field ${field.name} created`)
      }
    }
  }

  private async createField(createdDao: CreatedDao, tableName: string, field: Field): Promise<void> {
    let postgresType;
    if (field.type === 'singleLineText') {
      postgresType = 'TEXT';
    }
    if (!postgresType) return;
    try {
      await createdDao.addField(tableName, field.normalizedName, postgresType);
      field.created = true;
    } catch (err) {
      if ((err as DatabaseError).code = '42701') { // column with name already exists
        await this.createField(createdDao, tableName, {...field, normalizedName: field.normalizedName + '_1'})
      }
    }
  }

  private async loadData(base: Base, createdDao: CreatedDao): Promise<void> {
    if (!base.created || !base.tables) return;
    for (const table of base.tables) {
      if (!table.created) continue;
      console.log(`Querying Airtable for ${table.name} data`);
      const tableData = await new AirtableService().getTableData(base.id, table.id);
      // TODO: fetch by offset
      console.log(`Inserting into ${table.name}`);
      for (const record of tableData.records) {
        let fieldNames = [];
        let fieldValues = [];
        for (const field of table.fields) {
          if (!field.created) continue;
          fieldNames.push(field.normalizedName);
          fieldValues.push(record.fields[field.name]);
        }
        await createdDao.insert(table.normalizedName, record.id, fieldNames, fieldValues);
      }
      console.log(`Finished inserting into ${table.name}`);
    }
  }
}
