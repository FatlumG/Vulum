import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PublicRoute from "./components/routes/PublicRoute";
import SignInPage from "./pages/Auth/SignInPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import MyProductsPage from "./pages/MyProductsPage";
import FavoritePage from "./pages/FavoritePage";
import InboxPage from "./pages/InboxPage";
import OListPage from "./pages/OListPage";
import ProdStockPage from "./pages/ProdStockPage";
import PricingPage from "./pages/PricingPage";
import CalendarPage from "./pages/CalendarPage";
import TodoPage from "./pages/TodoPage";
import ContactPage from "./pages/ContactPage";
import InvoicesPage from "./pages/InvoicesPage";
import SettingsPage from "./pages/SettingsPage";
import NewLayout from "./layouts/NewLayout";
import AddProductPage from "./pages/AddProductPage";
import UpdateProductPage from "./pages/UpdateProductPage";
import { useSelector, UseSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import NotFoundPage from "./pages/NotFoundPage";
import AllProductsPage from "./pages/AllProductsPage";
import PendingProductsPage from "./pages/PendingProductsPage";

const App: React.FC = () => {
  const isLoading = useSelector((state: any) => state.loading.isLoading);

  if (isLoading)
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        <HashLoader color="#000" size={50} />
      </div>
    );
  return (
    <>
      {isLoading && (
        <div className="w-full h-full flex justify-center items-center absolute z-50">
          <HashLoader />
        </div>
      )}

      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <SignInPage />
              </PublicRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            }
          />

          {/* Protected Layout Wrapper */}
          <Route
            element={
              <ProtectedRoute>
                <NewLayout />
              </ProtectedRoute>
            }
          >
            {/* Private Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<AllProductsPage />} />
            <Route path="/my-products" element={<MyProductsPage />} />
            <Route path="/products/add-product" element={<AddProductPage />} />
            <Route path="/pending-products" element={<PendingProductsPage />} />
            <Route path="/products/:slug" element={<UpdateProductPage />} />
            <Route path="/favorites" element={<FavoritePage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/order-lists" element={<OListPage />} />
            <Route path="/products-stock" element={<ProdStockPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
