
export type Table = {
  id: string;
  tableNumber: string;
  capacity: number;
  location?: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'INACTIVE';
  qrToken?: string;
  qrTokenCreatedAt?: string;
  assignedWaiterId?: string | null;
  assignedWaiter?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};
