
import {
  Alert,
  Image,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";

import type { TableProps } from "antd";

import { useProducts } from "../../features/products/useProducts";
import type { Product } from "../../features/products/products.types";

function Products() {
  const {
    data: products,
    isPending,
    isError,
    error,
  } = useProducts();

  const columns: TableProps<Product>["columns"] = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl: string) =>
        imageUrl ? (
          <Image
            src={imageUrl}
            alt="Product"
            width={70}
            height={50}
            style={{ objectFit: "cover" }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: Product) => (
        <>
          <Typography.Text strong>
            {record.name}
          </Typography.Text>

          <br />

          <Typography.Text type="secondary">
            {record.description}
          </Typography.Text>
        </>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `₹${price.toLocaleString("en-IN")}`,
    },
    {
      title: "Stock",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
  ];

  if (isPending) {
    return <Spin />;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message={
          error instanceof Error
            ? error.message
            : "Failed to fetch products"
        }
      />
    );
  }

  return (
    <>
      <Typography.Title level={3}>
        Products
      </Typography.Title>

      <Typography.Text type="secondary">
        Total Products: {products?.length ?? 0}
      </Typography.Text>

      <Table<Product>
        columns={columns}
        dataSource={products ?? []}
        rowKey="id"
        pagination={false}
        scroll={{ x: "max-content" }}
      />
    </>
  );
}

export default Products;
