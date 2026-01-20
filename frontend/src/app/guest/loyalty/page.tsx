"use client";

import { Suspense, useState } from "react";
import Header from "@/components/mobile/Header";
import PointsDisplay from "@/components/loyalty/PointsDisplay";
import PointsHistory from "@/components/loyalty/PointsHistory";
import VoucherList from "@/components/loyalty/VoucherList";
import { useI18n } from "@/contexts/I18nContext";
import { Ticket, History, Award } from "lucide-react";

function LoyaltyContent() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"points" | "vouchers" | "history">("points");

  return (
    <>
      <Header
        title={t("loyalty.title") || "Điểm Tích Lũy"}
        showBack
        backUrl="/guest/profile"
      />

      <div className="p-4 safe-area-pb space-y-4">
        {/* Points Display */}
        <PointsDisplay />

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab("points")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === "points"
                ? "bg-orange-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Award className="w-4 h-4" />
            {t("loyalty.tabs.points")}
          </button>
          <button
            onClick={() => setActiveTab("vouchers")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === "vouchers"
                ? "bg-orange-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Ticket className="w-4 h-4" />
            {t("loyalty.tabs.vouchers")}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === "history"
                ? "bg-orange-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <History className="w-4 h-4" />
            {t("loyalty.tabs.history")}
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 min-h-[400px]">
          {activeTab === "points" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {t("loyalty.pointsExchange")}
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-800 space-y-2">
                  <p className="font-semibold">{t("loyalty.pointsRules")}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t("loyalty.rule1")}</li>
                    <li>{t("loyalty.rule2")}</li>
                  </ul>
                  <p className="font-semibold mt-3">{t("loyalty.memberTiers")}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t("loyalty.tierBronze")}</li>
                    <li>{t("loyalty.tierSilver")}</li>
                    <li>{t("loyalty.tierGold")}</li>
                    <li>{t("loyalty.tierPlatinum")}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "vouchers" && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {t("loyalty.availableVouchers")}
              </h2>
              <VoucherList />
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {t("loyalty.transactionHistory")}
              </h2>
              <PointsHistory />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function LoyaltyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Suspense fallback={<div>Loading...</div>}>
        <LoyaltyContent />
      </Suspense>
    </main>
  );
}
