"use client";

import { useEffect, useState } from "react";
import { inventoryApi, LowStockAlert } from "@/lib/api/inventory";
import { AlertTriangle, Package, X } from "lucide-react";
import toast from "react-hot-toast";

interface LowStockAlertProps {
  onDismiss?: () => void;
  maxAlerts?: number;
}

export default function LowStockAlertComponent({
  onDismiss,
  maxAlerts = 5,
}: LowStockAlertProps) {
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await inventoryApi.getLowStockAlerts();
        setAlerts(data.slice(0, maxAlerts));
      } catch (error: any) {
        console.error("Failed to fetch low stock alerts:", error);
        toast.error("Không thể tải cảnh báo tồn kho");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [maxAlerts]);

  if (loading) {
    return (
      <div className="animate-pulse bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="h-4 bg-yellow-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-700" />
          <h3 className="font-bold text-yellow-900">
            Cảnh Báo Tồn Kho Thấp ({alerts.length})
          </h3>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-yellow-700 hover:text-yellow-900"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between bg-white rounded p-2 border border-yellow-200"
          >
            <div className="flex items-center gap-2 flex-1">
              <Package className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-900">
                {alert.product?.name || "Unknown"}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600">
                Còn: <span className="font-bold text-red-600">{alert.quantity}</span> / Tối thiểu:{" "}
                <span className="font-bold">{alert.minStock}</span>
              </div>
              <div className="text-xs text-yellow-700 font-medium">
                {alert.stockLevel.toFixed(0)}% mức tối thiểu
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
