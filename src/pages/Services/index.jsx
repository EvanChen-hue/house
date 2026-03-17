import { useEffect, useMemo, useState } from "react";
import { App, Avatar, Button, Space, Switch, Table, Tag } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import PageCard from "@/components/PageCard.jsx";
import PageHeader from "@/components/PageHeader.jsx";
import AuntieModal from "@/components/forms/AuntieModal.jsx";
import { auntiesApi } from "@/api/index.js";

const typeLabel = {
  domestic: "学习测试阿姨",
  maternity: "月嫂",
};

export default function Services() {
  const { message } = App.useApp();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const reload = async () => {
    setRows(await auntiesApi.list());
  };

  useEffect(() => {
    reload();
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "阿姨",
        dataIndex: "name",
        render: (_, record) => (
          <Space>
            <Avatar size={46} src={record.photo || undefined}>
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
        title: "类型",
        dataIndex: "type",
        render: (value) => (
          <Tag color={value === "maternity" ? "magenta" : "blue"}>
            {typeLabel[value]}
          </Tag>
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
              reload();
            }}
          />
        ),
      },
      {
        title: "操作",
        render: (_, record) => (
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(record);
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
        subtitle="两类服务人员：学习测试阿姨 / 月嫂，支持上架开关与新增编辑弹窗"
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
      <Table columns={columns} dataSource={rows} rowKey="id" pagination={false} />
      <AuntieModal
        open={open}
        initialValue={editing}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
        }}
        onOk={async (values) => {
          if (editing?.id) {
            await auntiesApi.update(editing.id, values);
            message.success("已保存");
          } else {
            await auntiesApi.create(values);
            message.success("已新增");
          }
          setOpen(false);
          setEditing(null);
          reload();
        }}
      />
    </PageCard>
  );
}
