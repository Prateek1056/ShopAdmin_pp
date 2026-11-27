
import type { ComponentType } from "react";

import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: ComponentType;
  adminOnly?: boolean;
}

export const navigationItems: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: DashboardOutlined,
  },
  {
    key: "products",
    label: "Products",
    path: "/dashboard/products",
    icon: AppstoreOutlined,
  },
  {
    key: "orders",
    label: "Orders",
    path: "/dashboard/orders",
    icon: ShoppingCartOutlined,
  },
  {
    key: "users",
    label: "Users",
    path: "/dashboard/users",
    icon: TeamOutlined,
    adminOnly: true,
  },
];
