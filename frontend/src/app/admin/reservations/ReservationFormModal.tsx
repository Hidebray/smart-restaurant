"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { reservationsApi, Reservation, CreateReservationPayload } from "@/lib/api/reservations";
import { tablesApi } from "@/lib/api/tables";
import { Table } from "@/types/table";
import toast from "react-hot-toast";
import useSWR from "swr";

interface ReservationFormModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const tablesFetcher = () => tablesApi.getAll();

export default function ReservationFormModal({
  reservation,
  isOpen,
  onClose,
  onSuccess,
}: ReservationFormModalProps) {
  const { data: tables } = useSWR<Table[]>("tables", tablesFetcher);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tableId: "",
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    reservationDate: "",
    reservationTime: "",
    duration: 120,
    guestCount: 2,
    specialRequests: "",
  });

  useEffect(() => {
    if (reservation) {
      const date = new Date(reservation.reservationDate);
      const time = new Date(reservation.reservationTime);
      setFormData({
        tableId: reservation.tableId,
        guestName: reservation.guestName,
        guestPhone: reservation.guestPhone,
        guestEmail: reservation.guestEmail || "",
        reservationDate: date.toISOString().split("T")[0],
        reservationTime: time.toISOString().slice(0, 16),
        duration: reservation.duration,
        guestCount: reservation.guestCount,
        specialRequests: reservation.specialRequests || "",
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        tableId: "",
        guestName: "",
        guestPhone: "",
        guestEmail: "",
        reservationDate: tomorrow.toISOString().split("T")[0],
        reservationTime: "",
        duration: 120,
        guestCount: 2,
        specialRequests: "",
      });
    }
  }, [reservation, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: CreateReservationPayload = {
        tableId: formData.tableId,
        guestName: formData.guestName,
        guestPhone: formData.guestPhone,
        guestEmail: formData.guestEmail || undefined,
        reservationDate: formData.reservationDate,
        reservationTime: formData.reservationTime,
        duration: formData.duration,
        guestCount: formData.guestCount,
        specialRequests: formData.specialRequests || undefined,
      };

      if (reservation) {
        await reservationsApi.update(reservation.id, payload);
        toast.success("Cập nhật đặt bàn thành công!");
      } else {
        await reservationsApi.create(payload);
        toast.success("Tạo đặt bàn thành công!");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Không thể lưu đặt bàn"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {reservation ? "Chỉnh Sửa Đặt Bàn" : "Tạo Đặt Bàn Mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Table Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bàn *
              </label>
              <select
                required
                value={formData.tableId}
                onChange={(e) =>
                  setFormData({ ...formData, tableId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn bàn...</option>
                {tables?.map((table) => (
                  <option key={table.id} value={table.id}>
                    Bàn {table.tableNumber} ({table.capacity} chỗ)
                  </option>
                ))}
              </select>
            </div>

            {/* Guest Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số Người *
              </label>
              <Input
                required
                type="number"
                min={1}
                max={20}
                value={formData.guestCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    guestCount: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Guest Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Khách Hàng *
              </label>
              <Input
                required
                value={formData.guestName}
                onChange={(e) =>
                  setFormData({ ...formData, guestName: e.target.value })
                }
              />
            </div>

            {/* Guest Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số Điện Thoại *
              </label>
              <Input
                required
                value={formData.guestPhone}
                onChange={(e) =>
                  setFormData({ ...formData, guestPhone: e.target.value })
                }
              />
            </div>
          </div>

          {/* Guest Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (Tùy chọn)
            </label>
            <Input
              type="email"
              value={formData.guestEmail}
              onChange={(e) =>
                setFormData({ ...formData, guestEmail: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Reservation Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày Đặt *
              </label>
              <Input
                required
                type="date"
                value={formData.reservationDate}
                onChange={(e) =>
                  setFormData({ ...formData, reservationDate: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Reservation Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giờ Đặt *
              </label>
              <Input
                required
                type="datetime-local"
                value={formData.reservationTime}
                onChange={(e) =>
                  setFormData({ ...formData, reservationTime: e.target.value })
                }
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời Lượng (phút) *
            </label>
            <Input
              required
              type="number"
              min={30}
              max={480}
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: Number(e.target.value) })
              }
            />
            <div className="text-xs text-gray-500 mt-1">
              Từ 30 phút đến 8 giờ
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yêu Cầu Đặc Biệt (Tùy chọn)
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) =>
                setFormData({ ...formData, specialRequests: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Ví dụ: Bàn gần cửa sổ, không hành..."
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : reservation ? "Cập Nhật" : "Tạo Đặt Bàn"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
