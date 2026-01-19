"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { inventoryApi, Inventory } from "@/lib/api/inventory";
import { productsApi } from "@/lib/api/products";
import { Product } from "@/types";
import toast from "react-hot-toast";
import useSWR from "swr";

interface InventoryFormModalProps {
  inventory: Inventory | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const productsFetcher = () => productsApi.getAll();

export default function InventoryFormModal({
  inventory,
  isOpen,
  onClose,
  onSuccess,
}: InventoryFormModalProps) {
  const { data: products } = useSWR<Product[]>("products", productsFetcher);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 0,
    minStock: 0,
    maxStock: 1000,
    unit: "pcs",
  });

  useEffect(() => {
    if (inventory) {
      setFormData({
        productId: inventory.productId,
        quantity: inventory.quantity,
        minStock: inventory.minStock,
        maxStock: inventory.maxStock,
        unit: inventory.unit,
      });
    } else {
      setFormData({
        productId: "",
        quantity: 0,
        minStock: 0,
        maxStock: 1000,
        unit: "pcs",
      });
    }
  }, [inventory, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (inventory) {
        await inventoryApi.update(inventory.id, {
          quantity: formData.quantity,
          minStock: formData.minStock,
          maxStock: formData.maxStock,
          unit: formData.unit,
        });
        toast.success("Cập nhật tồn kho thành công!");
      } else {
        await inventoryApi.create({
          productId: formData.productId,
          quantity: formData.quantity,
          minStock: formData.minStock,
          maxStock: formData.maxStock,
          unit: formData.unit,
        });
        toast.success("Tạo tồn kho thành công!");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Không thể lưu tồn kho"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {inventory ? "Chỉnh Sửa Tồn Kho" : "Tạo Tồn Kho Mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection (only for new inventory) */}
          {!inventory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sản Phẩm *
              </label>
              <select
                required
                value={formData.productId}
                onChange={(e) =>
                  setFormData({ ...formData, productId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn sản phẩm...</option>
                {products?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {inventory && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Sản phẩm:</div>
              <div className="font-bold text-gray-900">
                {inventory.product?.name || "Unknown"}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số Lượng Hiện Có *
              </label>
              <Input
                required
                type="number"
                min={0}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đơn Vị *
              </label>
              <select
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pcs">Cái (pcs)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="l">Lít (l)</option>
                <option value="box">Hộp (box)</option>
                <option value="pack">Gói (pack)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Min Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tồn Kho Tối Thiểu *
              </label>
              <Input
                required
                type="number"
                min={0}
                value={formData.minStock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minStock: Number(e.target.value),
                  })
                }
              />
              <div className="text-xs text-gray-500 mt-1">
                Cảnh báo khi dưới mức này
              </div>
            </div>

            {/* Max Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tồn Kho Tối Đa *
              </label>
              <Input
                required
                type="number"
                min={1}
                value={formData.maxStock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxStock: Number(e.target.value),
                  })
                }
              />
              <div className="text-xs text-gray-500 mt-1">
                Sức chứa tối đa
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : inventory ? "Cập Nhật" : "Tạo Tồn Kho"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
