export interface UserScript {
  uniqueId: string;
  title: string;
  script: string;
  inputSchema: string; // Assuming this is a JSON string or similar
  createdBy: string;
  createdAt: string; // Representing time.Time as string for simplicity
}
