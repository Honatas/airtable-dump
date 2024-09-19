import type { AirtableBasesResponse } from "../response/airtable/airtable-bases-response";
import type { AirtableTablesResponse } from "../response/airtable/airtable-tables-response";

export class AirtableService {

  public async getBases(): Promise<AirtableBasesResponse> {
    const response = await fetch('https://api.airtable.com/v0/meta/bases', {
      headers: {
        "Authorization": `Bearer ${process.env.AIRTABLE_PAT}`
      }
    });
    if (response.status != 200) {
      console.log(response.status);
      console.log(response.json()); // TODO: improve error handling
    }
    return await response.json();
  }

  public async getTables(baseId: string): Promise<AirtableTablesResponse> {
    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      headers: {
        "Authorization": `Bearer ${process.env.AIRTABLE_PAT}`
      }
    });
    if (response.status != 200) {
      console.log(response.status);
      console.log(response.json()); // TODO: improve error handling
    }
    return await response.json();
  }
}
