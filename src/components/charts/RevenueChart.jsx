import ReactECharts from "echarts-for-react";

export default function RevenueChart({ data }) {
  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: 44, right: 24, top: 34, bottom: 30 },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((d) => d.month),
      axisLine: { lineStyle: { color: "rgba(148,163,184,0.45)" } },
      axisLabel: { color: "rgba(15,23,42,0.65)" },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "rgba(15,23,42,0.65)" },
      splitLine: { lineStyle: { color: "rgba(148,163,184,0.18)" } },
    },
    series: [
      {
        name: "收入",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        data: data.map((d) => d.value),
        lineStyle: { width: 4, color: "#1e6fff" },
        areaStyle: { color: "rgba(30,111,255,0.18)" },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "100%" }} />;
}

