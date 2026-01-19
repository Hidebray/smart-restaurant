"use client";

import { useEffect, useState } from "react";
import { loyaltyApi, PointsHistoryResponse, PointsTransaction } from "@/lib/api/loyalty";
import { ArrowUp, ArrowDown, Clock, Receipt } from "lucide-react";
import toast from "react-hot-toast";

interface PointsHistoryProps {
  userId?: string; // If provided, fetch for that user (admin), otherwise current user
  limit?: number;
}

export default function PointsHistory({ userId, limit = 20 }: PointsHistoryProps) {
  const [history, setHistory] = useState<PointsHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await loyaltyApi.getPointsHistory({
          page,
          limit,
        });
        setHistory(data);
      } catch (error: any) {
        console.error("Failed to fetch points history:", error);
        toast.error("Không thể tải lịch sử điểm");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [page, limit]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse h-16 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!history || history.transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Chưa có giao dịch nào</p>
      </div>
    );
  }

  const getTransactionIcon = (type: PointsTransaction["type"]) => {
    switch (type) {
      case "EARN":
        return <ArrowUp className="w-5 h-5 text-green-600" />;
      case "REDEEM":
        return <ArrowDown className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: PointsTransaction["type"]) => {
    switch (type) {
      case "EARN":
        return "text-green-700 bg-green-50 border-green-200";
      case "REDEEM":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-3">
      {history.transactions.map((transaction) => {
        const isEarn = transaction.type === "EARN";
        const colorClass = getTransactionColor(transaction.type);

        return (
          <div
            key={transaction.id}
            className={`p-4 rounded-lg border ${colorClass}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className={`p-2 rounded-lg ${colorClass} border`}>
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">
                    {transaction.description || "Giao dịch điểm"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatDate(transaction.createdAt)}
                  </div>
                  {transaction.order && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Receipt className="w-3 h-3" />
                      <span>
                        Đơn hàng #{transaction.order.id.substring(0, 8)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-lg font-bold ${
                    isEarn ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {isEarn ? "+" : ""}
                  {transaction.points.toLocaleString()} điểm
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {transaction.type === "EARN" ? "Tích lũy" : "Đã đổi"}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {history.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Trước
          </button>
          <span className="text-sm text-gray-600">
            Trang {page} / {history.pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(history.pagination.totalPages, p + 1))}
            disabled={page === history.pagination.totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
