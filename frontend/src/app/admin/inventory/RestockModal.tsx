"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { inventoryApi, Inventory } from "@/lib/api/inventory";
import toast from "react-hot-toast";

interface RestockModalProps {
  inventory: Inventory | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RestockModal({
  inventory,
  isOpen,
  onClose,
  onSuccess,
}: RestockModalProps) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventory || quantity <= 0) {
      toast.error("Vui lòng nhập số lượng hợp lệ");
      return;
    }

    setLoading(true);

    try {
      await inventoryApi.restock(inventory.id, {
        quantity,
        reason: reason || undefined,
      });
      toast.success(`Đã nhập kho ${quantity} ${inventory.unit}`);
      setQuantity(0);
      setReason("");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Không thể nhập kho"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!inventory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nhập Kho: {inventory.product?.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Tồn kho hiện tại:</div>
            <div className="text-lg font-bold text-gray-900">
              {inventory.quantity.toLocaleString()} {inventory.unit}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số Lượng Nhập *
            </label>
            <Input
              required
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Nhập số lượng"
            />
            <div className="text-xs text-gray-500 mt-1">
              Đơn vị: {inventory.unit}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lý Do (Tùy chọn)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Ví dụ: Nhập hàng từ nhà cung cấp..."
            />
          </div>

          {quantity > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">Tồn kho sau nhập:</div>
              <div className="text-lg font-bold text-blue-900">
                {(inventory.quantity + quantity).toLocaleString()} {inventory.unit}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading || quantity <= 0}>
              {loading ? "Đang nhập..." : "Nhập Kho"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
