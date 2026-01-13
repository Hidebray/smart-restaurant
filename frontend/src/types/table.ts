
export type Table = {
  id: string;
  tableNumber: string;
  capacity: number;
  location?: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'INACTIVE';
  qrToken?: string;
  qrTokenCreatedAt?: string;
  createdAt: string;
  updatedAt: string;
};
