import {
  AppstoreOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { Col, Row } from "antd";

import StatCard from "./StatCard";

function StatsCards() {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="Total Revenue"
          value="$128.4k"
          change="14.2%"
          icon={<DollarOutlined />}
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="Total Orders"
          value="1,429"
          change="8.1%"
          icon={<ShoppingCartOutlined />}
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="Total Customers"
          value="4,892"
          change="12.5%"
          icon={<TeamOutlined />}
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="Total Products"
          value="864"
          change="14.2%"
          icon={<AppstoreOutlined />}
        />
      </Col>
    </Row>
  );
}

export default StatsCards;