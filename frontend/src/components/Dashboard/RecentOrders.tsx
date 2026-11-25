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
      width: "38%",
      render: (_, record) => (
        <Space size={12}>
          <Avatar
            size={38}
            style={{
              backgroundColor: "#bfbfbf",
              color: "#ffffff",
              fontWeight: 500,
            }}
          >
            {record.initials}
          </Avatar>

          <Space orientation="vertical" size={2}>
            <Typography.Text strong>{record.customer}</Typography.Text>

            <Typography.Text type="secondary">{record.orderId}</Typography.Text>
          </Space>
        </Space>
      ),
      onHeaderCell: () => ({
        style: { paddingLeft: 24 },
      }),
      onCell: () => ({
        style: { paddingLeft: 24 },
      }),
    },

    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      width: "20%",
      render: (amount: string) => (
        <Typography.Text strong>{amount}</Typography.Text>
      ),
    },

    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: "22%",
      render: (status: string) => {
        const color =
          status === "Cancelled"
            ? "error"
            : status === "Processing"
              ? "default"
              : "geekblue";

        return (
          <Tag
            color={color}
            style={{
              marginInlineEnd: 0,
              borderRadius: 5,
              paddingInline: 9,
            }}
          >
            {status}
          </Tag>
        );
      },
    },

    {
      title: "ACTION",
      key: "action",
      width: "20%",
      align: "right",
      render: () => (
        <Button
          type="text"
          icon={<MoreOutlined />}
          style={{
            color: "#595959",
          }}
        />
      ),
      onHeaderCell: () => ({
        style: { paddingRight: 24 },
      }),
      onCell: () => ({
        style: { paddingRight: 24 },
      }),
    },
  ];

  return (
    <Card
      className="rounded-xl! h-full!"
      title={<Typography.Text strong>Last Month Orders</Typography.Text>}
      extra={
        <Space size={12} align="center">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search..."
            size="middle"
            style={{ width: 190 }}
          />

          <Tabs
            defaultActiveKey="all"
            style={{
              transform: "translateY(-5px)",
            }}
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
        header: {
          paddingInline: 24,
          minHeight: 66,
        },
        body: {
          padding: 0,
        },
      }}
    >
      <Table<Order>
        columns={columns}
        dataSource={orders}
        pagination={false}
        size="middle"
        tableLayout="fixed"
      />
    </Card>
  );
}

export default RecentOrders;
