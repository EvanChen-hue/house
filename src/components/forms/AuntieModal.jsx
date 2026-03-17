import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const typeOptions = [
  { value: "domestic", label: "学习测试阿姨" },
  { value: "maternity", label: "月嫂" },
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
    form.setFieldsValue({
      name: initialValue?.name ?? "",
      type: initialValue?.type ?? "domestic",
      intro: initialValue?.intro ?? "",
      photo: initialValue?.photo ?? "",
    });
    setFileList(
      initialValue?.photo
        ? [{ uid: "photo", name: "photo", status: "done", url: initialValue.photo }]
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
          name="type"
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
        <Form.Item label="照片" name="photo">
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

