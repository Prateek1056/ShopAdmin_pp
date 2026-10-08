export type StatCardData = {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
};

export type StockAlert = {
  key: string;
  product: string;
  sku: string;
  stock: number;
  urgency: string;
  action: string;
};

export type Order = {
  key: string;
  customer: string;
  orderId: string;
  amount: string;
  status: string;
  initials: string;
};

export type CategoryData = {
  name: string;
  value: number;
};