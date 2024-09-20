import { Client } from "pg";
import type { DatabaseConnectionInfo } from "../model/database-connection-info";

export class CreatedDao {
 
  private client;

  constructor(dbInfo: DatabaseConnectionInfo) {
    this.client = new Client(dbInfo);
  }

  public async connect(): Promise<void> {
    await this.client.connect();
  }

  public async end(): Promise<void> {
    await this.client.end();
  }

  public async createTable(tableName: string): Promise<void> {
    await this.client.query(`
      CREATE TABLE ${tableName} (
        id           serial  primary key,
        airtable_id  text    not null
      )
    `);
  }
}