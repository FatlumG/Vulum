import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PublicRoute from "./components/routes/PublicRoute";
import SignInPage from "./pages/Auth/SignInPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
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
import Layout from "./layouts/Layout";
import AddProductPage from "./pages/AddProductPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes  */}
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
      </Routes>
      <Layout>
        <Routes>
          {/* Private Routes  */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/add-product"
            element={
              <ProtectedRoute>
                <AddProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <InboxPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-lists"
            element={
              <ProtectedRoute>
                <OListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products-stock"
            element={
              <ProtectedRoute>
                <ProdStockPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <PricingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/todo"
            element={
              <ProtectedRoute>
                <TodoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <InvoicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
