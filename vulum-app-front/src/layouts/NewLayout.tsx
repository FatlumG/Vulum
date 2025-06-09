import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/ui/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="overflow-x-hidden">
        <SidebarTrigger />
        <div className="px-10">{children}</div>
      </main>
    </SidebarProvider>
  );
}
