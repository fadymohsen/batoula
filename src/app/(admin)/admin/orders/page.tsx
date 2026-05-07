import prisma from "@/lib/prisma";
import { Check, X, Eye, Clock } from "lucide-react";
import { revalidatePath } from "next/cache";

async function updateOrderStatus(orderId: string, status: "COMPLETED" | "FAILED") {
  "use server";
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath("/admin/orders");
  } catch (error) {
    console.error("Failed to update status", error);
  }
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2825]">إدارة الطلبات</h1>
          <p className="text-[#8a7f76] mt-1">تأكدي من الحوالات المالية وفعلي الاشتراكات</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-[#faf8f5] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-[#8a7f76]">المتدربة</th>
                <th className="px-6 py-4 text-sm font-bold text-[#8a7f76]">الخطة / السعر</th>
                <th className="px-6 py-4 text-sm font-bold text-[#8a7f76]">طريقة الدفع</th>
                <th className="px-6 py-4 text-sm font-bold text-[#8a7f76]">التاريخ</th>
                <th className="px-6 py-4 text-sm font-bold text-[#8a7f76]">الحالة</th>
                <th className="px-6 py-4 text-sm font-bold text-[#8a7f76]">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    لا يوجد طلبات حالياً
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
                      <div className="font-semibold">{order.plan.title}</div>
                      <div className="text-xs text-[#b48a66] font-bold">${order.plan.price}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Intl.DateTimeFormat('en-CA').format(new Date(order.createdAt))}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {order.receiptUrl && (
                          <a 
                            href={order.receiptUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="عرض الإيصال"
                          >
                            <Eye size={18} />
                          </a>
                        )}
                        {order.status === "PENDING" && (
                          <>
                            <form action={updateOrderStatus.bind(null, order.id, "COMPLETED")}>
                              <button 
                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                title="تأكيد الدفع"
                              >
                                <Check size={18} />
                              </button>
                            </form>
                            <form action={updateOrderStatus.bind(null, order.id, "FAILED")}>
                              <button 
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                title="رفض الطلب"
                              >
                                <X size={18} />
                              </button>
                            </form>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "PENDING":
      return (
        <span className="flex items-center gap-1.5 text-xs font-black text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full w-fit">
          <Clock size={12} />
          بانتظار التأكيد
        </span>
      );
    case "COMPLETED":
      return (
        <span className="flex items-center gap-1.5 text-xs font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit">
          <Check size={12} />
          مكتمل
        </span>
      );
    case "FAILED":
      return (
        <span className="flex items-center gap-1.5 text-xs font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-full w-fit">
          <X size={12} />
          مرفوض
        </span>
      );
    default:
      return null;
  }
}
