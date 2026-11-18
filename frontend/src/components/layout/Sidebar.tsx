
import {
  Flex,
  Layout,
  Menu,
  Typography,
} from "antd";

import type { MenuProps } from "antd";

import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  SettingOutlined,
  ShoppingOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import {
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";

function Sidebar({ collapsed }: { collapsed: boolean }) {
  // Router navigation
  const navigate = useNavigate();

  // Get current URL
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  // Sidebar menu items
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

  // Determine selected menu item from current URL
  const selectedKey = pathname.startsWith("/dashboard/users")
    ? "users"
    : pathname.startsWith("/dashboard/products")
      ? "products"
      : pathname.startsWith("/dashboard/orders")
        ? "orders"
        : "dashboard";

  // Handle sidebar navigation
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "dashboard":
        void navigate({ to: "/dashboard" });
        break;

      case "products":
        void navigate({ to: "/dashboard/products" });
        break;

      case "orders":
        void navigate({ to: "/dashboard/orders" });
        break;

      case "users":
        void navigate({ to: "/dashboard/users" });
        break;
    }
  };

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
        {/* Logo */}
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

        {/* Main Navigation */}
        <Menu
          mode="inline"
          items={mainItems}
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          style={{
            border: "none",
            flex: 1,
          }}
        />

        {/* Bottom Navigation */}
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
