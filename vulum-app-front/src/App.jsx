import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignPage from "./pages/SignPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from './pages/ProductsPage';
import FavoritePage from './pages/FavoritePage';
import InboxPage from './pages/InboxPage';
import OListPage from './pages/OListPage';
import ProdStockPage from './pages/ProdStockPage';
import PricingPage from './pages/PricingPage';
import CalendarPage from './pages/CalendarPage';
import TodoPage from './pages/TodoPage';
import ContactPage from './pages/ContactPage';
import InvoicesPage from './pages/InvoicesPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
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
      </Routes>
    </Router>
  );
}

export default App;
