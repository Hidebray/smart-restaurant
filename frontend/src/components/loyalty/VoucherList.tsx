"use client";

import { useEffect, useState } from "react";
import { loyaltyApi, Voucher } from "@/lib/api/loyalty";
import { Ticket, Percent, DollarSign, Calendar, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface VoucherListProps {
  onSelect?: (voucher: Voucher) => void;
  selectedVoucherId?: string;
  showInactive?: boolean; // Admin only
}

export default function VoucherList({
  onSelect,
  selectedVoucherId,
  showInactive = false,
}: VoucherListProps) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const data = showInactive
          ? await loyaltyApi.getAllVouchers(true)
          : await loyaltyApi.getAvailableVouchers();
        setVouchers(data);
      } catch (error: any) {
        console.error("Failed to fetch vouchers:", error);
        toast.error("Không thể tải danh sách voucher");
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [showInactive]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Ticket className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Chưa có voucher nào</p>
      </div>
    );
  }

  const formatDiscount = (voucher: Voucher) => {
    if (voucher.discountType === "PERCENT") {
      return `${voucher.discountValue}%`;
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(voucher.discountValue);
  };

  const isExpired = (voucher: Voucher) => {
    if (!voucher.expiryDate) return false;
    return new Date(voucher.expiryDate) < new Date();
  };

  const isMaxUsesReached = (voucher: Voucher) => {
    if (!voucher.maxUses) return false;
    return voucher.usedCount >= voucher.maxUses;
  };

  return (
    <div className="space-y-3">
      {vouchers.map((voucher) => {
        const expired = isExpired(voucher);
        const maxUsesReached = isMaxUsesReached(voucher);
        const isAvailable = voucher.isActive && !expired && !maxUsesReached;
        const isSelected = selectedVoucherId === voucher.id;

        return (
          <div
            key={voucher.id}
            onClick={() => isAvailable && onSelect?.(voucher)}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
              isSelected
                ? "border-orange-500 bg-orange-50"
                : isAvailable
                ? "border-green-200 bg-green-50 hover:border-green-400 hover:shadow-md"
                : "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Ticket className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-gray-900">{voucher.name}</h3>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  )}
                </div>

                {voucher.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {voucher.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-orange-600 font-bold">
                    {voucher.discountType === "PERCENT" ? (
                      <Percent className="w-4 h-4" />
                    ) : (
                      <DollarSign className="w-4 h-4" />
                    )}
                    <span>Giảm {formatDiscount(voucher)}</span>
                  </div>

                  {voucher.minOrderAmount && (
                    <div className="text-gray-600">
                      Đơn tối thiểu:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(voucher.minOrderAmount)}
                    </div>
                  )}
                </div>

                {voucher.expiryDate && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>
                      HSD: {new Date(voucher.expiryDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Mã</div>
                <div className="font-mono font-bold text-lg text-gray-900 bg-white px-2 py-1 rounded border border-gray-300">
                  {voucher.code}
                </div>
                {!isAvailable && (
                  <div className="text-xs text-red-600 mt-1 font-medium">
                    {expired
                      ? "Đã hết hạn"
                      : maxUsesReached
                      ? "Đã hết lượt"
                      : "Không khả dụng"}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
