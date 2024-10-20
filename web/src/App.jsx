import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import LoginLayout from "./layout/LoginLayout";
import Category from "./pages/CategoryPage";
import OrderStatus from "./pages/OrderStatusPage";
import OrderPaymentMethod from "./pages/OrderPaymentMethodPage";
import Employees from "./pages/EmployeePage";
import POS from "./pages/POS_Page";
import Invoice from "./pages/InvoicePage";
import Role from "./pages/RolePage";
import CustomerPage from "./pages/CustomerPage";
import Product from "./pages/ProductPage";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/employee" element={<Employees />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/category" element={<Category />} />
          <Route path="/product" element={<Product />} />
          <Route path="/orderstatus" element={<OrderStatus />} />
          <Route path="/orderpaymentmethod" element={<OrderPaymentMethod />} />
          <Route path="/role" element={<Role />} />
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<LoginLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
