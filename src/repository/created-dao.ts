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

  public async addField(tableName: string, fieldName: string, fieldType: string): Promise<void> {
    await this.client.query(`ALTER TABLE ${tableName} ADD ${fieldName} ${fieldType} NULL`);
  }

  public async insert(tableName: string, recordAirtableId: string, fieldNames: Array<any>, fieldValues: Array<any>): Promise<void> {
    let placeholders = '';
    for (let i=1; i<=fieldValues.length; i++) {
      placeholders += '$' + i + ',';
    }
    placeholders = placeholders.substring(0, placeholders.length - 1);
    let sql = `INSERT INTO ${tableName}(airtable_id, ${fieldNames}) VALUES('${recordAirtableId}',${placeholders})`;
    await this.client.query(sql, fieldValues);
  }
}
