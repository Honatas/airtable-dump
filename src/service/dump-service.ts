import type { Bases } from "../model/bases";
import { MainDao } from "../repository/main-dao";

export class DumpService {

  private mainDao = new MainDao();

  public async startDump(bases: Bases[]): Promise<void> {

    for (const base of bases) {
      await this.mainDao.createDatabase(base.name, process.env.POSTGRES_USERNAME as string);
    }
  }
}
