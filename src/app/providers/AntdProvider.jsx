import { ConfigProvider, App as AntdApp, theme } from "antd";

export default function AntdProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1e6fff",
          colorInfo: "#1e6fff",
          colorSuccess: "#20c997",
          colorWarning: "#ffb020",
          borderRadius: 12,
          fontFamily:
            "MiSans, HarmonyOS Sans, PingFang SC, Microsoft YaHei, Segoe UI Variable Text, Segoe UI, system-ui, sans-serif",
          boxShadowSecondary: "0 20px 60px rgba(15, 23, 42, 0.10)",
        },
        components: {
          Layout: {
            headerBg: "#ffffff",
            siderBg: "#ffffff",
          },
          Menu: {
            itemBorderRadius: 12,
            itemHeight: 44,
          },
          Button: {
            controlHeight: 40,
          },
          Table: {
            headerBg: "#f6f9ff",
            headerColor: "#0f172a",
            rowHoverBg: "#f7fbff",
          },
        },
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}

