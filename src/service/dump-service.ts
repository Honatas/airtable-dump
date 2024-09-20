import type { Bases } from "../model/bases";
import type { DatabaseConnectionInfo } from "../model/database-connection-info";
import { CreatedDao } from "../repository/created-dao";
import { MainDao } from "../repository/main-dao";

export class DumpService {

  private mainDao: MainDao;
  
  constructor(private mainDbInfo: DatabaseConnectionInfo) {
    this.mainDao = new MainDao(mainDbInfo);
  }

  public async startDump(bases: Bases[]): Promise<void> {
    for (const base of bases) {
      if (!base.tables) return;
      await this.mainDao.createDatabase(base.name, process.env.POSTGRES_USERNAME as string);
      console.log(`Database ${base.name} created`)
      const createdDao = this.getCreatedDao(base.name);
      await createdDao.connect();
      for (const table of base.tables) {
        await createdDao.createTable(table.name);
      }
      await createdDao.end();
    }
  }

  private getCreatedDao(baseName: string): CreatedDao {
    let createdDbInfo = { ...this.mainDbInfo };
    createdDbInfo.database = baseName;
    return new CreatedDao(createdDbInfo);
  }
}
