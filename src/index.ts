import { BatchRunner } from "./batch-runner";
import type { DatabaseConnectionInfo } from "./model/database-connection-info";

const mainDatabaseConnection: DatabaseConnectionInfo = {
  host: process.env.POSTGRES_HOST as string,
  port: +(process.env.POSTGRES_PORT as string),
  database: process.env.POSTGRES_DATABASE as string,
  user: process.env.POSTGRES_USERNAME as string,
  password: process.env.POSTGRES_PASSWORD as string,
}

const batchRunner = new BatchRunner();
await batchRunner.run(mainDatabaseConnection);
