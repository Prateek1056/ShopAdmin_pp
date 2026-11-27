
import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";

import HomeRoute from "./routes/index";
import LoginPage from "./routes/login";
import RegisterPage from "./routes/register";

import DashboardIndex from "./routes/_protected.dashboard.index";
import ProductsRoute from "./routes/_protected.dashboard.products";
import OrdersRoute from "./routes/_protected.dashboard.orders";
import UsersRoute from "./routes/_protected.dashboard.users";

function App() {
  return (
    <>

      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardIndex />} />
            <Route path="products" element={<ProductsRoute />} />
            <Route path="orders" element={<OrdersRoute />} />

            {/* Admin Only Route */}
            <Route element={<AdminRoute />}>
              <Route path="users" element={<UsersRoute />} />
            </Route>
          </Route>
        </Route>

        {/* Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
