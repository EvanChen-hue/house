import { useEffect, useMemo, useState } from "react";
import {
  App,
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Rate,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import PageCard from "@/components/PageCard.jsx";
import PageHeader from "@/components/PageHeader.jsx";
import { contentApi } from "@/api/content.js";

const AREA_OPTIONS = [
  "顺庆区",
  "高坪区",
  "嘉陵区",
  "南部县",
  "营山县",
  "蓬安县",
  "仪陇县",
  "西充县",
  "阆中市",
].map((name) => ({ label: name, value: name }));

const normalizeUpload = (event) => {
  if (Array.isArray(event)) return event;
  return event?.fileList || [];
};

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

async function getUploadUrl(fileItem) {
  if (!fileItem) return "";
  if (fileItem.url) return fileItem.url;
  if (fileItem.originFileObj) return fileToDataUrl(fileItem.originFileObj);
  return "";
}

function toUploadList(url, uidPrefix) {
  if (!url) return [];
  return [{ uid: `${uidPrefix}-1`, name: `${uidPrefix}.png`, status: "done", url }];
}

function makeEmptyPackage() {
  return {
    name: "",
    sales: 0,
    intro: "",
    posterFileList: [],
    detailFileList: [],
    comments: [{ star: 5, content: "" }],
    regions: [],
    originalPrice: 0,
    discountPrice: 0,
    specs: [{ name: "", price: 0 }],
  };
}

export default function Content() {
  const { message } = App.useApp();

  const [page, setPage] = useState({ current: 1, size: 10, total: 0 });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [categoryForm] = Form.useForm();
  const [categoryOriginalName, setCategoryOriginalName] = useState("");
  const [categoryPackages, setCategoryPackages] = useState([]);
  const [categoryPackagePage, setCategoryPackagePage] = useState({ current: 1, size: 5 });

  const [openPackageModal, setOpenPackageModal] = useState(false);
  const [packageForm] = Form.useForm();
  const [editingPackageId, setEditingPackageId] = useState(null);

  const categoryPackageRows = useMemo(() => {
    const start = (categoryPackagePage.current - 1) * categoryPackagePage.size;
    return categoryPackages.slice(start, start + categoryPackagePage.size);
  }, [categoryPackages, categoryPackagePage.current, categoryPackagePage.size]);

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
    setCategoryOriginalName("");
    setCategoryPackages([]);
    setCategoryPackagePage({ current: 1, size: 5 });
    categoryForm.setFieldsValue({ category: "" });
    setOpenCategoryModal(true);
  };

  const handleOpenEditCategory = async (record) => {
    const detail = await contentApi.getCategoryDetail(record.category);
    setCategoryOriginalName(record.category);
    setCategoryPackages(detail?.packages || []);
    setCategoryPackagePage({ current: 1, size: 5 });
    categoryForm.setFieldsValue({ category: record.category });
    setOpenCategoryModal(true);
  };

  const handleRemoveCategory = async (record) => {
    await contentApi.removeCategory(record.category);
    message.success("大类删除成功");
    if (rows.length === 1 && page.current > 1) {
      setPage((prev) => ({ ...prev, current: prev.current - 1 }));
      return;
    }
    loadCategories(page.current, page.size);
  };

  const openCreatePackage = () => {
    setEditingPackageId(null);
    packageForm.setFieldsValue(makeEmptyPackage());
    setOpenPackageModal(true);
  };

  const openEditPackage = (record) => {
    setEditingPackageId(record.id);
    packageForm.setFieldsValue({
      name: record.name,
      sales: record.sales,
      intro: record.intro,
      posterFileList: toUploadList(record.posterImage, "poster"),
      detailFileList: toUploadList(record.detailImage, "detail"),
      comments: (record.comments || []).length ? record.comments : [{ star: 5, content: "" }],
      regions: record.regions || [],
      originalPrice: record.originalPrice,
      discountPrice: record.discountPrice,
      specs: (record.specs || []).length ? record.specs : [{ name: "", price: 0 }],
    });
    setOpenPackageModal(true);
  };

  const handleSavePackage = async (values) => {
    const posterImage = await getUploadUrl(values.posterFileList?.[0]);
    const detailImage = await getUploadUrl(values.detailFileList?.[0]);

    const payload = {
      id: editingPackageId || `tmp-${Date.now()}`,
      name: values.name,
      sales: Number(values.sales) || 0,
      intro: values.intro,
      posterImage,
      detailImage,
      comments: (values.comments || []).map((item) => ({
        star: Number(item.star) || 5,
        content: item.content,
      })),
      regions: values.regions || [],
      originalPrice: Number(values.originalPrice) || 0,
      discountPrice: Number(values.discountPrice) || 0,
      specs: (values.specs || []).map((item) => ({
        name: item.name,
        price: Number(item.price) || 0,
      })),
    };

    setCategoryPackages((prev) => {
      if (!editingPackageId) return [payload, ...prev];
      return prev.map((item) => (item.id === editingPackageId ? { ...item, ...payload } : item));
    });

    setOpenPackageModal(false);
    setEditingPackageId(null);
    message.success(editingPackageId ? "套餐包已更新" : "套餐包已新增");
  };

  const handleRemovePackage = (record) => {
    setCategoryPackages((prev) => prev.filter((item) => item.id !== record.id));
    message.success("套餐包已删除");
  };

  const handleSaveCategory = async ({ category }) => {
    const categoryName = String(category || "").trim();
    if (!categoryName) {
      message.warning("请输入大类名称");
      return;
    }
    if (!categoryPackages.length) {
      message.warning("请至少添加一个套餐包");
      return;
    }

    await contentApi.saveCategory({
      originalCategory: categoryOriginalName,
      category: categoryName,
      packages: categoryPackages,
    });

    message.success(categoryOriginalName ? "大类已更新" : "大类已创建");
    setOpenCategoryModal(false);
    setCategoryOriginalName("");
    setCategoryPackages([]);

    if (!categoryOriginalName && page.current !== 1) {
      setPage((prev) => ({ ...prev, current: 1 }));
      return;
    }
    loadCategories(page.current, page.size);
  };

  const categoryColumns = [
    {
      title: "大类名称",
      dataIndex: "category",
      width: 220,
    },
    {
      title: "套餐包数量",
      dataIndex: "packageCount",
      width: 120,
      render: (value) => `${value || 0} 个`,
    },
    {
      title: "总销量",
      dataIndex: "totalSales",
      width: 120,
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenEditCategory(record)}>
            编辑
          </Button>
          <Popconfirm
            title="删除大类后，下面所有套餐包都会删除，确定继续吗？"
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
      title: "套餐",
      dataIndex: "name",
      width: 240,
      render: (_, record) => (
        <Space>
          <Image width={64} height={40} src={record.posterImage} fallback="" style={{ objectFit: "cover" }} />
          <div>
            <div style={{ fontWeight: 600 }}>{record.name || "-"}</div>
            <div style={{ color: "rgba(15,23,42,0.55)" }}>{record.intro || "-"}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "销量",
      dataIndex: "sales",
      width: 80,
    },
    {
      title: "服务地区",
      dataIndex: "regions",
      width: 220,
      render: (regions) => (
        <Space wrap>
          {(regions || []).map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "价格",
      width: 150,
      render: (_, record) => (
        <div>
          <div>原价: ¥{record.originalPrice || 0}</div>
          <div style={{ color: "#cf1322" }}>优惠: ¥{record.discountPrice || 0}</div>
        </div>
      ),
    },
    {
      title: "规格",
      dataIndex: "specs",
      width: 80,
      render: (specs) => `${specs?.length || 0} 条`,
    },
    {
      title: "评论",
      dataIndex: "comments",
      width: 80,
      render: (comments) => `${comments?.length || 0} 条`,
    },
    {
      title: "操作",
      key: "action",
      width: 160,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditPackage(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个套餐包吗？"
            okText="删除"
            cancelText="取消"
            onConfirm={() => handleRemovePackage(record)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageCard>
      <PageHeader
        title="内容管理"
        subtitle="列表仅显示大类，编辑大类时维护其下全部套餐包"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreateCategory}>
            新增大类
          </Button>
        }
      />

      <Table
        rowKey="category"
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
        width={1100}
        open={openCategoryModal}
        title={categoryOriginalName ? "编辑大类" : "新增大类"}
        okText="保存大类"
        cancelText="取消"
        onCancel={() => {
          setOpenCategoryModal(false);
          setCategoryOriginalName("");
          setCategoryPackages([]);
        }}
        onOk={() => categoryForm.submit()}
      >
        <Form form={categoryForm} layout="vertical" onFinish={handleSaveCategory}>
          <Form.Item
            label="大类名称"
            name="category"
            rules={[{ required: true, message: "请输入大类名称" }]}
          >
            <Input placeholder="例如：热门推荐" />
          </Form.Item>
        </Form>

        <div style={{ marginBottom: 12 }}>
          <Button type="dashed" icon={<PlusOutlined />} onClick={openCreatePackage}>
            新增套餐包
          </Button>
        </div>

        <Table
          rowKey="id"
          columns={packageColumns}
          dataSource={categoryPackageRows}
          locale={{ emptyText: "当前大类还没有套餐包，请先新增" }}
          scroll={{ x: 1100 }}
          pagination={{
            current: categoryPackagePage.current,
            pageSize: categoryPackagePage.size,
            total: categoryPackages.length,
            showSizeChanger: true,
            onChange: (current, size) => setCategoryPackagePage({ current, size }),
          }}
        />
      </Modal>

      <Modal
        width={900}
        open={openPackageModal}
        title={editingPackageId ? "编辑套餐包" : "新增套餐包"}
        okText="保存套餐包"
        cancelText="取消"
        destroyOnClose
        onCancel={() => {
          setOpenPackageModal(false);
          setEditingPackageId(null);
        }}
        onOk={() => packageForm.submit()}
      >
        <Form
          form={packageForm}
          layout="vertical"
          onFinish={handleSavePackage}
          onFinishFailed={() => message.warning("请先完善套餐包必填项")}
          initialValues={makeEmptyPackage()}
        >
          <Space size={16} style={{ width: "100%" }} align="start">
            <Form.Item
              label="套餐包名称"
              name="name"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "请输入套餐包名称" }]}
            >
              <Input placeholder="例如：深度清洁" />
            </Form.Item>
            <Form.Item
              label="销量"
              name="sales"
              style={{ width: 160 }}
              rules={[{ required: true, message: "请输入销量" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Space>

          <Form.Item label="简介" name="intro" rules={[{ required: true, message: "请输入简介" }]}>
            <Input.TextArea rows={3} placeholder="请填写套餐包简介" />
          </Form.Item>

          <Space size={16} style={{ width: "100%" }} align="start">
            <Form.Item
              label="海报图片"
              name="posterFileList"
              valuePropName="fileList"
              getValueFromEvent={normalizeUpload}
              style={{ flex: 1 }}
              rules={[{ required: true, message: "请上传海报图片" }]}
            >
              <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>上传海报</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="详情图片（仅1张）"
              name="detailFileList"
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

          <Form.Item
            label="服务地区（南充三区六县）"
            name="regions"
            rules={[{ required: true, message: "请选择服务地区" }]}
          >
            <Select mode="multiple" options={AREA_OPTIONS} maxTagCount="responsive" />
          </Form.Item>

          <Space size={16} style={{ width: "100%" }} align="start">
            <Form.Item
              label="原价"
              name="originalPrice"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "请输入原价" }]}
            >
              <InputNumber min={0} precision={2} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="优惠价"
              name="discountPrice"
              style={{ flex: 1 }}
              rules={[
                { required: true, message: "请输入优惠价" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const originalPrice = getFieldValue("originalPrice");
                    if (value === undefined || value === null) return Promise.resolve();
                    if (Number(value) <= Number(originalPrice || 0)) return Promise.resolve();
                    return Promise.reject(new Error("优惠价不能高于原价"));
                  },
                }),
              ]}
            >
              <InputNumber min={0} precision={2} style={{ width: "100%" }} />
            </Form.Item>
          </Space>

          <Form.List
            name="specs"
            rules={[
              {
                validator: async (_, value) => {
                  if (Array.isArray(value) && value.length > 0) return;
                  throw new Error("请至少添加一条服务规格");
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <div>
                <div style={{ marginBottom: 8, fontWeight: 600 }}>服务规格</div>
                {fields.map((field) => (
                  <Space key={field.key} style={{ display: "flex", marginBottom: 8 }} align="start">
                    <Form.Item
                      {...field}
                      label="规格名称"
                      name={[field.name, "name"]}
                      rules={[{ required: true, message: "请输入规格名称" }]}
                    >
                      <Input placeholder="例如：4小时" style={{ width: 260 }} />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="价格"
                      name={[field.name, "price"]}
                      rules={[{ required: true, message: "请输入价格" }]}
                    >
                      <InputNumber min={0} precision={2} style={{ width: 180 }} />
                    </Form.Item>
                    <Button danger style={{ marginTop: 30 }} onClick={() => remove(field.name)}>
                      删除
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ name: "", price: 0 })}>
                  新增服务规格
                </Button>
                <Form.ErrorList errors={errors} />
              </div>
            )}
          </Form.List>

          <Form.List
            name="comments"
            rules={[
              {
                validator: async (_, value) => {
                  if (Array.isArray(value) && value.length > 0) return;
                  throw new Error("请至少添加一条假评论");
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <div style={{ marginTop: 20 }}>
                <div style={{ marginBottom: 8, fontWeight: 600 }}>假评论</div>
                {fields.map((field) => (
                  <Space key={field.key} style={{ display: "flex", marginBottom: 8 }} align="start">
                    <Form.Item
                      {...field}
                      label="星级"
                      name={[field.name, "star"]}
                      rules={[{ required: true, message: "请选择星级" }]}
                    >
                      <Rate />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="评论内容"
                      name={[field.name, "content"]}
                      rules={[{ required: true, message: "请输入评论内容" }]}
                    >
                      <Input placeholder="请输入评论内容" style={{ width: 360 }} />
                    </Form.Item>
                    <Button danger style={{ marginTop: 30 }} onClick={() => remove(field.name)}>
                      删除
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ star: 5, content: "" })}>
                  新增评论
                </Button>
                <Form.ErrorList errors={errors} />
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </PageCard>
  );
}
