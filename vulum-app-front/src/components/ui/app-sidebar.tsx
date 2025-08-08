import {
  Home,
  Calendar,
  Settings,
  ListOrdered,
  Heart,
  Package,
  Sheet,
  LogOut,
  Package2,
  Tag,
  Boxes,
  ShoppingBag,
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
import { getPfp } from "../../hooks/getPfpHook";
import { Link } from "react-router-dom";

export function AppSidebar() {
  const dispatch = useDispatch();
  const logoutUser = () => {
    dispatch(logout());
  };
  // const [user, setUser] = useState<userInterface>();
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
      title: "Pricing",
      url: "/pricing",
      icon: Tag,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Log out",
      url: "/",
      icon: LogOut,
      onclick: () => logoutUser(),
    },
  ];

  const user = getPfp();

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
            <SidebarMenu>
              <Link
                to="/settings"
                className="flex flex-row items-center justify-start gap-4"
              >
                {/* <img src={profile} alt="Profile Photo" /> */}
                <div className="bg-sky-700 text-white w-10 h-10 grid place-items-center rounded-[50%] cursor-pointer">
                  {user.userInitials}
                </div>
                <div className="cursor-pointer">
                  <h3>{user?.user?.FullName}</h3>
                  <p className="text-[12px] text-grayText cursor-pointer">
                    {user?.user?.role.RoleName}
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
