import { useEffect, useState } from "react";
import {
  App,
  Button,
  Descriptions,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Upload,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import PageCard from "@/components/PageCard.jsx";
import PageHeader from "@/components/PageHeader.jsx";
import { contentApi } from "@/api/content.js";

const normalizeUpload = (event) => {
  if (Array.isArray(event)) return event;
  return event?.fileList || [];
};

function getUploadFile(fileList) {
  return fileList?.[0]?.originFileObj || null;
}

export default function Content() {
  const { message } = App.useApp();

  const [page, setPage] = useState({ current: 1, size: 10, total: 0 });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openCreateCategoryModal, setOpenCreateCategoryModal] = useState(false);
  const [createCategoryForm] = Form.useForm();
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [categoryForm] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  const [openPackageListModal, setOpenPackageListModal] = useState(false);
  const [packageRows, setPackageRows] = useState([]);
  const [packageLoading, setPackageLoading] = useState(false);
  const [packagePage, setPackagePage] = useState({ current: 1, size: 10, total: 0 });
  const [currentCategory, setCurrentCategory] = useState(null);
  const [openPackageFormModal, setOpenPackageFormModal] = useState(false);
  const [packageForm] = Form.useForm();
  const [openPackageDetailModal, setOpenPackageDetailModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [reviewRows, setReviewRows] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewPage, setReviewPage] = useState({ current: 1, size: 10, total: 0 });
  const [specRows, setSpecRows] = useState([]);
  const [specLoading, setSpecLoading] = useState(false);

  const loadCategories = async (nextCurrent = page.current, nextSize = page.size) => {
    try {
      setLoading(true);
      const res = await contentApi.listCategories({ current: nextCurrent, size: nextSize });
      setRows(res?.records || []);
      setPage((prev) => ({
        ...prev,
        current: Number(res?.current) || nextCurrent,
        size: Number(res?.size) || nextSize,
        total: Number(res?.total) || 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories(page.current, page.size);
  }, [page.current, page.size]);

  const handleOpenCreateCategory = () => {
    createCategoryForm.resetFields();
    setOpenCreateCategoryModal(true);
  };

  const handleOpenEditCategory = async (record) => {
    setEditingCategory(record);
    categoryForm.setFieldsValue({ category: record.name || record.category || "" });
    setOpenCategoryModal(true);
  };

  const loadPackages = async (
    category,
    nextCurrent = packagePage.current,
    nextSize = packagePage.size
  ) => {
    if (!category?.id) {
      setPackageRows([]);
      setPackagePage((prev) => ({ ...prev, total: 0 }));
      return;
    }

    try {
      setPackageLoading(true);
      const res = await contentApi.listPackages({
        categoryId: category.id,
        page: nextCurrent,
        pageSize: nextSize,
      });
      setPackageRows(res?.records || []);
      setPackagePage({
        current: Number(res?.current) || nextCurrent,
        size: Number(res?.size) || nextSize,
        total: Number(res?.total) || 0,
      });
    } finally {
      setPackageLoading(false);
    }
  };

  const loadReviews = async (pkg, nextCurrent = reviewPage.current, nextSize = reviewPage.size) => {
    if (!pkg?.id) {
      setReviewRows([]);
      return;
    }

    try {
      setReviewLoading(true);
      const res = await contentApi.listReviews({
        packageId: pkg.id,
        page: nextCurrent,
        pageSize: nextSize,
      });
      setReviewRows(res?.records || []);
      setReviewPage({
        current: Number(res?.current) || nextCurrent,
        size: Number(res?.size) || nextSize,
        total: Number(res?.total) || 0,
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const loadSpecs = async (pkg) => {
    if (!pkg?.id) {
      setSpecRows([]);
      return;
    }

    try {
      setSpecLoading(true);
      const list = await contentApi.listPackageSpecs(pkg.id);
      setSpecRows(list);
    } finally {
      setSpecLoading(false);
    }
  };

  const handleOpenPackageModal = async (record) => {
    setCurrentCategory(record);
    setOpenPackageListModal(true);
    setPackagePage({ current: 1, size: 10, total: 0 });
    await loadPackages(record, 1, 10);
  };

  const handleOpenCreatePackage = () => {
    packageForm.resetFields();
    setOpenPackageFormModal(true);
  };

  const handleOpenPackageDetail = async (record) => {
    setSelectedPackage(record);
    setOpenPackageDetailModal(true);
    setReviewPage({ current: 1, size: 10, total: 0 });
    await Promise.all([loadReviews(record, 1, 10), loadSpecs(record)]);
  };

  const handleRemoveCategory = async (record) => {
    await contentApi.removeCategory(record.id);
    message.success("大类删除成功");
    if (rows.length === 1 && page.current > 1) {
      setPage((prev) => ({ ...prev, current: prev.current - 1 }));
      return;
    }
    loadCategories(page.current, page.size);
  };

  const handleCreateCategory = async ({ name }) => {
    await contentApi.addCategory(name);
    message.success("大类添加成功");
    setOpenCreateCategoryModal(false);
    createCategoryForm.resetFields();

    if (page.current !== 1) {
      setPage((prev) => ({ ...prev, current: 1 }));
      return;
    }

    loadCategories(page.current, page.size);
  };

  const handleSaveCategory = async ({ category }) => {
    const categoryName = String(category || "").trim();
    if (!categoryName) {
      message.warning("请输入大类名称");
      return;
    }

    if (!editingCategory?.id) {
      message.warning("未找到待编辑的大类");
      return;
    }

    await contentApi.updateCategory({
      id: editingCategory.id,
      name: categoryName,
    });

    message.success("大类已更新");
    setOpenCategoryModal(false);
    setEditingCategory(null);
    categoryForm.resetFields();
    loadCategories(page.current, page.size);
  };

  const handleCreatePackage = async (values) => {
    if (!currentCategory?.id) {
      message.warning("未找到所属大类");
      return;
    }

    const posterFile = getUploadFile(values.posterFile);
    const detailFiles = getUploadFile(values.detailFiles);

    if (!posterFile || !detailFiles) {
      message.warning("请上传封面图和详情图");
      return;
    }

    await contentApi.addPackage({
      categoryId: currentCategory.id,
      posterFile,
      detailFiles,
      name: String(values.name || "").trim(),
      description: String(values.description || "").trim(),
      originalPrice: Number(values.originalPrice) || 0,
      price: Number(values.price) || 0,
      salesVolume: Number(values.salesVolume) || 0,
      serviceArea: String(values.serviceArea || "").trim(),
      status: 1,
    });

    message.success("套餐包添加成功");
    setOpenPackageFormModal(false);
    packageForm.resetFields();
    loadPackages(currentCategory, packagePage.current, packagePage.size);
  };

  const categoryColumns = [
    {
      title: "大类名称",
      dataIndex: "category",
      width: 580,
    },
    {
      title: "操作",
      key: "action",
      width: 260,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenEditCategory(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleOpenPackageModal(record)}>
            管理套餐包
          </Button>
          <Popconfirm
            title="确定删除这个大类吗？"
            okText="删除"
            cancelText="取消"
            onConfirm={() => handleRemoveCategory(record)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const packageColumns = [
    {
      title: "套餐包名称",
      dataIndex: "name",
      width: 220,
    },
    {
      title: "现价",
      dataIndex: "price",
      width: 120,
      render: (value) => `¥${Number(value) || 0}`,
    },
    {
      title: "原价",
      dataIndex: "originalPrice",
      width: 120,
      render: (value) => `¥${Number(value) || 0}`,
    },
    {
      title: "销量",
      dataIndex: "salesVolume",
      width: 100,
    },
    {
      title: "服务地区",
      dataIndex: "serviceArea",
      width: 180,
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => handleOpenPackageDetail(record)}>
          编辑
        </Button>
      ),
    },
  ];

  const reviewColumns = [
    {
      title: "访客名",
      dataIndex: "visitorName",
      width: 120,
    },
    {
      title: "评分",
      dataIndex: "rating",
      width: 80,
    },
    {
      title: "评论内容",
      dataIndex: "content",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 180,
    },
  ];

  const specColumns = [
    {
      title: "规格名称",
      dataIndex: "specName",
    },
    {
      title: "价格",
      dataIndex: "price",
      width: 140,
      render: (value) => `¥${Number(value) || 0}`,
    },
  ];

  return (
    <PageCard>
      <PageHeader
        title="内容管理"
        subtitle="当前页面仅维护大类名称"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreateCategory}>
            新增大类
          </Button>
        }
      />

      <Table
        rowKey="id"
        columns={categoryColumns}
        dataSource={rows}
        loading={loading}
        pagination={{
          current: page.current,
          pageSize: page.size,
          total: page.total,
          showSizeChanger: true,
          onChange: (current, pageSize) => setPage((prev) => ({ ...prev, current, size: pageSize })),
        }}
      />

      <Modal
        width={480}
        open={openCreateCategoryModal}
        title="新增大类"
        okText="保存"
        cancelText="取消"
        destroyOnClose
        onCancel={() => {
          setOpenCreateCategoryModal(false);
          createCategoryForm.resetFields();
        }}
        onOk={() => createCategoryForm.submit()}
      >
        <Form
          form={createCategoryForm}
          layout="vertical"
          onFinish={handleCreateCategory}
          onFinishFailed={() => message.warning("请输入大类名称")}
        >
          <Form.Item
            label="大类名称"
            name="name"
            rules={[
              { required: true, message: "请输入大类名称" },
              { whitespace: true, message: "请输入大类名称" },
            ]}
          >
            <Input placeholder="例如：热门推荐" maxLength={20} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        width={480}
        open={openCategoryModal}
        title="编辑大类"
        okText="保存"
        cancelText="取消"
        destroyOnClose
        onCancel={() => {
          setOpenCategoryModal(false);
          setEditingCategory(null);
          categoryForm.resetFields();
        }}
        onOk={() => categoryForm.submit()}
      >
        <Form form={categoryForm} layout="vertical" onFinish={handleSaveCategory}>
          <Form.Item
            label="大类名称"
            name="category"
            rules={[
              { required: true, message: "请输入大类名称" },
              { whitespace: true, message: "请输入大类名称" },
            ]}
          >
            <Input placeholder="例如：热门推荐" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        width={900}
        open={openPackageListModal}
        title={currentCategory ? `${currentCategory.category} - 管理套餐包` : "管理套餐包"}
        okButtonProps={{ style: { display: "none" } }}
        cancelText="关闭"
        onCancel={() => {
          setOpenPackageListModal(false);
          setCurrentCategory(null);
          setPackageRows([]);
          setPackagePage({ current: 1, size: 10, total: 0 });
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreatePackage}>
            添加套餐包
          </Button>
        </div>

        <Table
          rowKey="id"
          columns={packageColumns}
          dataSource={packageRows}
          loading={packageLoading}
          pagination={{
            current: packagePage.current,
            pageSize: packagePage.size,
            total: packagePage.total,
            showSizeChanger: true,
            onChange: (current, pageSize) => loadPackages(currentCategory, current, pageSize),
          }}
          locale={{ emptyText: "当前暂无套餐包" }}
        />
      </Modal>

      <Modal
        width={720}
        open={openPackageFormModal}
        title="添加套餐包"
        okText="保存"
        cancelText="取消"
        destroyOnClose
        onCancel={() => {
          setOpenPackageFormModal(false);
          packageForm.resetFields();
        }}
        onOk={() => packageForm.submit()}
      >
        <Form
          form={packageForm}
          layout="vertical"
          onFinish={handleCreatePackage}
          onFinishFailed={() => message.warning("请完善套餐包信息")}
        >
          <Form.Item
            label="套餐包名称"
            name="name"
            rules={[
              { required: true, message: "请输入套餐包名称" },
              { whitespace: true, message: "请输入套餐包名称" },
            ]}
          >
            <Input placeholder="例如：深度保洁套餐" maxLength={30} />
          </Form.Item>

          <Form.Item
            label="套餐描述"
            name="description"
            rules={[
              { required: true, message: "请输入套餐描述" },
              { whitespace: true, message: "请输入套餐描述" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="请填写套餐描述" maxLength={300} />
          </Form.Item>

          <Space style={{ width: "100%" }} size={16} align="start">
            <Form.Item
              label="原价"
              name="originalPrice"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "请输入原价" }]}
            >
              <InputNumber min={0} precision={2} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="现价"
              name="price"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "请输入现价" }]}
            >
              <InputNumber min={0} precision={2} style={{ width: "100%" }} />
            </Form.Item>
          </Space>

          <Space style={{ width: "100%" }} size={16} align="start">
            <Form.Item
              label="销量"
              name="salesVolume"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "请输入销量" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="服务地区"
              name="serviceArea"
              style={{ flex: 1 }}
              rules={[
                { required: true, message: "请输入服务地区" },
                { whitespace: true, message: "请输入服务地区" },
              ]}
            >
              <Input placeholder="例如：上海市全境" />
            </Form.Item>
          </Space>

          <Space style={{ width: "100%" }} size={16} align="start">
            <Form.Item
              label="封面图片"
              name="posterFile"
              valuePropName="fileList"
              getValueFromEvent={normalizeUpload}
              style={{ flex: 1 }}
              rules={[{ required: true, message: "请上传封面图片" }]}
            >
              <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>上传封面图</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="详情图片"
              name="detailFiles"
              valuePropName="fileList"
              getValueFromEvent={normalizeUpload}
              style={{ flex: 1 }}
              rules={[{ required: true, message: "请上传详情图片" }]}
            >
              <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>上传详情图</Button>
              </Upload>
            </Form.Item>
          </Space>
        </Form>
      </Modal>

      <Modal
        width={1000}
        open={openPackageDetailModal}
        title="编辑套餐包"
        okButtonProps={{ style: { display: "none" } }}
        cancelText="关闭"
        onCancel={() => {
          setOpenPackageDetailModal(false);
          setSelectedPackage(null);
          setReviewRows([]);
          setSpecRows([]);
          setReviewPage({ current: 1, size: 10, total: 0 });
        }}
      >
        <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
          <Descriptions.Item label="套餐名称">{selectedPackage?.name || "-"}</Descriptions.Item>
          <Descriptions.Item label="状态">{selectedPackage?.status ?? "-"}</Descriptions.Item>
          <Descriptions.Item label="原价">¥{Number(selectedPackage?.originalPrice) || 0}</Descriptions.Item>
          <Descriptions.Item label="现价">¥{Number(selectedPackage?.price) || 0}</Descriptions.Item>
          <Descriptions.Item label="销量">{selectedPackage?.salesVolume || 0}</Descriptions.Item>
          <Descriptions.Item label="服务地区">{selectedPackage?.serviceArea || "-"}</Descriptions.Item>
          <Descriptions.Item label="套餐描述" span={2}>
            {selectedPackage?.description || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="封面图片">
            {selectedPackage?.posterImage ? <Image width={120} src={selectedPackage.posterImage} /> : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="详情图片">
            {selectedPackage?.detailImage ? <Image width={120} src={selectedPackage.detailImage} /> : "-"}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ fontWeight: 600, marginBottom: 8 }}>评论管理</div>
        <Table
          rowKey="id"
          columns={reviewColumns}
          dataSource={reviewRows}
          loading={reviewLoading}
          pagination={{
            current: reviewPage.current,
            pageSize: reviewPage.size,
            total: reviewPage.total,
            onChange: (current, size) => loadReviews(selectedPackage, current, size),
          }}
          locale={{ emptyText: "暂无评论" }}
        />

        <div style={{ fontWeight: 600, margin: "16px 0 8px" }}>规格管理</div>
        <Table
          rowKey="id"
          columns={specColumns}
          dataSource={specRows}
          loading={specLoading}
          pagination={false}
          locale={{ emptyText: "暂无规格" }}
        />
      </Modal>
    </PageCard>
  );
}
