
import { Flex, Layout, Menu, Typography } from "antd";
import type { MenuProps } from "antd";

import {
  SettingOutlined,
  ShoppingOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { authQueryOptions } from "../../features/auth/auth.queries";
import { navigationItems } from "../../routes/navigation";

function Sidebar({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: currentUser } = useQuery(authQueryOptions());

  const isAdmin = currentUser?.role === "Admin";

  // Convert navigation configuration into Ant Design Menu items
  const mainItems = navigationItems
    .filter((item) => !item.adminOnly || isAdmin)
    .map((item) => ({
      key: item.key,
      label: item.label,
      icon: <item.icon />,
    }));

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

  const pathname = location.pathname;

  const selectedKey = pathname.startsWith("/dashboard/users")
    ? "users"
    : pathname.startsWith("/dashboard/products")
      ? "products"
      : pathname.startsWith("/dashboard/orders")
        ? "orders"
        : "dashboard";

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    const selectedItem = navigationItems.find(
      (item) => item.key === key,
    );

    if (selectedItem) {
      navigate(selectedItem.path);
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
