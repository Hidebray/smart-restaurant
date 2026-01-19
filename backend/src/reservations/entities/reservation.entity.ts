import { ReservationStatus } from '@prisma/client';

export class ReservationEntity {
  id: string;
  tableId: string;
  customerId?: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  reservationDate: Date;
  reservationTime: Date;
  duration: number;
  guestCount: number;
  status: ReservationStatus;
  specialRequests?: string;
  notes?: string;
  confirmedAt?: Date;
  cancelledAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  table?: {
    id: string;
    tableNumber: string;
    capacity: number;
  };
  customer?: {
    id: string;
    name: string;
    email: string;
  };
}
