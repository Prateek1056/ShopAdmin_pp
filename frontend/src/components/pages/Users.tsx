
import { useState } from "react";

import { useGetUsers, useSaveUser } from "../../Services/user.services";

import type { UserDto, SaveUserRequest } from "../../types/users.types";
import { Gender, UserRole } from "../../types/users.types";

import {
  Alert,
  Button,
  Card,
  Drawer,
  Form,
  Input,
  message,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";

import type { TableColumnsType } from "antd";

type AddUserFormValues = {
  name: string;
  email: string;
  contactNumber: string;
  password: string;
  role: UserRole;
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
        <Tag color="blue">Admin</Tag>
      ) : (
        <Tag color="green">User</Tag>
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

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useGetUsers();

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
        error instanceof Error ? error.message : "Failed to create user."
      );
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    form.resetFields();
  };

  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>
      <Typography.Title level={3}>User Management</Typography.Title>

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

      <Card>
        <Space
          style={{
            width: "100%",
            marginBottom: 16,
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

        <Table<UserDto>
          rowKey="id"
          columns={columns}
          dataSource={filteredUsers}
          loading={isLoading}
          pagination={false}
          scroll={{ x: true }}
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
            rules={[
              { required: true, message: "Please enter the full name." },
            ]}
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
            rules={[
              { required: true, message: "Please select a role." },
            ]}
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
