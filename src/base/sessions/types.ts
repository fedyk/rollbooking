export interface Session {
  id: string;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}
