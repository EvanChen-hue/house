import { useEffect, useState } from "react";
import { statsApi } from "@/api/index.js";
import PageCard from "@/components/PageCard.jsx";
import PageHeader from "@/components/PageHeader.jsx";
import StatCard from "@/components/StatCard.jsx";
import OrderTrendChart from "@/components/charts/RevenueChart.jsx";

const toMoney = (amount) => `¥ ${Number(amount || 0).toLocaleString("zh-CN")}`;

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    let mounted = true;

    Promise.all([statsApi.getOverview(), statsApi.getTrend()]).then(([overviewRes, trendRes]) => {
      if (!mounted) return;
      setOverview(overviewRes || null);
      setTrend(Array.isArray(trendRes) ? trendRes : []);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageCard>
      <PageHeader
        title="首页核心指标"
        subtitle="销售、订单与退款等关键数据概览"
      />
      <div className="hk-statGrid">
        <StatCard label="总销售额" value={toMoney(overview?.totalSales)} />
        <StatCard label="总订单数" value={overview?.totalOrders ?? 0} />
        <StatCard label="今日销售额" value={toMoney(overview?.todaySales)} />
        <StatCard label="今日订单数" value={overview?.todayOrders ?? 0} />
        <StatCard label="退款金额" value={toMoney(overview?.refundAmount)} />
        <StatCard label="待处理订单" value={overview?.pendingOrders ?? 0} />
      </div>
      <div className="hk-chartBox">
        <OrderTrendChart data={trend} />
      </div>
    </PageCard>
  );
}

