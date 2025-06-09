import { useState, useEffect } from "react";
import api from "../../auth/api";
import { userInterface } from "../../interfaces/UserInterface";
import {
  Home,
  Calendar,
  Settings,
  ListOrdered,
  Heart,
  Package,
  Sheet,
  Power,
  LogOut,
  Package2,
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
import vulum from "../../assets/logos/vulumBlue.png";
import { useDispatch } from "react-redux";
import { logout } from "../../features/store/authSlice";
import { FaChevronDown } from "react-icons/fa6";

export function AppSidebar() {
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Produts",
      url: "/produts",
      icon: Package2,
    },
    {
      title: "Favorites",
      url: "/favorites",
      icon: Heart,
    },
    {
      title: "Products Stock",
      url: "/products-stock",
      icon: Package,
    },
    {
      title: "Orders List",
      url: "/order-lists",
      icon: ListOrdered,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: Sheet,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Log out",
      url: "#",
      icon: LogOut,
      onclick: () => logoutUser,
    },
  ];
  const dispatch = useDispatch();
  const logoutUser = () => {
    dispatch(logout());
  };

  const [user, setUser] = useState<userInterface>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data);
        // console.log(res.data, "res.data");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const userInitials = `${user?.FName?.[0].toUpperCase() ?? ""}${
    user?.LName?.[0].toUpperCase() ?? ""
  }`;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <img src={vulum} alt="Vulum Logo" className="w-28 my-10" />
          </SidebarGroupLabel>
          <SidebarGroupContent className="h-full flex flex-col justify-between pt-5">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild onClick={item.onclick}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarMenu className="flex flex-row items-center justify-start gap-4">
              {/* <img src={profile} alt="Profile Photo" /> */}
              <div className="bg-sky-700 text-white w-10 h-10 grid place-items-center rounded-[50%] cursor-pointer">
                {userInitials}
              </div>
              <div className="cursor-pointer">
                <h3>{user?.FullName}</h3>
                <p className="text-[12px] text-grayText cursor-pointer">
                  {user?.role.RoleName}
                </p>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
