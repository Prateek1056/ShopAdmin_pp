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
        <Avatar size={80} src="/profile.jpg" icon={<UserOutlined />} />

        <Typography.Title
          level={5}
          style={{
            margin: 0,
          }}
        >
          Prateek Sharma
        </Typography.Title>

        <Typography.Text type="secondary">Admin</Typography.Text>
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
        style={{
          height: 44,
          justifyContent: "flex-start",
        }}
        onClick={() => {
          console.log("Logout");
        }}
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
            dropdownRender={() => profileContent}
          >
            <Flex align="center" gap={10} className="cursor-pointer">
              <Avatar size={42} src="/profile.jpg" icon={<UserOutlined />} />

              <Flex vertical>
                <Typography.Text strong>Prateek Sharma</Typography.Text>

                <Typography.Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                  }}
                >
                  Admin
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
