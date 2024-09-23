import { DatabaseError } from "pg";
import type { Base } from "../model/base";
import type { DatabaseConnectionInfo } from "../model/database-connection-info";
import type { Field } from "../model/field";
import { CreatedDao } from "../repository/created-dao";
import { MainDao } from "../repository/main-dao";

export class DumpService {

  private mainDao: MainDao;
  
  constructor(private mainDbInfo: DatabaseConnectionInfo) {
    this.mainDao = new MainDao(mainDbInfo);
  }

  public async startDump(bases: Base[]): Promise<void> {
    for (const base of bases) {
      await this.createDatabase(base.name);
      const createdDao = this.getCreatedDao(base.name);
      await createdDao.connect();
      await this.createTables(base, createdDao);
      await createdDao.end();
    }
  }

  private async createDatabase(baseName: string): Promise<void> {
    await this.mainDao.createDatabase(baseName, this.mainDbInfo.user);
    console.log(`Database ${baseName} created`)
  }

  private getCreatedDao(baseName: string): CreatedDao {
    let createdDbInfo = { ...this.mainDbInfo };
    createdDbInfo.database = baseName;
    return new CreatedDao(createdDbInfo);
  }

  private async createTables(base: Base, createdDao: CreatedDao) {
    if (!base.tables) return;
    for (const table of base.tables) {
      await createdDao.createTable(table.name);
      console.log(`Table ${table.name} created`)
      for (const field of table.fields) {
        await this.createField(createdDao, table.name, field);
        console.log(`Field ${field.name} created`)
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
      await createdDao.addField(tableName, field.name, postgresType);
    } catch (err) {
      if ((err as DatabaseError).code = '42701') { // column with name already exists
        await this.createField(createdDao, tableName, {...field, name: field.name + '_1'})
      }
    }
  }
}
