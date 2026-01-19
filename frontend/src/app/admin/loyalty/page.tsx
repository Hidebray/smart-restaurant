"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { loyaltyApi, Voucher, VoucherStats } from "@/lib/api/loyalty";
import Button from "@/components/ui/Button";
import * as Icons from "lucide-react";
import VoucherFormModal from "./VoucherFormModal";
import toast from "react-hot-toast";
import PointsDisplay from "@/components/loyalty/PointsDisplay";

const fetcher = () => loyaltyApi.getAllVouchers(true);

export default function LoyaltyManagementPage() {
  const { data: vouchers, error, mutate } = useSWR<Voucher[]>("vouchers", fetcher);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const { data: stats } = useSWR<VoucherStats>("voucher-stats", () =>
    loyaltyApi.getVoucherStats(),
  );

  const handleAddNew = () => {
    setEditingVoucher(null);
    setIsFormOpen(true);
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingVoucher(null);
    mutate();
  };

  const handleDelete = async (voucherId: string, voucherName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa voucher "${voucherName}"?`)) {
      return;
    }

    try {
      await loyaltyApi.deleteVoucher(voucherId);
      toast.success(`Đã xóa voucher "${voucherName}"`);
      mutate();
    } catch (error: any) {
      console.error("Delete voucher error:", error);
      toast.error(error.response?.data?.message || "Không thể xóa voucher");
    }
  };

  if (error) return <div>Failed to load vouchers</div>;
  if (!vouchers) return <div>Loading...</div>;

  const activeVouchers = vouchers.filter((v) => v.isActive);
  const inactiveVouchers = vouchers.filter((v) => !v.isActive);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Loyalty</h1>
          <p className="text-sm text-gray-700">
            Quản lý điểm tích lũy và voucher
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Icons.PlusCircle className="mr-2 h-4 w-4" /> Tạo Voucher Mới
        </Button>
      </div>

      {isFormOpen && (
        <VoucherFormModal
          voucher={editingVoucher}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Tổng Voucher</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Đang Hoạt Động</div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Đã Hết Hạn</div>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Tổng Lượt Dùng</div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalRedemptions}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Active Vouchers */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Icons.Ticket className="w-5 h-5" /> Voucher Đang Hoạt Động{" "}
            <span className="bg-green-200 text-green-900 text-sm px-2 py-1 rounded-full border border-green-300">
              {activeVouchers.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeVouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            {activeVouchers.length === 0 && (
              <p className="text-gray-500 italic">Không có voucher đang hoạt động.</p>
            )}
          </div>
        </section>

        {/* Inactive Vouchers */}
        {inactiveVouchers.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icons.Ticket className="w-5 h-5" /> Voucher Không Hoạt Động{" "}
              <span className="bg-gray-200 text-gray-900 text-sm px-2 py-1 rounded-full border border-gray-300">
                {inactiveVouchers.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inactiveVouchers.map((voucher) => (
                <VoucherCard
                  key={voucher.id}
                  voucher={voucher}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function VoucherCard({
  voucher,
  onEdit,
  onDelete,
}: {
  voucher: Voucher;
  onEdit: (voucher: Voucher) => void;
  onDelete: (id: string, name: string) => void;
}) {
  const isExpired =
    voucher.expiryDate && new Date(voucher.expiryDate) < new Date();
  const isMaxUsesReached =
    voucher.maxUses && voucher.usedCount >= voucher.maxUses;

  const formatDiscount = () => {
    if (voucher.discountType === "PERCENT") {
      return `${voucher.discountValue}%`;
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(voucher.discountValue);
  };

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow border-2 ${
        voucher.isActive
          ? "border-green-200 hover:shadow-md"
          : "border-gray-200 opacity-75"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Icons.Ticket
              className={`w-5 h-5 ${
                voucher.isActive ? "text-green-600" : "text-gray-400"
              }`}
            />
            <h3 className="font-bold text-lg text-gray-900">{voucher.name}</h3>
          </div>
          {voucher.description && (
            <p className="text-sm text-gray-600 mb-2">{voucher.description}</p>
          )}
        </div>
        <div
          className={`px-2 py-1 rounded text-xs font-bold ${
            voucher.isActive
              ? "bg-green-100 text-green-900 border border-green-300"
              : "bg-gray-100 text-gray-700 border border-gray-300"
          }`}
        >
          {voucher.isActive ? "Hoạt động" : "Tắt"}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Mã:</span>
          <span className="font-mono font-bold text-gray-900">{voucher.code}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Giảm:</span>
          <span className="font-bold text-orange-600">{formatDiscount()}</span>
        </div>
        {voucher.minOrderAmount && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Đơn tối thiểu:</span>
            <span className="font-medium text-gray-900">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(voucher.minOrderAmount)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Đã dùng:</span>
          <span className="font-medium text-gray-900">
            {voucher.usedCount}
            {voucher.maxUses ? ` / ${voucher.maxUses}` : " / ∞"}
          </span>
        </div>
        {voucher.expiryDate && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">HSD:</span>
            <span
              className={`font-medium ${
                isExpired ? "text-red-600" : "text-gray-900"
              }`}
            >
              {new Date(voucher.expiryDate).toLocaleDateString("vi-VN")}
            </span>
          </div>
        )}
        {(isExpired || isMaxUsesReached) && (
          <div className="text-xs text-red-600 font-medium">
            {isExpired ? "Đã hết hạn" : "Đã hết lượt sử dụng"}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(voucher)}
          className="flex-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-sm font-medium flex items-center justify-center gap-1 transition-colors px-2 py-1 rounded"
        >
          <Icons.Edit className="h-3 w-3" />
          Sửa
        </button>
        <button
          onClick={() => onDelete(voucher.id, voucher.name)}
          className="flex-1 text-red-600 hover:text-red-800 hover:bg-red-50 text-sm font-medium flex items-center justify-center gap-1 transition-colors px-2 py-1 rounded"
        >
          <Icons.Trash2 className="h-3 w-3" />
          Xóa
        </button>
      </div>
    </div>
  );
}
