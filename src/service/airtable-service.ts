import type { AirtableBasesResponse } from "./response/airtable/airtable-bases-response";
import type { AirtableTablesResponse } from "./response/airtable/airtable-tables-response";

export class AirtableService {

  public async getBases(): Promise<AirtableBasesResponse> {
    const response = await fetch('https://api.airtable.com/v0/meta/bases', {
      headers: {
        "Authorization": `Bearer ${process.env.AIRTABLE_PAT}`
      }
    });
    const body = await response.json();
    if (response.status != 200) {
      console.log(response.status);
      console.log(body); // TODO: improve error handling
    }
    return body;
  }

  public async getTables(baseId: string): Promise<AirtableTablesResponse> {
    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      headers: {
        "Authorization": `Bearer ${process.env.AIRTABLE_PAT}`
      }
    });
    const body = await response.json();
    if (response.status != 200) {
      console.log(response.status);
      console.log(body); // TODO: improve error handling
    }
    return body;
  }
}
