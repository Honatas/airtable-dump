export class AirtableService {

  public async getBases(): Promise<void> {
    const response = await fetch('https://api.airtable.com/v0/meta/bases', {
      headers: {
        "Authorization": `Bearer ${process.env.AIRTABLE_PAT}`
      }
    });
    console.log(response.status);
    console.log(await response.json());
  }
}
