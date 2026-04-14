import { Layout, Menu, Button, Typography, Avatar, Space, Breadcrumb } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { nav, routes } from "@/router/routes.jsx";
import { clearToken } from "@/utils/storage.js";
import logoUrl from "@/assets/images/logo.svg";

const { Header, Sider, Content } = Layout;

function findTitle(pathname) {
  const match = routes.find((r) => r.fullPath === pathname);
  return match?.title ?? "管理后台";
}

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = findTitle(location.pathname);

  return (
    <Layout className="hk-shell">
      <Sider
        width={252}
        className="hk-sider"
        breakpoint="lg"
        collapsedWidth={84}
      >
        <div className="hk-brand" onClick={() => navigate("/")}>
          <img className="hk-logo" src={logoUrl} alt="logo" />
          <div className="hk-brandText">
            <div className="hk-brandTitle">测试后台</div>
            <div className="hk-brandSub">Housekeeping Admin</div>
          </div>
        </div>
        <Menu
          mode="inline"
          className="hk-menu"
          items={nav.map((n) => ({
            key: n.path,
            label: n.label,
            icon: n.icon,
          }))}
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="hk-header">
          <div className="hk-headerLeft">
            <Breadcrumb
              items={[
                { title: "控制台" },
                { title: title },
              ]}
            />
            <Typography.Title level={4} className="hk-headerTitle">
              {title}
            </Typography.Title>
          </div>
          <Space size={12}>
            <Space size={10} className="hk-profile">
              <Avatar style={{ background: "#1e6fff" }}>A</Avatar>
              <div className="hk-profileText">
                <div className="hk-profileName">Admin</div>
                <div className="hk-profileMeta">运营管理</div>
              </div>
            </Space>
            <Button
              icon={<LogoutOutlined />}
              onClick={() => {
                clearToken();
                navigate("/login");
              }}
            >
              退出
            </Button>
          </Space>
        </Header>
        <Content className="hk-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
