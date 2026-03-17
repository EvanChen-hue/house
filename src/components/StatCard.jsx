import { Typography } from "antd";

export default function StatCard({ label, value, hint }) {
  return (
    <div className="hk-stat">
      <div className="hk-statLabel">{label}</div>
      <Typography.Title level={3} className="hk-statValue">
        {value}
      </Typography.Title>
      {hint ? (
        <Typography.Text type="secondary">{hint}</Typography.Text>
      ) : null}
    </div>
  );
}

