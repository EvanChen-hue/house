import {
  BarChartOutlined,
  TeamOutlined,
  SolutionOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import Dashboard from "@/pages/Dashboard/index.jsx";
import Users from "@/pages/Users/index.jsx";
import Services from "@/pages/Services/index.jsx";
import Orders from "@/pages/Orders/index.jsx";
import Content from "@/pages/Content/index.jsx";

export const nav = [
  {
    key: "dashboard",
    path: "/",
    label: "首页统计",
    icon: <BarChartOutlined />,
  },
  {
    key: "users",
    path: "/users",
    label: "用户管理",
    icon: <TeamOutlined />,
  },
  {
    key: "services",
    path: "/services",
    label: "服务管理",
    icon: <SolutionOutlined />,
  },
  {
    key: "orders",
    path: "/orders",
    label: "订单管理",
    icon: <ShoppingCartOutlined />,
  },
  {
    key: "content",
    path: "/content",
    label: "内容管理",
    icon: <AppstoreOutlined />,
  },
];

export const routes = [
  { index: true, element: <Dashboard />, title: "首页统计", fullPath: "/" },
  { path: "users", element: <Users />, title: "用户管理", fullPath: "/users" },
  {
    path: "services",
    element: <Services />,
    title: "服务管理",
    fullPath: "/services",
  },
  {
    path: "orders",
    element: <Orders />,
    title: "订单管理",
    fullPath: "/orders",
  },
  {
    path: "content",
    element: <Content />,
    title: "内容管理",
    fullPath: "/content",
  },
];

