import {
  Avatar,
  Button,
  Card,
  Input,
  Tabs,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";

import { MoreOutlined, SearchOutlined } from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";

import { orders } from "../data/dashboardData";
import type { Order } from "../../types/dashboard";

function RecentOrders() {
  const columns: ColumnsType<Order> = [
    {
      title: "ORDER & CUSTOMER",
      key: "customer",
      render: (_, record) => (
        <Space>
          <Avatar size={34}>{record.initials}</Avatar>

          <Space orientation="vertical" size={0}>
            <Typography.Text strong>{record.customer}</Typography.Text>

            <Typography.Text type="secondary">{record.orderId}</Typography.Text>
          </Space>
        </Space>
      ),
    },

    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => (
        <Typography.Text strong>{amount}</Typography.Text>
      ),
    },

    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "Cancelled"
            ? "red"
            : status === "Processing"
              ? "default"
              : "geekblue";

        return <Tag color={color}>{status}</Tag>;
      },
    },

    {
      title: "ACTION",
      key: "action",
      align: "right",
      render: () => <Button type="text" icon={<MoreOutlined />} />,
    },
  ];

  return (
    <Card
      className="rounded-xl! h-full!"
      title={
        <Space orientation="vertical" size={0}>
          <Typography.Text strong>Last Month Orders</Typography.Text>
        </Space>
      }
      extra={
        <Space>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search..."
            size="small"
          />

          <Tabs
            defaultActiveKey="all"
            items={[
              {
                key: "all",
                label: "All",
              },
              {
                key: "paid",
                label: "Paid",
              },
            ]}
            onChange={(key) => {
              console.log(key);
            }}
          />
        </Space>
      }
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <Table
        columns={columns}
        dataSource={orders}
        pagination={false}
        size="small"
      />
    </Card>
  );
}

export default RecentOrders;
