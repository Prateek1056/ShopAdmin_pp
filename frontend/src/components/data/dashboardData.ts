import type { CategoryData, Order, StockAlert } from "../../types/dashboard";

export const salesData = [
  { month: "Jan", revenue: 12000, volume: 11138 },
  { month: "Feb", revenue: 18000, volume: 22525 },
  { month: "Mar", revenue: 15000, volume: 25220 },
  { month: "Apr", revenue: 22000, volume: 24147 },
  { month: "May", revenue: 19000, volume: 24150 },
  { month: "Jun", revenue: 28000, volume: 24162 },
  { month: "Jul", revenue: 24000, volume: 24141 },
  { month: "Aug", revenue: 30000, volume: 24203 },
  { month: "Sep", revenue: 26000, volume: 24590 },
  { month: "Oct", revenue: 32000, volume: 24608 },
  { month: "Nov", revenue: 29000, volume: 24102 },
  { month: "Dec", revenue: 35000, volume: 24100 },
];

export const categoryData: CategoryData[] = [
  {
    name: "Electronics",
    value: 42,
  },
  {
    name: "Apparel",
    value: 26,
  },
  {
    name: "Home Decor",
    value: 18,
  },
  {
    name: "Accessories",
    value: 14,
  },
];

export const stockAlerts: StockAlert[] = [
  {
    key: "1",
    product: "Acoustic Pro Wireless",
    sku: "HP-8842-BLK",
    stock: 0,
    urgency: "High",
    action: "Reorder",
  },
  {
    key: "2",
    product: "Pulse Fitness Smartwatch",
    sku: "WT-1102-SLV",
    stock: 2,
    urgency: "Pending",
    action: "View",
  },
  {
    key: "3",
    product: "KeyCraft RGB Keyboard",
    sku: "KB-9321-RGB",
    stock: 4,
    urgency: "Ready",
    action: "Reorder",
  },
  {
    key: "4",
    product: "Explorer Commuter Bag",
    sku: "BG-5509-NVY",
    stock: 6,
    urgency: "Transit",
    action: "Track",
  },
];

export const orders: Order[] = [
  {
    key: "1",
    customer: "Emily Larson",
    orderId: "#ORD-9024",
    amount: "$249.99",
    status: "Delivered",
    initials: "EL",
  },
  {
    key: "2",
    customer: "Marcus Brody",
    orderId: "#ORD-9023",
    amount: "$379.50",
    status: "Shipped",
    initials: "MB",
  },
  {
    key: "3",
    customer: "Aria Kapoor",
    orderId: "#ORD-9022",
    amount: "$145.00",
    status: "Processing",
    initials: "AK",
  },
  {
    key: "4",
    customer: "David Thorne",
    orderId: "#ORD-9021",
    amount: "$89.00",
    status: "Cancelled",
    initials: "DT",
  },
];
