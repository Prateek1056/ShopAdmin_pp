import { useState } from "react";
import { Layout } from "antd";
import { ConfigProvider, theme } from "antd";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "../pages/Dashboard";

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

          <Layout.Content
            style={{
              padding: 16,
            }}
          >
            <Dashboard />
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default DashboardLayout;
