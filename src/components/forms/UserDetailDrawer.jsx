import { Avatar, Descriptions, Drawer, Tag } from "antd";

export const levelColor = { VIP: "gold", 普通: "default" };

export default function UserDetailDrawer({ open, user, onClose }) {
  if (!user) return null;

  const initial = user.name?.slice?.(0, 1) || "U";

  return (
    <Drawer
      title="用户详情"
      open={open}
      onClose={onClose}
      width={400}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Avatar size={72} style={{ backgroundColor: "#1677ff", fontSize: 28 }}>
          {initial}
        </Avatar>
        <div style={{ marginTop: 12, fontSize: 18, fontWeight: 600 }}>
          {user.name}
        </div>
        <Tag color={levelColor[user.level] ?? "default"} style={{ marginTop: 6 }}>
          {user.level ?? "-"}
        </Tag>
      </div>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="手机号">{user.phone ?? "-"}</Descriptions.Item>
        <Descriptions.Item label="上门地址">{user.address ?? "-"}</Descriptions.Item>
        <Descriptions.Item label="订单数">{user.orders ?? 0}</Descriptions.Item>
        <Descriptions.Item label="最近服务">{user.lastVisit ?? "-"}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{user.createTime ?? "-"}</Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
}
