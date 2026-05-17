import prisma from "@/lib/prisma";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  const serialized = orders.map(o => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));

  return <OrdersTable initialOrders={serialized} />;
}
