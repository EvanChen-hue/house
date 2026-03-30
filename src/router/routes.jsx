import {
  BarChartOutlined,
  TeamOutlined,
  SolutionOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Dashboard from "@/pages/Dashboard/index.jsx";
import Users from "@/pages/Users/index.jsx";
import Services from "@/pages/Services/index.jsx";
import Orders from "@/pages/Orders/index.jsx";

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
];
