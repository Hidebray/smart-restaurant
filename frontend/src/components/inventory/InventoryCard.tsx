"use client";

import { Inventory, LowStockAlert } from "@/types/inventory";
import { Package, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";

interface InventoryCardProps {
  inventory: Inventory | LowStockAlert;
  onEdit?: (inventory: Inventory) => void;
  onRestock?: (inventory: Inventory) => void;
}

export default function InventoryCard({
  inventory,
  onEdit,
  onRestock,
}: InventoryCardProps) {
  const isLowStock =
    "isLowStock" in inventory
      ? inventory.isLowStock
      : inventory.quantity <= inventory.minStock;
  const isOutOfStock = inventory.quantity === 0;
  const stockPercentage =
    inventory.maxStock > 0
      ? (inventory.quantity / inventory.maxStock) * 100
      : 0;

  const getStockColor = () => {
    if (isOutOfStock) return "border-red-500 bg-red-50";
    if (isLowStock) return "border-yellow-500 bg-yellow-50";
    if (stockPercentage > 80) return "border-green-500 bg-green-50";
    return "border-blue-500 bg-blue-50";
  };

  const getStockTextColor = () => {
    if (isOutOfStock) return "text-red-900";
    if (isLowStock) return "text-yellow-900";
    return "text-gray-900";
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 ${getStockColor()} transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Package
              className={`w-5 h-5 ${
                isOutOfStock
                  ? "text-red-600"
                  : isLowStock
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            />
            <h3 className="font-bold text-lg text-gray-900">
              {inventory.product?.name || "Unknown Product"}
            </h3>
          </div>
          {inventory.product?.status && (
            <div className="text-xs text-gray-600 mb-2">
              Status: {inventory.product.status}
            </div>
          )}
        </div>
        {isLowStock && (
          <div className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-2 py-1 rounded border border-yellow-300">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-bold">Low Stock</span>
          </div>
        )}
        {isOutOfStock && (
          <div className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded border border-red-300">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-bold">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Số lượng hiện có:</span>
          <span className={`text-lg font-bold ${getStockTextColor()}`}>
            {inventory.quantity.toLocaleString()} {inventory.unit}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Tối thiểu:</span>
          <span className="font-medium text-gray-900">
            {inventory.minStock.toLocaleString()} {inventory.unit}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Tối đa:</span>
          <span className="font-medium text-gray-900">
            {inventory.maxStock.toLocaleString()} {inventory.unit}
          </span>
        </div>

        {/* Stock Level Bar */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Mức tồn kho</span>
            <span className="text-xs font-bold text-gray-900">
              {Math.round(stockPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isOutOfStock
                  ? "bg-red-600"
                  : isLowStock
                  ? "bg-yellow-500"
                  : stockPercentage > 80
                  ? "bg-green-500"
                  : "bg-blue-500"
              }`}
              style={{ width: `${Math.min(100, Math.max(0, stockPercentage))}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {onRestock && (
          <button
            onClick={() => onRestock(inventory)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-1"
          >
            <TrendingDown className="w-4 h-4" />
            Nhập kho
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(inventory)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            Sửa
          </button>
        )}
      </div>
    </div>
  );
}
