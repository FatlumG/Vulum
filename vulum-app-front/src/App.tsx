import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PublicRoute from "./components/routes/PublicRoute";
import NewLayout from "./layouts/NewLayout";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import { Toaster } from "sonner";

// Lazy-loaded page components — each becomes its own chunk
const LandingPage = lazy(() => import("./pages/LandingPage"));
const SignInPage = lazy(() => import("./pages/Auth/SignInPage"));
const SignUpPage = lazy(() => import("./pages/Auth/SignUpPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AllProductsPage = lazy(() => import("./pages/AllProductsPage"));
const MyProductsPage = lazy(() => import("./pages/MyProductsPage"));
const AddProductPage = lazy(() => import("./pages/AddProductPage"));
const PendingProductsPage = lazy(() => import("./pages/PendingProductsPage"));
const UpdateProductPage = lazy(() => import("./pages/UpdateProductPage"));
const ViewProductPage = lazy(() => import("./pages/ViewProductPage"));
const FavoritePage = lazy(() => import("./pages/FavoritePage"));
const InboxPage = lazy(() => import("./pages/InboxPage"));
const OListPage = lazy(() => import("./pages/OListPage"));
const ProdStockPage = lazy(() => import("./pages/ProdStockPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const TodoPage = lazy(() => import("./pages/TodoPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const InvoicesPage = lazy(() => import("./pages/InvoicesPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

const PageLoader = () => (
  <div className="w-full h-full flex justify-center items-center py-20">
    <HashLoader color="hsl(var(--primary))" size={32} />
  </div>
);

const App: React.FC = () => {
  const isLoading = useSelector((state: any) => state.loading.isLoading);

  return (
    <>
      {isLoading && (
        <div className="w-full h-full bg-background/80 backdrop-blur-sm flex justify-center items-center fixed inset-0 z-50">
          <HashLoader color="hsl(var(--primary))" />
        </div>
      )}

      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />
            <Route
              path="/sign-in"
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
            <Route
              path="*"
              element={
                <PublicRoute>
                  <NotFoundPage />
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
              <Route
                path="/pending-products"
                element={<PendingProductsPage />}
              />
              <Route path="/products/:slug" element={<UpdateProductPage />} />
              <Route
                path="/products/view/:slug"
                element={<ViewProductPage />}
              />
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
        </Suspense>
      </Router>

      {/* Toasts */}
      <Toaster richColors position="top-center" />
    </>
  );
};

export default App;
