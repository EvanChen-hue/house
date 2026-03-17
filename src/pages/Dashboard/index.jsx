import { useEffect, useState } from "react";
import { statsApi } from "@/api/index.js";
import PageCard from "@/components/PageCard.jsx";
import PageHeader from "@/components/PageHeader.jsx";
import StatCard from "@/components/StatCard.jsx";
import RevenueChart from "@/components/charts/RevenueChart.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true;
    statsApi.getDashboard().then((res) => {
      if (mounted) setStats(res);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageCard>
      <PageHeader
        title="收入统计大屏"
        subtitle="按月收入趋势与关键运营指标（演示数据，已封装 API）"
      />
      <div className="hk-statGrid">
        <StatCard label="本月收入" value={stats?.kpi.monthRevenue ?? "-"} hint="环比 +12%" />
        <StatCard label="累计订单" value={stats?.kpi.totalOrders ?? "-"} hint="近 30 天活跃" />
        <StatCard label="好评率" value={stats?.kpi.fiveStar ?? "-"} hint="持续稳定" />
        <StatCard label="上架阿姨" value={stats?.kpi.activeAunties ?? "-"} hint="可接单人数" />
      </div>
      <div className="hk-chartBox">
        <RevenueChart data={stats?.revenueSeries ?? []} />
      </div>
    </PageCard>
  );
}

