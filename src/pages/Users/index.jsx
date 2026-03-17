import { useEffect, useState } from "react";
import { Table } from "antd";
import PageCard from "@/components/PageCard.jsx";
import PageHeader from "@/components/PageHeader.jsx";
import { usersApi } from "@/api/index.js";

export default function Users() {
  const [page, setPage] = useState({
    current: 1,
    size: 10,
    total: 0,
  });
  const [rows, setRows] = useState([]);

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

  const columns = [
    {
      title: "用户",
      dataIndex: "username",
      render: (value, record) => value ?? record?.name ?? "-",
    },
    { title: "手机号", dataIndex: "phone" },
    { title: "上门地址", dataIndex: "address" },
    { title: "创建时间", dataIndex: "createTime" },
    { title: "最近服务", dataIndex: "lastVisit" },
  ];

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
    </PageCard>
  );
}

