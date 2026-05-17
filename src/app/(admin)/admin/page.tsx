import prisma from "@/lib/prisma";
import DashboardStats from "@/components/admin/DashboardStats";

export const metadata = {
  title: "Dashboard | Coach Batoula",
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

  return <DashboardStats {...stats} />;
}
