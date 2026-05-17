'use client';

import { useState, useEffect } from 'react';
import { Check, X, Eye, Clock, RefreshCw, Trash2 } from 'lucide-react';
import { useAdminLocale } from './AdminLocaleProvider';
import ConfirmModal from './ConfirmModal';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  status: string;
  receiptUrl: string | null;
  createdAt: string;
  plan: { title: string; titleEn: string | null; price: number };
}

export default function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const { t, locale } = useAdminLocale();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setUpdating(deleteTarget);
    setDeleteTarget(null);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: deleteTarget }),
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== deleteTarget));
      }
    } catch (err) {
      console.error('Failed to delete order', err);
    } finally {
      setUpdating(null);
    }
  };

  const updateStatus = async (orderId: string, status: 'COMPLETED' | 'FAILED') => {
    setUpdating(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdating(null);
    }
  };

  const paymentLabels: Record<string, string> = {
    INSTAPAY: 'InstaPay',
    BANK_TRANSFER: locale === 'ar' ? 'تحويل بنكي' : 'Bank Transfer',
    PAYPAL: 'PayPal',
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="flex items-center gap-1.5 text-xs font-black text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full w-fit">
            <Clock size={12} />
            {t.pending}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1.5 text-xs font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit">
            <Check size={12} />
            {t.completed}
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center gap-1.5 text-xs font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-full w-fit">
            <X size={12} />
            {t.failed}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2825]">{t.manageOrders}</h1>
          <p className="text-[#8a7f76] mt-1">{t.manageOrdersDesc}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
          {locale === 'ar' ? 'تحديث تلقائي' : 'Auto-refresh'}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
            <thead className="bg-[#faf8f5] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-[#8a7f76]">{t.trainee}</th>
                <th className="px-6 py-4 text-sm font-bold text-[#8a7f76]">{t.planPrice}</th>
                <th className="px-6 py-4 text-sm font-bold text-[#8a7f76]">{t.paymentMethod}</th>
                <th className="px-6 py-4 text-sm font-bold text-[#8a7f76]">{t.date}</th>
                <th className="px-6 py-4 text-sm font-bold text-[#8a7f76]">{t.status}</th>
                <th className="px-6 py-4 text-sm font-bold text-[#8a7f76]">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    {t.noOrders}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#2c2825]">{order.customerName}</div>
                      <div className="text-xs text-gray-400">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{locale === 'en' && order.plan.titleEn ? order.plan.titleEn : order.plan.title}</div>
                      <div className="text-xs text-[#b48a66] font-bold">${order.plan.price}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">
                        {paymentLabels[order.paymentMethod] || order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Intl.DateTimeFormat('en-CA').format(new Date(order.createdAt))}
                    </td>
                    <td className="px-6 py-4">
                      {statusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {order.receiptUrl && (
                          <a
                            href={order.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title={t.viewReceipt}
                          >
                            <Eye size={18} />
                          </a>
                        )}
                        {order.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => updateStatus(order.id, 'COMPLETED')}
                              disabled={updating === order.id}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                              title={t.confirmPayment}
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => updateStatus(order.id, 'FAILED')}
                              disabled={updating === order.id}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                              title={t.rejectOrder}
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setDeleteTarget(order.id)}
                          disabled={updating === order.id}
                          className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                          title={t.deleteOrder}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title={t.deleteOrder}
        message={t.confirmDelete}
        confirmLabel={t.deleteOrder}
        cancelLabel={locale === 'ar' ? 'إلغاء' : 'Cancel'}
        variant="danger"
        onConfirm={executeDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
