import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/ui/app-sidebar";
import { Outlet } from "react-router-dom";

export default function NewLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="overflow-x-hidden w-screen bg-background min-h-screen">
        <div className="flex items-center p-4 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
          <SidebarTrigger />
        </div>
        <div className="px-6 sm:px-8 lg:px-10 py-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
