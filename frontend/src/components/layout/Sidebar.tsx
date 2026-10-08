import {
  Flex,
  Layout,
  Menu,
  Typography,
} from "antd";

import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  SettingOutlined,
  ShoppingOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

function Sidebar({ collapsed }: { collapsed: boolean }) {
  const mainItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
    {
      key: "products",
      label: "Products",
      icon: <AppstoreOutlined />,
    },
    {
      key: "orders",
      label: "Orders",
      icon: <ShoppingCartOutlined />,
    },
    {
      key: "users",
      label: "Users",
      icon: <TeamOutlined />,
    },
  ];

  const bottomItems = [
    {
      key: "help",
      label: "Help & Support",
      icon: <QuestionCircleOutlined />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
    },
  ];

  return (
    <Layout.Sider
      width={240}
      collapsed={collapsed}
      theme="light"
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <Flex
        vertical
        style={{
          height: "100%",
        }}
      >
        <Flex
          align="center"
          justify={collapsed ? "center" : "flex-start"}
          gap={12}
          style={{
            padding: "20px",
            flexShrink: 0,
          }}
        >
          <Flex
            align="center"
            justify="center"
            style={{
              width: 36,
              height: 36,
              background: "#1677ff",
              borderRadius: 8,
              color: "white",
            }}
          >
            <ShoppingOutlined />
          </Flex>

          {!collapsed && (
            <Typography.Text strong style={{ fontSize: 18 }}>
              ShopAdmin
            </Typography.Text>
          )}
        </Flex>

        <Menu
          mode="inline"
          items={mainItems}
          defaultSelectedKeys={["dashboard"]}
          style={{
            border: "none",
            flex: 1,
          }}
        />

        <Menu
          mode="inline"
          items={bottomItems}
          style={{
            border: "none",
            flexShrink: 0,
          }}
        />
      </Flex>
    </Layout.Sider>
  );
}

export default Sidebar;