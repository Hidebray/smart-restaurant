import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Order } from "../../types";
import toast from "react-hot-toast";

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  tableNumber: string;
}

export default function BillModal({ isOpen, onClose, order, tableNumber }: BillModalProps) {
  if (!order) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 text-center mb-4"
                >
                  Hóa đơn tạm tính - Bàn {tableNumber}
                </Dialog.Title>

                <div className="mt-2 space-y-4">
                  {/* Order Items List */}
                  <div className="border-t border-b border-gray-200 py-4 max-h-60 overflow-y-auto">
                    {order.items.map((item) => {
                      const modNames = item.modifiers?.map((m) => m.modifierOption.name).join(", ");
                      return (
                        <div key={item.id} className="flex justify-between items-start py-2">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">
                              {item.quantity}x {item.product.name}
                            </div>
                            {modNames && (
                              <div className="text-xs text-gray-500">{modNames}</div>
                            )}
                          </div>
                          <div className="font-medium text-gray-800">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.totalPrice)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center text-lg font-bold text-blue-600">
                    <span>Tổng cộng:</span>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(Number(order.totalAmount))}
                    </span>
                  </div>

                  {/* Static Payment QR */}
                  <div className="flex flex-col items-center justify-center gap-2 mt-4 p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Quét mã để thanh toán</span>
                    <QRCodeSVG
                      value={`https://payment-demo.smart.restaurant/pay?orderId=${order.id}&amount=${order.totalAmount}`}
                      size={150}
                      level="M"
                    />
                    <span className="text-xs text-gray-400">Demo Payment QR</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    className="flex-1 justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => {
                      // Mock print functionality
                      toast.success("Đang in hóa đơn...");
                    }}
                  >
                    🖨️ In Hóa Đơn
                  </button>
                  <button
                    type="button"
                    className="flex-1 justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Đóng
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
