import { useState } from "react";

import { useGetUsers, useSaveUser } from "../../Services/user.services";

import type { UserDto, SaveUserRequest } from "../../types/users.types";
import { Gender, UserRole } from "../../types/users.types";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  Alert,
  Button,
  Card,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";

import type { TableColumnsType } from "antd";

type AddUserFormValues = {
  name: string;
  email: string;
  contactNumber: string;
  password: string;
  role: UserRole;
};

const deleteUser = {
  mutate: (userId: string) => {
    message.info(`Delete user with ID: ${userId}`);
  },
};

const columns: TableColumnsType<UserDto> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (role: UserDto["role"]) =>
      role === UserRole.Admin ? (
        <Tag
          style={{
            borderRadius: 4,
            padding: "0 8px",
            border: "1px solid #1890ff",
          }}
          color="blue"
        >
          Admin
        </Tag>
      ) : (
        <Tag
          style={{
            borderRadius: 4,
            padding: "0 8px",
            border: "1px solid #52c41a",
          }}
          color="green"
        >
          User
        </Tag>
      ),
  },
  {
    title: "Status",
    dataIndex: "isActive",
    key: "isActive",
    render: (isActive: boolean) =>
      isActive ? (
        <Tag color="success">Active</Tag>
      ) : (
        <Tag color="error">Inactive</Tag>
      ),
  },

  {
    title: "Action",
    key: "action",
    width: 110,
    render: (_: unknown, user: UserDto) => (
      <Space size={4}>
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => message.info(`Edit user ${user.name}`)}
        />
        <Popconfirm
          title="Are you sure you want to delete this user?"
          okText="Yes"
          cancelText="No"
          description={`This action cannot be undone. User: ${user.name}`}
          onConfirm={() => deleteUser.mutate(user.id)}
        >
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => message.info(`Delete user ${user.name}`)}
          />
        </Popconfirm>
      </Space>
    ),
  },
];

function Users() {
  const [searchText, setSearchText] = useState("");

  const [selectedRole, setSelectedRole] = useState<
    UserDto["role"] | undefined
  >();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [form] = Form.useForm<AddUserFormValues>();

  // React Query hooks from user.services.ts
  const saveUserMutation = useSaveUser();

  const { data: users = [], isLoading, isError, error } = useGetUsers();

  const filteredUsers = users.filter((user) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.phone.toLowerCase().includes(search);

    const matchesRole =
      selectedRole === undefined || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const handleAddUser = async (values: AddUserFormValues) => {
    const userDetails: SaveUserRequest = {
      name: values.name,
      email: values.email,
      contactNumber: values.contactNumber,
      password: values.password,
      role: values.role,

      gender: Gender.Undefined,
      dateofBirth: null,
      address: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
      },
    };

    try {
      await saveUserMutation.mutateAsync(userDetails);

      message.success("User created successfully.");

      form.resetFields();
      setIsDrawerOpen(false);
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Failed to create user.",
      );
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    form.resetFields();
  };

  return (
    <Space orientation="vertical" style={{ width: "100%" }}>
      {/* <Typography.Title level={3}>User Management</Typography.Title> */}

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Failed to load users"
          description={
            error instanceof Error ? error.message : "Something went wrong."
          }
        />
      )}

      <Card
        style={{
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          border: "1px solid #bcbac5;",
        }}
        styles={{ body: { padding: 12 } }}
      >
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
          }}
          wrap
        >
          <Space wrap>
            <Input.Search
              placeholder="Search by name, email or phone"
              allowClear
              style={{ width: 300 }}
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />

            <Button
              type="primary"
              icon={<span>+</span>}
              onClick={() => setIsDrawerOpen(true)}
            >
              Add New User
            </Button>
          </Space>

          <Select
            placeholder="Filter by role"
            allowClear
            style={{ width: 160 }}
            value={selectedRole}
            onChange={(value) => setSelectedRole(value)}
            options={[
              { label: "User", value: UserRole.User },
              { label: "Admin", value: UserRole.Admin },
            ]}
          />
        </Space>
      </Card>

      <Card
        style={{
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          border: "1px solid #bcbac5;",
        }}
        styles={{ body: { padding: 12 } }}
      >
        <Table<UserDto>
          rowKey="id"
          styles={{ header: { cell: { backgroundColor: "#f5f5f5" } } }}
          columns={columns}
          dataSource={filteredUsers}
          loading={isLoading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          scroll={{ x: true, y: "calc(100vh - 330px)" }}
        />
      </Card>

      <Drawer
        title="Add New User"
        size={480}
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        destroyOnHidden
        extra={
          <Space>
            <Button onClick={handleDrawerClose}>Cancel</Button>

            <Button
              type="primary"
              loading={saveUserMutation.isPending}
              onClick={() => form.submit()}
            >
              Create User
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddUser}
          initialValues={{
            role: UserRole.User,
          }}
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter the full name." }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter an email address." },
              { type: "email", message: "Please enter a valid email." },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="contactNumber"
            rules={[
              { required: true, message: "Please enter a phone number." },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter a password." },
              { min: 6, message: "Password must be at least 6 characters." },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role." }]}
          >
            <Select
              options={[
                { label: "User", value: UserRole.User },
                { label: "Admin", value: UserRole.Admin },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </Space>
  );
}

export default Users;