
import { useState } from "react";
import { Layout, ConfigProvider, theme } from "antd";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar collapsed={collapsed} />

        <Layout>
          <Header
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            isDark={isDark}
            setIsDark={setIsDark}
          />

          <Layout.Content style={{ padding: 16 }}>
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default DashboardLayout;
