import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Order, OrderItem } from "@/types"; // Adjust import path if needed
import { useI18n } from "@/contexts/I18nContext";
import Button from "@/components/ui/Button";

interface OrderDetailModalProps {
    open: boolean;
    order: Order | null;
    onClose: () => void;
}

const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);

export default function OrderDetailModal({
    open,
    order,
    onClose,
}: OrderDetailModalProps) {
    const { t } = useI18n();

    if (!order) return null;

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
                            <span>{formatPrice(Number(order.totalAmount))}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={onClose} variant="outline">{t('common.close') || 'Close'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
