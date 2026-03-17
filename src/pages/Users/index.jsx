import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import PageCard from "@/components/PageCard.jsx";
import PageHeader from "@/components/PageHeader.jsx";
import { usersApi } from "@/api/index.js";

export default function Users() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let mounted = true;
    usersApi.list().then((res) => {
      if (mounted) setRows(res);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const columns = [
    { title: "用户", dataIndex: "name" },
    { title: "手机号", dataIndex: "phone" },
    { title: "上门地址", dataIndex: "address" },
    { title: "下单次数", dataIndex: "orders" },
    {
      title: "等级",
      dataIndex: "level",
      render: (value) => (
        <Tag color={value === "VIP" ? "gold" : "blue"}>{value}</Tag>
      ),
    },
    { title: "最近服务", dataIndex: "lastVisit" },
  ];

  return (
    <PageCard>
      <PageHeader
        title="用户管理"
        subtitle="用户信息、上门地址与服务数据（演示数据，可接入后端）"
      />
      <Table columns={columns} dataSource={rows} rowKey="id" pagination={false} />
    </PageCard>
  );
}

