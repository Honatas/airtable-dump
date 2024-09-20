export interface AirtableTablesResponse {
  tables:[{
    id: string;
    name: string;
    description: string;
    primaryField: string;
    fields: [{
      id: string;
      name: string;
      description: string;
      type: string;
      options: {
        isReversed: boolean;
        inverseLinkFieldId: string;
        linkedTableId: string;
        prefersSingleRecordLink: boolean;
      }
    }]
  }]
}
