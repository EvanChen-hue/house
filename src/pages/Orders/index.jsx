import { useEffect, useState } from "react";
import { App, Button, Input, Popconfirm, Space, Table, Tag } from "antd";
import PageCard from "@/components/PageCard.jsx";
import PageHeader from "@/components/PageHeader.jsx";
import { ordersApi } from "@/api/index.js";

const payStatusMap = {
  0: { label: "未支付", color: "default" },
  1: { label: "已支付", color: "green" },
  2: { label: "已退款", color: "blue" },
  5: { label: "已取消", color: "red" },
  6: { label: "退款中", color: "orange" },
};

const orderStatusMap = {
  1: { label: "待付款", color: "gold" },
  2: { label: "待服务", color: "blue" },
  3: { label: "服务中", color: "processing" },
  4: { label: "已完成", color: "green" },
  5: { label: "已取消", color: "red" },
  6: { label: "退款中", color: "orange" },
};

const defaultStatusTag = { label: "未知", color: "default" };

const payTypeMap = {
  0: "未知",
  1: "微信",
  2: "支付宝",
  3: "余额",
};

const truncateText = (text, max = 40) => {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}...` : text;
};

export default function Orders() {
  const { message } = App.useApp();
  const [page, setPage] = useState({
    current: 1,
    size: 10,
    total: 0,
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [orderNoInput, setOrderNoInput] = useState("");
  const [orderNo, setOrderNo] = useState("");

  const fetchOrders = async (
    nextPage = page.current,
    nextSize = page.size,
    nextOrderNo = orderNo
  ) => {
    try {
      setLoading(true);
      const res = await ordersApi.list({
        current: nextPage,
        size: nextSize,
        orderNo: nextOrderNo.trim(),
      });

      // Handle array response (backward compatibility)
      if (Array.isArray(res)) {
        setRows(res || []);
        setPage((prev) => ({ ...prev, total: res.length }));
        return;
      }

      // Handle object response with pagination
      setRows(res?.records || []);
      setPage((prev) => ({
        ...prev,
        current: Number(res?.current) || nextPage,
        size: Number(res?.size) || nextSize,
        total: Number(res?.total) || 0,
      }));
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (record) => {
    try {
      setRemovingId(record.id);
      await ordersApi.remove(record.id);
      message.success("删除成功");

      if (rows.length === 1 && page.current > 1) {
        setPage((prev) => ({ ...prev, current: prev.current - 1 }));
        return;
      }

      await fetchOrders(page.current, page.size, orderNo);
    } catch (error) {
      console.error("Remove order error:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleSearch = () => {
    const nextOrderNo = orderNoInput.trim();
    setOrderNo(nextOrderNo);

    if (page.current !== 1) {
      setPage((prev) => ({ ...prev, current: 1 }));
      return;
    }

    fetchOrders(1, page.size, nextOrderNo);
  };

  const handleReset = () => {
    setOrderNoInput("");
    setOrderNo("");

    if (page.current !== 1) {
      setPage((prev) => ({ ...prev, current: 1 }));
      return;
    }

    fetchOrders(1, page.size, "");
  };

  useEffect(() => {
    fetchOrders(page.current, page.size, orderNo);
  }, [page.current, page.size, orderNo]);

  const columns = [
    {
      title: "订单号",
      dataIndex: "orderNo",
      width: 150,
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      title: "客户",
      dataIndex: "username",
      width: 120,
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      width: 120,
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      title: "服务地址",
      dataIndex: "fullAddress",
      ellipsis: true,
      width: 220,
      render: (text) => <span title={text}>{truncateText(text)}</span>,
    },
    {
      title: "订单备注",
      dataIndex: "remark",
      ellipsis: true,
      width: 220,
      render: (text) => <span title={text}>{truncateText(text)}</span>,
    },
    {
      title: "服务日期",
      dataIndex: "serviceStartDate",
      width: 110,
      render: (text) => <span>{text ? text.split(" ")[0] : "-"}</span>,
    },
    {
      title: "金额",
      dataIndex: "totalAmount",
      width: 100,
      align: "right",
      render: (amount) => <span>¥ {amount || 0}</span>,
    },
    {
      title: "支付状态",
      dataIndex: "payStatus",
      width: 100,
      render: (status) => {
        const info = payStatusMap[status] || defaultStatusTag;
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: "订单状态",
      dataIndex: "status",
      width: 100,
      render: (status) => {
        const info = orderStatusMap[status] || defaultStatusTag;
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: "支付方式",
      dataIndex: "payType",
      width: 100,
      render: (type) => <span>{payTypeMap[type] || "未知"}</span>,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 160,
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      title: "操作",
      dataIndex: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Popconfirm
          title="确认删除该订单吗？"
          description="删除后无法恢复。"
          okText="删除"
          cancelText="取消"
          onConfirm={() => handleRemove(record)}
        >
          <Button
            type="link"
            danger
            loading={removingId === record.id}
          >
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <PageCard>
      <PageHeader
        title="订单管理"
        subtitle="查看和管理所有订单信息"
        extra={
          <Space>
            <Input
              allowClear
              value={orderNoInput}
              placeholder="请输入订单号"
              style={{ width: 240 }}
              onChange={(event) => setOrderNoInput(event.target.value)}
              onPressEnter={handleSearch}
            />
            <Button type="primary" onClick={handleSearch}>
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        }
      />
      <Table
        columns={columns}
        dataSource={rows}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1600 }}
        pagination={{
          current: page.current,
          pageSize: page.size,
          total: page.total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
          onChange: (current, pageSize) =>
            setPage((prev) => ({ ...prev, current, size: pageSize })),
        }}
      />
    </PageCard>
  );
}
