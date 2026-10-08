import { Card, Flex, Space, Statistic, Tag, Typography } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  description?: string;
};

function StatCard({
  title,
  value,
  change,
  icon,
  description = "from last month",
}: StatCardProps) {
  return (
    <Card className="rounded-xl!">
      <Flex justify="space-between" align="start">
        <Space orientation="vertical" size={1}>
          <Typography.Text type="secondary">
            {title}
          </Typography.Text>

          <Statistic
            value={value}
            styles={{
              content: {
                fontSize: 24,
                fontWeight: 600,
              },
            }}
          />

          <Space size={4}>
            <Tag color="green">
              <ArrowUpOutlined />
              {change}
            </Tag>

            <Typography.Text type="secondary">
              {description}
            </Typography.Text>
          </Space>
        </Space>

        <Typography.Text className="text-2xl! text-gray-700!">
          {icon}
        </Typography.Text>
      </Flex>
    </Card>
  );
}

export default StatCard;