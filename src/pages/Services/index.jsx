import { useEffect, useMemo, useState } from "react";
import { App, Avatar, Button, Popconfirm, Space, Switch, Table, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PageCard from "@/components/PageCard.jsx";
import PageHeader from "@/components/PageHeader.jsx";
import AuntieModal from "@/components/forms/AuntieModal.jsx";
import { auntiesApi } from "@/api/aunties";

const typeLabel = {
  1: "家政",
  2: "月嫂",
};

const truncateText = (text, max = 40) => {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}...` : text;
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
  const [deletingId, setDeletingId] = useState(null);

  const getData = async () => {

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

  const handleDelete = async (record) => {
    try {
      setDeletingId(record.id);
      await auntiesApi.delete(record.id);
      message.success("删除成功");

      if (rows.length === 1 && page.current > 1) {
        setPage((prev) => ({ ...prev, current: prev.current - 1 }));
        return;
      }

      await getData();
    } catch (error) {
      console.error("Delete worker error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "阿姨",
        maxWidth: 300,
        width: 300,
        dataIndex: "name",
        render: (_, record) => (
          <Space width={200}>
            <Avatar size={46} src={'https://requests.taiyang.chat/' + record.avatar || undefined}>
              {record.name?.slice?.(0, 1) || "A"}
            </Avatar>
            <div>
              <div style={{ fontWeight: 650 }}>{record.name}</div>
              <div style={{ color: "rgba(15,23,42,0.55)" }}>{truncateText(record.intro, 40)}</div>
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
            checked={record.status}
            onChange={async (checked) => {
              await auntiesApi.update(record.id, checked ? 1 : 0 );
              message.success(checked ? "已上架" : "已下架");
              getData();
            }}
          />
        ),
      },
      {
        title: "操作",
        width: 160,
        render: (_, record) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                record.avatarFile = record.avatar
                setEditing(record);
                console.log(record, 'editing');
                setOpen(true);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确认删除该阿姨吗？"
              okText="删除"
              cancelText="取消"
              onConfirm={() => handleDelete(record)}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                loading={deletingId === record.id}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [message, page, deletingId, handleDelete]
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
          getData();
          // If we just created, jumping to page 1 will trigger reload via useEffect.
        }}
      />
    </PageCard>
  );
}

