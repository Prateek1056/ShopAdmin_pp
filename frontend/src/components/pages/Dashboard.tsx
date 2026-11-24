import { Col, Row } from "antd";

import StatsCards from "../Dashboard/StatsCards";
import SalesChart from "../Dashboard/SalesChart";
import CategoryChart from "../Dashboard/CategoryChart";
import StockAlerts from "../Dashboard/StockAlerts";
import RecentOrders from "../Dashboard/RecentOrders";

function Dashboard() {
  const APP_URL = import.meta.env.VITE_APP_URL;
  console.log("APP_URL:", APP_URL);
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <StatsCards />
      </Col>

      <Col xs={24} lg={16}>
        <SalesChart />
      </Col>

      <Col xs={24} lg={8}>
        <CategoryChart />
      </Col>

      <Col xs={24} lg={12}>
        <StockAlerts />
      </Col>

      <Col xs={24} lg={12}>
        <RecentOrders />
      </Col>
    </Row>
  );
}

export default Dashboard;
