import type { TableData } from "../model/table-data";
import type { AirtableBasesResponse } from "./response/airtable/airtable-bases-response";
import type { AirtableTablesResponse } from "./response/airtable/airtable-tables-response";

export class AirtableService {

  private getHeaders(): HeadersInit {
    return {
      "Authorization": `Bearer ${process.env.AIRTABLE_PAT}`
    };
  }

  public async getBases(): Promise<AirtableBasesResponse> {
    const response = await fetch('https://api.airtable.com/v0/meta/bases', {
      headers: this.getHeaders()
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
      headers: this.getHeaders()
    });
    const body = await response.json();
    if (response.status != 200) {
      console.log(response.status);
      console.log(body); // TODO: improve error handling
    }
    return body;
  }

  public async getTableData(baseId: string, tableId: string, offset?: string): Promise<TableData> {
    let url = `https://api.airtable.com/v0/${baseId}/${tableId}`;
    if (offset) url += `?offset=${offset}`;
    const response = await fetch(url, {
      headers: this.getHeaders()
    });
    const body = await response.json();
    if (response.status != 200) {
      console.log(response.status);
      console.log(body); // TODO: improve error handling
    }
    return body;
  }
}
