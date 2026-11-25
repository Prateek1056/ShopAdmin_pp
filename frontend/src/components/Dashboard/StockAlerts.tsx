
import { Avatar, Button, Card, Space, Table, Tag, Typography } from "antd";

import {
  AppstoreOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";

import { stockAlerts } from "../data/dashboardData";
import type { StockAlert } from "../../types/dashboard";

function StockAlerts() {
  const columns: ColumnsType<StockAlert> = [
    {
      title: "PRODUCT",
      dataIndex: "product",
      key: "product",
      width: "46%",
      render: (_, record) => (
        <Space size={12}>
          <Avatar
            shape="square"
            size={38}
            icon={<AppstoreOutlined />}
            style={{
              backgroundColor: "#f0f0f0",
              color: "#595959",
              borderRadius: 8,
            }}
          />

          <Space orientation="vertical" size={2}>
            <Typography.Text strong>
              {record.product}
            </Typography.Text>

            <Typography.Text type="secondary">
              {record.sku}
            </Typography.Text>
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
      title: "STOCK",
      dataIndex: "stock",
      key: "stock",
      width: "15%",
      render: (stock: number) => (
        <Tag
          color={stock === 0 ? "error" : "geekblue"}
          style={{
            marginInlineEnd: 0,
            borderRadius: 5,
            paddingInline: 9,
          }}
        >
          {stock} left
        </Tag>
      ),
    },
    {
      title: "URGENCY",
      dataIndex: "urgency",
      key: "urgency",
      width: "17%",
      render: (urgency: string) => (
        <Typography.Text
          type={urgency === "High" ? "danger" : undefined}
        >
          {urgency}
        </Typography.Text>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      width: "22%",
      align: "right",
      render: (_, record) => (
        <Button
          type={record.action === "Reorder" ? "primary" : "default"}
          size="middle"
          style={{ minWidth: 68 }}
        >
          {record.action}
        </Button>
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
      title={
        <Space size={10}>
          <AppstoreOutlined />

          <Typography.Text strong>
            Stock Shortage & Alerts
          </Typography.Text>

          <Tag
            color="error"
            style={{
              marginInlineEnd: 0,
              borderRadius: 5,
            }}
          >
            5 Critical
          </Tag>
        </Space>
      }
      extra={
        <Button
          icon={<FilterOutlined />}
          size="middle"
        >
          Filter
        </Button>
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
      <Table<StockAlert>
        columns={columns}
        dataSource={stockAlerts}
        pagination={false}
        size="middle"
        tableLayout="fixed"
      />
    </Card>
  );
}

export default StockAlerts;
