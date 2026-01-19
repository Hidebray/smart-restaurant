"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { loyaltyApi, Voucher, CreateVoucherPayload } from "@/lib/api/loyalty";
import toast from "react-hot-toast";

interface VoucherFormModalProps {
  voucher: Voucher | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VoucherFormModal({
  voucher,
  isOpen,
  onClose,
  onSuccess,
}: VoucherFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateVoucherPayload>({
    code: "",
    name: "",
    description: "",
    discountType: "PERCENT",
    discountValue: 0,
    minOrderAmount: undefined,
    maxUses: undefined,
    expiryDate: undefined,
    isActive: true,
  });

  useEffect(() => {
    if (voucher) {
      setFormData({
        code: voucher.code,
        name: voucher.name,
        description: voucher.description || "",
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        minOrderAmount: voucher.minOrderAmount,
        maxUses: voucher.maxUses,
        expiryDate: voucher.expiryDate
          ? new Date(voucher.expiryDate).toISOString().split("T")[0]
          : undefined,
        isActive: voucher.isActive,
      });
    } else {
      setFormData({
        code: "",
        name: "",
        description: "",
        discountType: "PERCENT",
        discountValue: 0,
        minOrderAmount: undefined,
        maxUses: undefined,
        expiryDate: undefined,
        isActive: true,
      });
    }
  }, [voucher, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (voucher) {
        await loyaltyApi.updateVoucher(voucher.id, formData);
        toast.success("Cập nhật voucher thành công!");
      } else {
        await loyaltyApi.createVoucher(formData);
        toast.success("Tạo voucher thành công!");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Không thể lưu voucher"
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
            {voucher ? "Chỉnh Sửa Voucher" : "Tạo Voucher Mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã Voucher *
              </label>
              <Input
                required
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                placeholder="WELCOME10"
                disabled={!!voucher}
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Voucher *
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Giảm 10% cho đơn đầu tiên"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô Tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Mô tả voucher..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại Giảm Giá *
              </label>
              <select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountType: e.target.value as "PERCENT" | "FIXED",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PERCENT">Phần trăm (%)</option>
                <option value="FIXED">Số tiền cố định</option>
              </select>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá Trị Giảm *
              </label>
              <Input
                required
                type="number"
                min={0}
                step={formData.discountType === "PERCENT" ? 1 : 1000}
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountValue: Number(e.target.value),
                  })
                }
                placeholder={
                  formData.discountType === "PERCENT" ? "10" : "10000"
                }
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.discountType === "PERCENT"
                  ? "Nhập số phần trăm (0-100)"
                  : "Nhập số tiền (VND)"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Min Order Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đơn Tối Thiểu (VND)
              </label>
              <Input
                type="number"
                min={0}
                step={1000}
                value={formData.minOrderAmount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minOrderAmount: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                placeholder="Không bắt buộc"
              />
            </div>

            {/* Max Uses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số Lượng Tối Đa
              </label>
              <Input
                type="number"
                min={1}
                value={formData.maxUses || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxUses: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="Không giới hạn"
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày Hết Hạn
            </label>
            <Input
              type="date"
              value={formData.expiryDate || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expiryDate: e.target.value || undefined,
                })
              }
            />
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Kích hoạt voucher
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : voucher ? "Cập Nhật" : "Tạo Voucher"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
