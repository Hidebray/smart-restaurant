import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Order } from "@/types";
import { useI18n } from "@/contexts/I18nContext";
import Button from "@/components/ui/Button";
import { ordersApi } from "@/lib/api/orders";

interface OrderDetailModalProps {
    open: boolean;
    order: Order | null;
    onClose: () => void;
    onOrderUpdated?: () => void;
}

const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);

const ORDER_STATUSES = [
    "PENDING",
    "ACCEPTED",
    "PREPARING",
    "READY",
    "SERVED",
    "COMPLETED",
    "CANCELLED",
    "REJECTED"
];

export default function OrderDetailModal({
    open,
    order,
    onClose,
    onOrderUpdated
}: OrderDetailModalProps) {
    const { t } = useI18n();
    const [isUpdating, setIsUpdating] = useState(false);

    // We can use local state for the status selection if we want to confirm first
    // Or just buttons. Let's use a select for flexibility.
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    if (!order) return null;

    // Initialize selected status when opening (or when order changes)
    // We can't do this easily in render, so we just default to order.status if selectedStatus is empty
    // But better to handle in a useEffect or just derive it.
    const currentStatus = selectedStatus || order.status;

    const handleStatusChange = async (newStatus: string) => {
        if (!order) return;
        setIsUpdating(true);
        try {
            await ordersApi.updateStatus(order.id, newStatus);
            if (onOrderUpdated) onOrderUpdated();
            onClose();
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t('orders.orderNumber')} #{order.id.slice(0, 8)}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="flex justify-between items-start text-sm border-b pb-4">
                        <div className="space-y-1">
                            <p><span className="font-semibold">{t('kitchen.table')}:</span> {(order as any).table?.tableNumber || "N/A"}</p>
                            <p><span className="font-semibold">{t('common.sortDate')}:</span> {new Date(order.createdAt).toLocaleString()}</p>
                            {order.notes && (
                                <p className="text-orange-600 font-semibold mt-1">
                                    {t('cart.specialInstructions')}: {order.notes}
                                </p>
                            )}
                        </div>
                        <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800`}>
                                {t(`status.${order.status}`) || order.status}
                            </span>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                        <h3 className="font-semibold text-gray-900">{t('cart.items')}</h3>
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md font-bold text-sm text-gray-600">
                                        {item.quantity}x
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">{item.product.name}</div>
                                        {item.modifiers && item.modifiers.length > 0 && (
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {item.modifiers.map(m => m.modifierOption.name).join(", ")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="font-medium text-gray-900">
                                    {formatPrice(item.totalPrice)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                            <span>{t('cart.total')}</span>
                            <div className="text-right">
                                {(() => {
                                    const rawTotal = Number(order.totalAmount);
                                    let finalTotal = rawTotal;
                                    const dVal = Number(order.discountValue || 0);
                                    if (order.discountType === 'PERCENT') finalTotal = rawTotal - (rawTotal * dVal / 100);
                                    else if (order.discountType === 'FIXED') finalTotal = rawTotal - dVal;
                                    finalTotal = Math.max(0, finalTotal);

                                    return (
                                        <>
                                            {finalTotal < rawTotal && (
                                                <div className="text-sm text-gray-500 line-through font-normal">
                                                    {formatPrice(rawTotal)}
                                                </div>
                                            )}
                                            <div>{formatPrice(finalTotal)}</div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Status Update Control */}
                    <div className="border-t pt-4 bg-gray-50 -mx-6 px-6 pb-2 mt-4 rounded-b-lg">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('common.status')}:</h3>
                        <div className="flex gap-2 flex-wrap">
                            {ORDER_STATUSES.map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    disabled={isUpdating || order.status === status}
                                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors
                                        ${order.status === status
                                            ? 'bg-gray-900 text-white border-gray-900 cursor-default opacity-100'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                        }`}
                                >
                                    {t(`status.${status}`) || status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-0">
                    <Button onClick={onClose} variant="outline">{t('common.close') || 'Close'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
