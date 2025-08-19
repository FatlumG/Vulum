import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/ui/app-sidebar";
import { Outlet } from "react-router-dom";

export default function NewLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="overflow-x-hidden w-screen bg-[#f2f2f2]">
        <SidebarTrigger />
        <div className="px-10">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
