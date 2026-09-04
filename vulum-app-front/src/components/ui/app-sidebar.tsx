import {
  Home,
  Settings,
  Heart,
  Sheet,
  LogOut,
  Package2,
  Tag,
  Boxes,
  Hourglass,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar";
import { useDispatch } from "react-redux";
import { logout } from "../../features/store/authSlice";
import { getPfp } from "../../hooks-apiCalls/getPfpHook";
import { Link } from "react-router-dom";

export function AppSidebar() {
  const dispatch = useDispatch();
  const logoutUser = () => {
    dispatch(logout());
  };
  const user = getPfp();
  const userRole = user.user?.role.role_name;

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Products",
      url: "/products",
      icon: Boxes,
    },
    {
      title: "My Products",
      url: "/my-products",
      icon: Package2,
    },
    ...(userRole === "Super Admin" ||
    userRole === "Admin" ||
    userRole === "Manager"
      ? [
          {
            title: "Pending Products",
            url: "/pending-products",
            icon: Hourglass,
          },
        ]
      : []),
    {
      title: "Favorites",
      url: "/favorites",
      icon: Heart,
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: Sheet,
    },
    {
      title: "Pricing",
      url: "/pricing",
      icon: Tag,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link to="/" className="flex items-center gap-2.5 my-8">
              <div className="w-8 h-8 rounded-lg bg-primaryBlue flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight">
                Vulum
              </span>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent className="h-full flex flex-col justify-between pt-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <SidebarMenu className="mt-auto pb-4">
              <div className="border-t border-border pt-4 px-2">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        logoutUser();
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>

              <Link
                to="/settings"
                className="flex flex-row items-center gap-3 px-4 py-3 mt-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="bg-primaryBlue text-white w-9 h-9 grid place-items-center rounded-full text-sm font-medium shrink-0">
                  {user.userInitials}
                </div>
                <div className="cursor-pointer min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {user?.user?.FullName}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.user?.role.role_name}
                  </p>
                </div>
              </Link>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
