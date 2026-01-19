"use client";

import { useState } from "react";
import useSWR from "swr";
import { inventoryApi, Inventory, InventoryStats } from "@/lib/api/inventory";
import Button from "@/components/ui/Button";
import * as Icons from "lucide-react";
import InventoryFormModal from "./InventoryFormModal";
import RestockModal from "./RestockModal";
import InventoryCard from "@/components/inventory/InventoryCard";
import LowStockAlert from "@/components/inventory/LowStockAlert";
import toast from "react-hot-toast";

const fetcher = () => inventoryApi.getAll();

export default function InventoryManagementPage() {
  const { data: inventories, error, mutate } = useSWR<Inventory[]>("inventory", fetcher);
  const { data: stats } = useSWR<InventoryStats>("inventory-stats", () =>
    inventoryApi.getStats(),
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState<Inventory | null>(null);
  const [restockingInventory, setRestockingInventory] = useState<Inventory | null>(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const handleAddNew = () => {
    setEditingInventory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (inventory: Inventory) => {
    setEditingInventory(inventory);
    setIsFormOpen(true);
  };

  const handleRestock = (inventory: Inventory) => {
    setRestockingInventory(inventory);
    setIsRestockModalOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingInventory(null);
    mutate();
  };

  const handleRestockClose = () => {
    setIsRestockModalOpen(false);
    setRestockingInventory(null);
    mutate();
  };

  const handleDelete = async (inventoryId: string, productName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa tồn kho cho "${productName}"?`)) {
      return;
    }

    try {
      await inventoryApi.delete(inventoryId);
      toast.success(`Đã xóa tồn kho cho "${productName}"`);
      mutate();
    } catch (error: any) {
      console.error("Delete inventory error:", error);
      toast.error(error.response?.data?.message || "Không thể xóa tồn kho");
    }
  };

  if (error) return <div>Failed to load inventory</div>;
  if (!inventories) return <div>Loading...</div>;

  const filteredInventories = showLowStockOnly
    ? inventories.filter((inv) => inv.quantity <= inv.minStock)
    : inventories;

  const lowStockCount = inventories.filter((inv) => inv.quantity <= inv.minStock).length;
  const outOfStockCount = inventories.filter((inv) => inv.quantity === 0).length;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Tồn Kho</h1>
          <p className="text-sm text-gray-700">
            Quản lý tồn kho sản phẩm và cảnh báo hết hàng
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Icons.PlusCircle className="mr-2 h-4 w-4" /> Tạo Tồn Kho Mới
        </Button>
      </div>

      {isFormOpen && (
        <InventoryFormModal
          inventory={editingInventory}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}

      {isRestockModalOpen && restockingInventory && (
        <RestockModal
          inventory={restockingInventory}
          isOpen={isRestockModalOpen}
          onClose={handleRestockClose}
          onSuccess={handleRestockClose}
        />
      )}

      {/* Low Stock Alert Banner */}
      {lowStockCount > 0 && (
        <LowStockAlert maxAlerts={3} />
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Tổng Sản Phẩm</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-yellow-200 bg-yellow-50">
            <div className="text-sm text-gray-600 mb-1">Tồn Kho Thấp</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-red-200 bg-red-50">
            <div className="text-sm text-gray-600 mb-1">Hết Hàng</div>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Tổng Số Lượng</div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalItems.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            showLowStockOnly
              ? "bg-yellow-600 text-white"
              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          }`}
        >
          <Icons.AlertTriangle className="w-4 h-4 inline-block mr-2" />
          Chỉ hiển thị tồn kho thấp ({lowStockCount})
        </button>
        <div className="text-sm text-gray-600">
          Tổng: {filteredInventories.length} sản phẩm
        </div>
      </div>

      {/* Inventory List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventories.map((inventory) => (
          <div key={inventory.id} className="relative">
            <InventoryCard
              inventory={inventory}
              onEdit={handleEdit}
              onRestock={handleRestock}
            />
            <button
              onClick={() =>
                handleDelete(inventory.id, inventory.product?.name || "Unknown")
              }
              className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
              title="Xóa tồn kho"
            >
              <Icons.Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        {filteredInventories.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Icons.Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>
              {showLowStockOnly
                ? "Không có sản phẩm nào tồn kho thấp"
                : "Chưa có tồn kho nào"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
