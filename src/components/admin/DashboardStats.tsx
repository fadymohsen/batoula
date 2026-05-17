'use client';

import { useAdminLocale } from './AdminLocaleProvider';

interface Props {
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  totalPlans: number;
}

export default function DashboardStats({ totalOrders, pendingOrders, revenue, totalPlans }: Props) {
  const { t } = useAdminLocale();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#2c2825]">{t.welcome}</h1>
        <p className="text-[#8a7f76] mt-1">{t.welcomeDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-500 mb-1">{t.totalOrders}</p>
          <p className="text-3xl font-extrabold text-[#2c2825]">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-500 mb-1">{t.pendingOrders}</p>
          <p className="text-3xl font-extrabold text-orange-500">{pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-500 mb-1">{t.revenue}</p>
          <p className="text-3xl font-extrabold text-green-600">${revenue}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-500 mb-1">{t.activePlans}</p>
          <p className="text-3xl font-extrabold text-[#b48a66]">{totalPlans}</p>
        </div>
      </div>
    </div>
  );
}
