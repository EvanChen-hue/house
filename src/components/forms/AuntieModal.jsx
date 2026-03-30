import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, Upload, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const typeOptions = [
  { value: "1", label: "月嫂" },
  { value: "2", label: "保洁" },
  { value: "3", label: "家政" },
];

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function AuntieModal({ open, initialValue, onCancel, onOk }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (!open) return;
    console.log(initialValue, '1313131');
    
    form.setFieldsValue({
      name: initialValue?.name ?? "",
      categoryId: initialValue?.categoryId ?? "1",
      intro: initialValue?.intro ?? "",
      price: initialValue?.price ?? "",
      avatarFile: 'https://requests.taiyang.chat/' + (initialValue?.avatar || ""),
      phone: initialValue?.phone ?? "",
      age: initialValue?.age ?? ""
    });
    setFileList(
      initialValue?.avatarFile
        ? [{ uid: "photo", name: "photo", status: "done", url:'https://requests.taiyang.chat' + initialValue.avatarFile }]
        : []
    );
  }, [open, initialValue, form]);

  return (
    <Modal
      title={initialValue?.id ? "编辑阿姨" : "新增阿姨"}
      open={open}
      onCancel={onCancel}
      okText="保存"
      cancelText="取消"
      onOk={async () => {
        const values = await form.validateFields();
        console.log(values, 'values');
        
        onOk(values);
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: "请输入姓名" }]}
        >
          <Input placeholder="例如：王阿姨" />
        </Form.Item>
        <Form.Item
          label="类型"
          name="categoryId"
          rules={[{ required: true, message: "请选择类型" }]}
        >
          <Select options={typeOptions} />
        </Form.Item>
        <Form.Item
          label="简介"
          name="intro"
          rules={[{ required: true, message: "请输入简介" }]}
        >
          <Input.TextArea rows={3} placeholder="经验、擅长项目等" />
        </Form.Item>
        <Form.Item
          label="电话"
          name="phone"
          rules={[{ required: true, message: "请输入电话" }]}
        >
          <Input.TextArea rows={1} placeholder="联系方式" />
        </Form.Item>
        <Form.Item
          label="年龄"
          name="age"
          rules={[{ required: true, message: "请输入年龄" }]}
        >
          <Input.TextArea rows={1} placeholder="年龄" />
        </Form.Item>
        <Form.Item
          label="价格"
          name="price"
          rules={[{ required: true, message: "请输入价格" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="单次服务价格"
            min={0}
            precision={2} // 保留2位小数（可选）
          />
        </Form.Item>
        <Form.Item label="照片" name="avatarFile" rules={[{ required: true, message: "请上传照片" }]}>
          <Upload
            listType="picture"
            maxCount={1}
            fileList={fileList}
            beforeUpload={async (file) => {
              const url = await toBase64(file);
              setFileList([{ uid: file.uid, name: file.name, status: "done", url }]);
              form.setFieldValue("photo", url);
              return false;
            }}
            onRemove={() => {
              setFileList([]);
              form.setFieldValue("photo", "");
            }}
          >
            <Button icon={<UploadOutlined />}>上传照片</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}

