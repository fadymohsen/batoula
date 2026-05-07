import prisma from "@/lib/prisma";

export const metadata = {
  title: "لوحة التحكم | كوتش بتولة",
};

export default async function AdminDashboardPage() {
  let stats = {
    totalOrders: 0,
    pendingOrders: 0,
    totalPlans: 0,
    revenue: 0
  };

  try {
    const [totalOrders, pendingOrders, totalPlans, orders] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.plan.count(),
      prisma.order.findMany({ where: { status: 'COMPLETED' }, include: { plan: true } })
    ]);

    stats.totalOrders = totalOrders;
    stats.pendingOrders = pendingOrders;
    stats.totalPlans = totalPlans;
    stats.revenue = orders.reduce((sum, order) => sum + (order.plan?.price || 0), 0);
  } catch (e) {
    console.error("DB stats failed", e);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#2c2825]">أهلاً بك، كوتش بتولة</h1>
        <p className="text-[#8a7f76] mt-1">هنا ملخص لأداء الموقع والطلبات الأخيرة.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-500 mb-1">إجمالي الطلبات</p>
          <p className="text-3xl font-extrabold text-[#2c2825]">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-500 mb-1">طلبات بانتظار التأكيد</p>
          <p className="text-3xl font-extrabold text-orange-500">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-500 mb-1">الإيرادات</p>
          <p className="text-3xl font-extrabold text-green-600">${stats.revenue}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-500 mb-1">الخطط الفعالة</p>
          <p className="text-3xl font-extrabold text-[#b48a66]">{stats.totalPlans}</p>
        </div>
      </div>
    </div>
  );
}
