import { Card, Space, Typography } from "antd";
import ReactECharts from "echarts-for-react";

import { salesData } from "../data/dashboardData";

function SalesChart() {
  const salesChartOption = {
    tooltip: {
      trigger: "axis",
    },

    legend: {
      top: 0,
      right: 0,
      data: ["Revenue ($)", "Volume"],
    },

    grid: {
      left: 45,
      right: 10,
      top: 40,
      bottom: 25,
    },

    xAxis: {
      type: "category",
      data: salesData.map((item) => item.month),
    },

    yAxis: {
      type: "value",
    },

    series: [
      {
        name: "Revenue ($)",
        type: "bar",
        data: salesData.map((item) => item.revenue),
        barGap: "20%",
        itemStyle: {
          color: "#4F46E5",
          borderRadius: [5, 5, 0, 0],
        },
      },
      {
        name: "Volume",
        type: "bar",
        data: salesData.map((item) => item.volume),
        itemStyle: {
          color: "#818CF8",
          borderRadius: [5, 5, 0, 0],
        },
      },
    ],
  };

  return (
    <Card
      className="rounded-xl! h-full! "
      title={
        <Space orientation="vertical" size={0}>
          <Typography.Text strong>
            Last 6 months sales
          </Typography.Text>

          <Typography.Text type="secondary">
            Monthly revenue performance and order volume
          </Typography.Text>
        </Space>
      }
    >
      <ReactECharts
        option={salesChartOption}
        style={{ height: "320px", width: "100%" }}
       
      />

      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Typography.Text type="secondary">
          Growth Trend:
          <Typography.Text type="success">
            {" +56.6% "}
          </Typography.Text>
          across past 2 quarters
        </Typography.Text>

        <Typography.Text type="secondary">
          Peak Month:
          <Typography.Text strong>
            {" Oct 2024 ($128,430)"}
          </Typography.Text>
        </Typography.Text>
      </Space>
    </Card>
  );
}

export default SalesChart;