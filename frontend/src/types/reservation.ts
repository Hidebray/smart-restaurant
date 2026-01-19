export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface Reservation {
  id: string;
  tableId: string;
  customerId?: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  reservationDate: string;
  reservationTime: string;
  duration: number;
  guestCount: number;
  status: ReservationStatus;
  specialRequests?: string;
  notes?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  table?: {
    id: string;
    tableNumber: string;
    capacity: number;
    status?: string;
  };
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface ReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  noShow: number;
}

export interface CreateReservationPayload {
  tableId: string;
  customerId?: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  reservationDate: string;
  reservationTime: string;
  duration?: number;
  guestCount?: number;
  specialRequests?: string;
  notes?: string;
}

export interface UpdateReservationPayload {
  tableId?: string;
  customerId?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  reservationDate?: string;
  reservationTime?: string;
  duration?: number;
  guestCount?: number;
  specialRequests?: string;
  notes?: string;
  status?: ReservationStatus;
}
