"use client";

import { useEffect, useState } from "react";
import { loyaltyApi, LoyaltyPoints } from "@/lib/api/loyalty";
import { Trophy, Star, Award, Crown } from "lucide-react";
import toast from "react-hot-toast";
import { useI18n } from "@/contexts/I18nContext";

interface PointsDisplayProps {
  userId?: string; // If provided, fetch for that user (admin), otherwise current user
  compact?: boolean;
}

const tierConfig = {
  BRONZE: {
    nameKey: "loyalty.tiers.BRONZE",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
    icon: Trophy,
    minPoints: 0,
  },
  SILVER: {
    nameKey: "loyalty.tiers.SILVER",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    icon: Star,
    minPoints: 2000,
  },
  GOLD: {
    nameKey: "loyalty.tiers.GOLD",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-300",
    icon: Award,
    minPoints: 5000,
  },
  PLATINUM: {
    nameKey: "loyalty.tiers.PLATINUM",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
    icon: Crown,
    minPoints: 10000,
  },
};

export default function PointsDisplay({ userId, compact = false }: PointsDisplayProps) {
  const { t } = useI18n();
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        setLoading(true);
        const data = userId
          ? await loyaltyApi.getUserPoints(userId)
          : await loyaltyApi.getMyPoints();
        setLoyaltyPoints(data);
      } catch (error: any) {
        console.error("Failed to fetch loyalty points:", error);
        toast.error(t("loyalty.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [userId, t]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!loyaltyPoints) {
    return null;
  }

  const tier = tierConfig[loyaltyPoints.tier];
  const Icon = tier.icon;

  const tierName = t(tier.nameKey);

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${tier.bgColor} ${tier.borderColor} border`}>
        <Icon className={`w-4 h-4 ${tier.color}`} />
        <span className={`text-sm font-bold ${tier.color}`}>
          {loyaltyPoints.points.toLocaleString()} {t("loyalty.points")}
        </span>
        <span className={`text-xs ${tier.color} opacity-75`}>
          {tierName}
        </span>
      </div>
    );
  }

  // Calculate next tier progress
  const currentTierIndex = Object.keys(tierConfig).indexOf(loyaltyPoints.tier);
  const nextTier = currentTierIndex < 3 
    ? Object.values(tierConfig)[currentTierIndex + 1]
    : null;
  
  const progressToNextTier = nextTier
    ? Math.min(100, ((loyaltyPoints.totalEarned - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) * 100)
    : 100;

  const nextTierName = nextTier ? t(nextTier.nameKey) : "";

  return (
    <div className={`p-4 rounded-xl border-2 ${tier.borderColor} ${tier.bgColor}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${tier.bgColor} border ${tier.borderColor}`}>
            <Icon className={`w-6 h-6 ${tier.color}`} />
          </div>
          <div>
            <div className={`text-sm font-medium ${tier.color} opacity-75`}>
              {t("loyalty.memberTier")}
            </div>
            <div className={`text-xl font-bold ${tier.color}`}>
              {tierName}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${tier.color}`}>
            {loyaltyPoints.points.toLocaleString()}
          </div>
          <div className={`text-xs ${tier.color} opacity-75`}>
            {t("loyalty.currentPoints")}
          </div>
        </div>
      </div>

      {nextTier && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className={`text-xs font-medium ${tier.color} opacity-75`}>
              {t("loyalty.progressTo")} {nextTierName}
            </span>
            <span className={`text-xs font-bold ${tier.color}`}>
              {loyaltyPoints.totalEarned.toLocaleString()} / {nextTier.minPoints.toLocaleString()} {t("loyalty.points")}
            </span>
          </div>
          <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${tier.bgColor} transition-all duration-300`}
              style={{ width: `${progressToNextTier}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-white/30 flex justify-between text-xs">
        <div>
          <div className={`${tier.color} opacity-75`}>{t("loyalty.totalEarned")}</div>
          <div className={`font-bold ${tier.color}`}>
            {loyaltyPoints.totalEarned.toLocaleString()} {t("loyalty.points")}
          </div>
        </div>
        <div>
          <div className={`${tier.color} opacity-75`}>{t("loyalty.totalRedeemed")}</div>
          <div className={`font-bold ${tier.color}`}>
            {loyaltyPoints.totalRedeemed.toLocaleString()} {t("loyalty.points")}
          </div>
        </div>
      </div>
    </div>
  );
}
