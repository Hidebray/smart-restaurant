"use client";

import { useState } from "react";
import useSWR from "swr";
import { reservationsApi, Reservation, ReservationStats, ReservationStatus } from "@/lib/api/reservations";
import Button from "@/components/ui/Button";
import * as Icons from "lucide-react";
import ReservationFormModal from "./ReservationFormModal";
import ReservationCard from "@/components/reservations/ReservationCard";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const fetcher = () => reservationsApi.getAll();

export default function ReservationsManagementPage() {
  const { data: reservations, error, mutate } = useSWR<Reservation[]>("reservations", fetcher);
  const { data: stats } = useSWR<ReservationStats>("reservation-stats", () =>
    reservationsApi.getStats(),
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "ALL">("ALL");
  const [dateFilter, setDateFilter] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const handleAddNew = () => {
    setEditingReservation(null);
    setIsFormOpen(true);
  };

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingReservation(null);
    mutate();
  };

  const handleConfirm = async (id: string) => {
    try {
      await reservationsApi.confirm(id);
      toast.success("Đã xác nhận đặt bàn");
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể xác nhận");
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Bạn có chắc muốn hủy đặt bàn này?")) return;
    try {
      await reservationsApi.cancel(id);
      toast.success("Đã hủy đặt bàn");
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể hủy");
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await reservationsApi.complete(id);
      toast.success("Đã hoàn thành đặt bàn");
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể hoàn thành");
    }
  };

  const handleMarkNoShow = async (id: string) => {
    if (!confirm("Đánh dấu khách không đến?")) return;
    try {
      await reservationsApi.markNoShow(id);
      toast.success("Đã đánh dấu không đến");
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể đánh dấu");
    }
  };

  const handleDelete = async (id: string, guestName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa đặt bàn của "${guestName}"?`)) {
      return;
    }

    try {
      await reservationsApi.delete(id);
      toast.success(`Đã xóa đặt bàn của "${guestName}"`);
      mutate();
    } catch (error: any) {
      console.error("Delete reservation error:", error);
      toast.error(error.response?.data?.message || "Không thể xóa đặt bàn");
    }
  };

  if (error) return <div>Failed to load reservations</div>;
  if (!reservations) return <div>Loading...</div>;

  const filteredReservations = reservations.filter((res) => {
    if (statusFilter !== "ALL" && res.status !== statusFilter) return false;
    if (dateFilter) {
      const resDate = new Date(res.reservationDate).toISOString().split("T")[0];
      if (resDate !== dateFilter) return false;
    }
    return true;
  });

  const upcomingReservations = reservations.filter(
    (res) =>
      new Date(res.reservationTime) >= new Date() &&
      (res.status === "PENDING" || res.status === "CONFIRMED")
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Đặt Bàn</h1>
          <p className="text-sm text-gray-700">
            Quản lý đặt bàn và lịch hẹn của khách hàng
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Icons.PlusCircle className="mr-2 h-4 w-4" /> Tạo Đặt Bàn Mới
        </Button>
      </div>

      {isFormOpen && (
        <ReservationFormModal
          reservation={editingReservation}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Tổng</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-yellow-200 bg-yellow-50">
            <div className="text-sm text-gray-600 mb-1">Chờ xác nhận</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-green-200 bg-green-50">
            <div className="text-sm text-gray-600 mb-1">Đã xác nhận</div>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-red-200 bg-red-50">
            <div className="text-sm text-gray-600 mb-1">Đã hủy</div>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-blue-200 bg-blue-50">
            <div className="text-sm text-gray-600 mb-1">Hoàn thành</div>
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600 mb-1">Không đến</div>
            <div className="text-2xl font-bold text-gray-600">{stats.noShow}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReservationStatus | "ALL")}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả</option>
            <option value="PENDING">Chờ xác nhận</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="CANCELLED">Đã hủy</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="NO_SHOW">Không đến</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Lọc theo ngày:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-sm text-gray-600">
          Hiển thị: {filteredReservations.length} đặt bàn
        </div>
      </div>

      {/* Upcoming Reservations Alert */}
      {upcomingReservations.length > 0 && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icons.AlertCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-blue-900">
              Đặt bàn sắp tới ({upcomingReservations.length})
            </h3>
          </div>
          <div className="text-sm text-blue-700">
            Có {upcomingReservations.length} đặt bàn sắp tới cần xử lý
          </div>
        </div>
      )}

      {/* Reservations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="relative">
            <ReservationCard
              reservation={reservation}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onComplete={handleComplete}
              onMarkNoShow={handleMarkNoShow}
            />
            <button
              onClick={() => handleDelete(reservation.id, reservation.guestName)}
              className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
              title="Xóa đặt bàn"
            >
              <Icons.Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        {filteredReservations.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Icons.Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Không có đặt bàn nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
