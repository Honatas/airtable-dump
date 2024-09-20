import { Client } from "pg";

export class MainDao {

  private client;

  constructor() {
    this.client = new Client({
      host: process.env.POSTGRES_HOST,
      port: +(process.env.POSTGRES_PORT as string),
      database: process.env.POSTGRES_DATABASE,
      user: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
    });
  }

  public async createDatabase(databaseName: string, owner: string) {
    await this.client.connect();
    await this.client.query(`CREATE DATABASE ${databaseName} WITH OWNER ${owner}`);
    await this.client.end();
  }
}
