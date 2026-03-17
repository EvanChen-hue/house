import { useMemo, useState } from "react";
import {
  App,
  AutoComplete,
  Button,
  Checkbox,
  Form,
  Input,
  Space,
  Typography,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "@/api/index.js";
import { getLoginCreds, saveLoginCred, setToken } from "@/utils/storage.js";
import logoUrl from "@/assets/images/logo.svg";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();

  const from = useMemo(() => location.state?.from ?? "/", [location.state]);

  const credOptions = useMemo(() => {
    const items = getLoginCreds();
    return items.map((c) => ({
      value: c.account,
      label: (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{c.account}</span>
          <span style={{ color: "rgba(15,23,42,0.45)", fontSize: 12 }}>
            {c.rememberPassword ? "已记住密码" : "仅账号"}
          </span>
        </div>
      ),
      _cred: c,
    }));
  }, []);

  return (
    <div className="hk-login">
      <div className="hk-loginPanel">
        <div className="hk-loginHead">
          <img className="hk-loginLogo" src={logoUrl} alt="logo" />
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>
              学习测试小程序管理后台
            </Typography.Title>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{ rememberPassword: true }}
          onFinish={async (values) => {
            try {
              setLoading(true);
              const { token } = await authApi.login(
                values.account,
                values.password
              );
              setToken(token);
              saveLoginCred(values.account, values.password, {
                rememberPassword: values.rememberPassword,
              });
              message.success("登录成功");
              navigate(from, { replace: true });
            } catch (e) {
              message.error(e?.message || "登录失败");
            } finally {
              setLoading(false);
            }
          }}
        >
          <Form.Item
            label="账号"
            name="account"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <AutoComplete
              options={credOptions}
              placeholder="admin / 手机号"
              onSelect={(value, option) => {
                const cred = option?._cred;
                form.setFieldsValue({
                  account: value,
                  password: cred?.password || "",
                  rememberPassword:
                    typeof cred?.rememberPassword === "boolean"
                      ? cred.rememberPassword
                      : true,
                });
              }}
            >
              <Input autoComplete="username" />
            </AutoComplete>
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item
            name="rememberPassword"
            valuePropName="checked"
            style={{ marginBottom: 10 }}
          >
            <Checkbox>记住密码（保存在本机浏览器）</Checkbox>
          </Form.Item>

          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              登录
            </Button>
          </Space>
        </Form>
      </div>
    </div>
  );
}

