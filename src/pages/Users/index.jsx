import { useEffect, useMemo, useState } from "react";
import { Avatar, Button, Space, Table, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import PageCard from "@/components/PageCard.jsx";
import PageHeader from "@/components/PageHeader.jsx";
import UserDetailDrawer, { levelColor } from "@/components/forms/UserDetailDrawer.jsx";
import { usersApi } from "@/api/index.js";

export default function Users() {
  const [page, setPage] = useState({
    current: 1,
    size: 10,
    total: 0,
  });
  const [rows, setRows] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    const res = await usersApi.userList({ page: page.current, size: page.size });

    // Back-compat: if backend returns a plain array, still render it.
    if (Array.isArray(res)) {
      setRows(res?.records || []);
      setPage((prev) => ({ ...prev, total: res.length }));
      return;
    }

    setRows(res?.records || []);
    setPage((prev) => ({ ...prev, total: Number(res?.total) || 0 }));
  };

  useEffect(() => {
    fetchUsers();
  }, [page.current, page.size]);

  const columns = useMemo(
    () => [
      {
        title: "用户",
        dataIndex: "username",
        render: (value, record) => {
          const name = value ?? record?.name ?? "-";
          const initial = name.slice(0, 1);
          return (
            <Space>
              <Avatar style={{ backgroundColor: "#1677ff" }}>{initial}</Avatar>
              <div>
                <div style={{ fontWeight: 600 }}>{name}</div>
                <div style={{ color: "rgba(15,23,42,0.55)", fontSize: 12 }}>
                  {record.phone ?? ""}
                </div>
              </div>
            </Space>
          );
        },
      },
      { title: "上门地址", dataIndex: "address" },
      {
        title: "等级",
        dataIndex: "level",
        render: (level) => (
          <Tag color={levelColor[level] ?? "default"}>{level ?? "-"}</Tag>
        ),
      },
      {
        title: "订单数",
        dataIndex: "orders",
        align: "center",
        render: (orders) => orders ?? 0,
      },
      { title: "最近服务", dataIndex: "lastVisit" },
      { title: "创建时间", dataIndex: "createTime" },
      {
        title: "操作",
        width: 100,
        render: (_, record) => (
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedUser(record);
              setDrawerOpen(true);
            }}
          >
            详情
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <PageCard>
      <PageHeader
        title="用户管理"
        subtitle="用户信息、上门地址与服务数据（演示数据，可接入后端）"
      />
      <Table
        columns={columns}
        dataSource={rows}
        rowKey="id"
        pagination={{
          current: page.current,
          pageSize: page.size,
          total: page.total,
          showSizeChanger: true,
          onChange: (current, pageSize) =>
            setPage((prev) => ({ ...prev, current, size: pageSize })),
        }}
      />
      <UserDetailDrawer
        open={drawerOpen}
        user={selectedUser}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedUser(null);
        }}
      />
    </PageCard>
  );
}

