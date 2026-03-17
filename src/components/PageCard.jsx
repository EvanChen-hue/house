import { Card } from "antd";

export default function PageCard({ children }) {
  return (
    <Card className="hk-card" bordered={false}>
      {children}
    </Card>
  );
}

