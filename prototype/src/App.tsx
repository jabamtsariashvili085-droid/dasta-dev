import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Products from "./pages/Products";
import Warehouse from "./pages/Warehouse";
import UsersPage from "./pages/UsersPage";
import { DashboardLayout } from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/pos" element={<DashboardLayout />}>
            <Route index element={<POS />} />
          </Route>
          <Route path="/dashboard/products" element={<DashboardLayout />}>
            <Route index element={<Products />} />
          </Route>
          <Route path="/dashboard/warehouse" element={<DashboardLayout />}>
            <Route index element={<Warehouse />} />
          </Route>
          <Route path="/dashboard/users" element={<DashboardLayout />}>
            <Route index element={<UsersPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
