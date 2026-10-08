import {
  Avatar,
  Button,
  Card,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";

import { AppstoreOutlined, FilterOutlined } from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";

import { stockAlerts } from "../data/dashboardData";
import type { StockAlert } from "../../types/dashboard";

function StockAlerts() {
  const columns: ColumnsType<StockAlert> = [
    {
      title: "PRODUCT",
      dataIndex: "product",
      key: "product",
      render: (_, record) => (
        <Space>
          <Avatar shape="square" size={34} icon={<AppstoreOutlined />} />

          <Space orientation="vertical" size={0}>
            <Typography.Text strong>{record.product}</Typography.Text>

            <Typography.Text type="secondary">{record.sku}</Typography.Text>
          </Space>
        </Space>
      ),
    },

    {
      title: "STOCK",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => (
        <Tag color={stock === 0 ? "red" : "geekblue"}>{stock} left</Tag>
      ),
    },

    {
      title: "URGENCY",
      dataIndex: "urgency",
      key: "urgency",
      render: (urgency: string) => (
        <Typography.Text type={urgency === "High" ? "danger" : undefined}>
          {urgency}
        </Typography.Text>
      ),
    },

    {
      title: "ACTION",
      key: "action",
      align: "right",
      render: (_, record) => (
        <Button
          type={record.action === "Reorder" ? "primary" : "default"}
          size="small"
        >
          {record.action}
        </Button>
      ),
    },
  ];

  return (
    <Card
      className="rounded-xl! h-full!"
      title={
        <Space>
          <AppstoreOutlined />

          <Typography.Text strong>Stock Shortage & Alerts</Typography.Text>

          <Tag color="red">5 Critical</Tag>
        </Space>
      }
      extra={
        <Button icon={<FilterOutlined />} size="small">
          Filter
        </Button>
      }
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <Table
        columns={columns}
        dataSource={stockAlerts}
        pagination={false}
        size="small"
      />
    </Card>
  );
}

export default StockAlerts;
