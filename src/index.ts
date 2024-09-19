import { AirtableService } from "./service/airtable-service";

const service = new AirtableService();
await service.getBases();
