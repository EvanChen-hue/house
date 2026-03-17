import { useEffect, useMemo, useState } from "react";
import { App, Avatar, Button, Space, Switch, Table, Tag } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import PageCard from "@/components/PageCard.jsx";
import PageHeader from "@/components/PageHeader.jsx";
import AuntieModal from "@/components/forms/AuntieModal.jsx";
import { auntiesApi } from "@/api/aunties";

const typeLabel = {
  1: "家政",
  2: "月嫂",
};

export default function Services() {
  const { message } = App.useApp();
  const [page, setPage] = useState({
    current: 1,
    size: 10,
    total: 0,
  });
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const getData = async () => {
    console.log(222);
    
    const res = await auntiesApi.list({ page: page.current, size: page.size });

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
    getData();
  }, [page.current, page.size]);

  const columns = useMemo(
    () => [
      {
        title: "阿姨",
        dataIndex: "name",
        render: (_, record) => (
          <Space>
            <Avatar size={46} src={'https://requests.taiyang.chat/' + record.avatar || undefined}>
              {record.name?.slice?.(0, 1) || "A"}
            </Avatar>
            <div>
              <div style={{ fontWeight: 650 }}>{record.name}</div>
              <div style={{ color: "rgba(15,23,42,0.55)" }}>{record.intro}</div>
            </div>
          </Space>
        ),
      },
      {
        title: "手机号",
        dataIndex: "phone",
      },
      {
        title: "价格",
        dataIndex: "price",
      },
      {
        title: "类型",
        dataIndex: "categoryName",
        render: (_, record) => (
          <Space>
            <Tag color="blue">{record.categoryName}</Tag>
          </Space>
        ),
      },
      {
        title: "是否上架",
        dataIndex: "active",
        render: (_, record) => (
          <Switch
            checked={record.active}
            onChange={async (checked) => {
              await auntiesApi.update(record.id, { active: checked });
              message.success(checked ? "已上架" : "已下架");
            }}
          />
        ),
      },
      {
        title: "操作",
        width: 120,
        render: (_, record) => (
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(record);
              console.log(record, 'editing');
              record.avatarFile = record.avatar
              setOpen(true);
            }}
          >
            编辑
          </Button>
        ),
      },
    ],
    [message]
  );

  return (
    <PageCard>
      <PageHeader
        title="服务管理"
        subtitle="支持上架开关与新增编辑弹窗"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            新增阿姨
          </Button>
        }
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
      <AuntieModal
        open={open}
        initialValue={editing}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
        }}
        onOk={async (values) => {
          console.log(values);
          console.log(editing);
          
          if (editing?.id) {
            await auntiesApi.put({ ...values, id: editing.id });
            message.success("已保存");
            setPage((prev) => ({ ...prev, current: 1 }));
          } else {
            await auntiesApi.add(values);
            message.success("已新增");
            setPage((prev) => ({ ...prev, current: 1 }));
          }
          setOpen(false);
          setEditing(null);
          // If we just created, jumping to page 1 will trigger reload via useEffect.
        }}
      />
    </PageCard>
  );
}
