import { Client } from "pg";
import type { DatabaseConnectionInfo } from "../model/database-connection-info";

export class MainDao {

  private client;

  constructor(dbInfo: DatabaseConnectionInfo) {
    this.client = new Client(dbInfo);
  }

  public async createDatabase(databaseName: string, owner: string): Promise<void> {
    await this.client.connect();
    await this.client.query(`CREATE DATABASE ${databaseName} WITH OWNER ${owner}`);
    await this.client.end();
  }
}
