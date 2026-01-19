"use client";

import { Reservation, ReservationStatus } from "@/types/reservation";
import { Calendar, Clock, Users, Phone, Mail, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ReservationCardProps {
  reservation: Reservation;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
  onMarkNoShow?: (id: string) => void;
}

const statusColors: Record<ReservationStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  CONFIRMED: "bg-green-100 text-green-800 border-green-300",
  CANCELLED: "bg-red-100 text-red-800 border-red-300",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-300",
  NO_SHOW: "bg-gray-100 text-gray-800 border-gray-300",
};

const statusLabels: Record<ReservationStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã hủy",
  COMPLETED: "Hoàn thành",
  NO_SHOW: "Không đến",
};

export default function ReservationCard({
  reservation,
  onConfirm,
  onCancel,
  onComplete,
  onMarkNoShow,
}: ReservationCardProps) {
  const reservationDateTime = new Date(reservation.reservationTime);
  const reservationDate = new Date(reservation.reservationDate);

  return (
    <div className={`p-4 rounded-lg border-2 ${statusColors[reservation.status]} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5" />
            <h3 className="font-bold text-lg text-gray-900">
              {reservation.guestName}
            </h3>
          </div>
          <div className="text-sm text-gray-700">
            Bàn {reservation.table?.tableNumber || "?"}
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold border ${statusColors[reservation.status]}`}>
          {statusLabels[reservation.status]}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="text-gray-900">
            {format(reservationDate, "dd/MM/yyyy", { locale: vi })} lúc{" "}
            {format(reservationDateTime, "HH:mm", { locale: vi })}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-gray-600" />
          <span className="text-gray-900">
            {reservation.guestCount} người • {reservation.duration} phút
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-gray-600" />
          <span className="text-gray-900">{reservation.guestPhone}</span>
        </div>

        {reservation.guestEmail && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-600" />
            <span className="text-gray-900">{reservation.guestEmail}</span>
          </div>
        )}

        {reservation.specialRequests && (
          <div className="mt-2 p-2 bg-white rounded border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">Yêu cầu đặc biệt:</div>
            <div className="text-sm text-gray-900">{reservation.specialRequests}</div>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {reservation.status === "PENDING" && onConfirm && (
          <button
            onClick={() => onConfirm(reservation.id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            Xác nhận
          </button>
        )}

        {(reservation.status === "PENDING" || reservation.status === "CONFIRMED") && onCancel && (
          <button
            onClick={() => onCancel(reservation.id)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-1"
          >
            <XCircle className="w-4 h-4" />
            Hủy
          </button>
        )}

        {reservation.status === "CONFIRMED" && onComplete && (
          <button
            onClick={() => onComplete(reservation.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            Hoàn thành
          </button>
        )}

        {reservation.status === "CONFIRMED" && onMarkNoShow && (
          <button
            onClick={() => onMarkNoShow(reservation.id)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            Không đến
          </button>
        )}
      </div>
    </div>
  );
}
