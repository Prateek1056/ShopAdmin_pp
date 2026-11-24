import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../lib/queryKeys";

import { useQuery } from "@tanstack/react-query";
import { authQueryOptions } from "../../features/auth/auth.queries";

import {
  Avatar,
  Button,
  Card,
  Divider,
  Dropdown,
  Flex,
  Input,
  Layout,
  Space,
  Typography,
  message,
  theme,
} from "antd";

import {
  SearchOutlined,
  SunOutlined,
  MenuFoldOutlined,
  DownOutlined,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { logoutUser } from "../../features/auth/auth.api";

function Header({
  collapsed,
  setCollapsed,
  isDark,
  setIsDark,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}) {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery(authQueryOptions());

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Call backend logout API
      await logoutUser();

      // Cancel any ongoing current-user requests
      await queryClient.cancelQueries({
        queryKey: [queryKeys.AUTH_USER],
      });

      // Update authentication cache immediately
      queryClient.setQueryData([queryKeys.AUTH_USER], null);

      message.success("Logged out successfully.");

      // Navigate to login page
      await navigate({
        to: "/login",
        replace: true,
      });
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : "Unable to logout. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const profileContent = (
    <Card
      styles={{
        body: {
          padding: 16,
        },
      }}
      style={{
        width: 340,
        borderRadius: 14,
      }}
    >
      <Flex vertical align="center" gap={10}>
        <Avatar
          size={80}
          src={currentUser?.profilePic || undefined}
          icon={<UserOutlined />}
        />

        <Typography.Title level={5} style={{ margin: 0 }}>
          {currentUser?.userName || "User"}
        </Typography.Title>

        <Typography.Text type="secondary">
          {currentUser?.role || ""}
        </Typography.Text>

        <Typography.Text type="secondary">
          {currentUser?.email || ""}
        </Typography.Text>
      </Flex>

      <Divider />

      <Typography.Text
        type="secondary"
        style={{
          display: "block",
          marginBottom: 10,
        }}
      >
        Account
      </Typography.Text>

      <Flex vertical gap={8}>
        <Button
          type="text"
          block
          icon={<UserOutlined />}
          style={{
            height: 48,
            justifyContent: "flex-start",
          }}
          onClick={() => {
            console.log("My Profile");
          }}
        >
          My Profile
        </Button>

        <Button
          type="text"
          block
          icon={<LockOutlined />}
          style={{
            height: 48,
            justifyContent: "flex-start",
          }}
          onClick={() => {
            console.log("Change Password");
          }}
        >
          Change Password
        </Button>
      </Flex>

      <Divider />

      <Button
        danger
        type="text"
        block
        icon={<LogoutOutlined />}
        loading={isLoggingOut}
        disabled={isLoggingOut}
        style={{
          height: 44,
          justifyContent: "flex-start",
        }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Card>
  );

  return (
    <Layout.Header
      className="h-20! px-6!"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: token.colorBgContainer,
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        style={{
          height: "100%",
        }}
      >
        <Space size={16}>
          <MenuFoldOutlined
            className="cursor-pointer text-lg"
            onClick={() => setCollapsed(!collapsed)}
          />

          <Input
            prefix={<SearchOutlined />}
            placeholder="Search anything ..."
            className="w-80!"
          />
        </Space>

        <Space size={20}>
          <SunOutlined
            className="cursor-pointer text-lg"
            onClick={() => setIsDark(!isDark)}
          />

          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            popupRender={() => profileContent}
          >
            <Flex align="center" gap={10} className="cursor-pointer">
              <Avatar
                size={42}
                src={currentUser?.profilePic || undefined}
                icon={<UserOutlined />}
              />

              <Flex vertical>
                <Typography.Text strong>
                  {currentUser?.userName || "User"}
                </Typography.Text>

                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {currentUser?.role || ""}
                </Typography.Text>
              </Flex>

              <DownOutlined
                style={{
                  fontSize: 10,
                  color: token.colorTextSecondary,
                }}
              />
            </Flex>
          </Dropdown>
        </Space>
      </Flex>
    </Layout.Header>
  );
}

export default Header;
