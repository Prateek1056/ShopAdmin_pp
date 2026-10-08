import { Badge, Card, Col, Row, Space, Typography } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import ReactECharts from "echarts-for-react";

import { categoryData } from "../data/dashboardData";

function CategoryChart() {
  const categoryChartOption = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {d}%",
    },

    graphic: [
      {
        type: "text",
        left: "center",
        top: "43%",
        style: {
          text: "$128.4k",
          fontSize: 22,
          fontWeight: 600,
          fill: "#1f2937",
        },
      },
      {
        type: "text",
        left: "center",
        top: "55%",
        style: {
          text: "Total Sales",
          fontSize: 11,
          fill: "#8c8c8c",
        },
      },
    ],

    series: [
      {
        name: "Sales by Category",
        type: "pie",
        radius: ["52%", "78%"],
        center: ["50%", "50%"],

        label: {
          show: false,
        },

        emphasis: {
          label: {
            show: false,
          },
        },

        data: categoryData.map((category, index) => ({
          name: category.name,
          value: category.value,

          itemStyle: {
            color: [
              "#4F46E5",
              "#2563EB",
              "#818CF8",
              "#A5B4FC",
            ][index],
          },
        })),
      },
    ],
  };

  const categoryColors = [
    "#4F46E5",
    "#2563EB",
    "#818CF8",
    "#A5B4FC",
  ];

  return (
    <Card
      className="rounded-xl! h-full!"
      title={
        <Space orientation="vertical" size={0}>
          <Typography.Text strong>
            Sales by Category
          </Typography.Text>

          <Typography.Text type="secondary">
            Product share by revenue
          </Typography.Text>
        </Space>
      }
      extra={<MoreOutlined />}
    >
      <ReactECharts
        option={categoryChartOption}
        
      />

      <Row gutter={[16, 10]}>
        {categoryData.map((category, index) => (
          <Col span={12} key={category.name}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Badge
                color={categoryColors[index]}
                text={category.name}
              />

              <Typography.Text strong>
                {category.value}%
              </Typography.Text>
            </Space>
          </Col>
        ))}
      </Row>
    </Card>
  );
}

export default CategoryChart;