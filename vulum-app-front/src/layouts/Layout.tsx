import React, { FC, useState, useEffect } from "react";
import Header from "../components/Header";
import DashboardSidebar from "../components/DashboardSidebar";
import { userInterface } from "../interfaces/UserInterface";
import api from "../auth/api";

interface LayoutProps {
  children: any;
}

const Layout: FC<LayoutProps> = ({ children }) => {
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

  const userInitials = `${user?.first_name?.[0].toUpperCase() ?? ""}${
    user?.last_name?.[0].toUpperCase() ?? ""
  }`;
  // console.log(userInitials, "userInitials");

  return (
    <>
      <Header
        userInitials={userInitials}
        FullName={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()}
        RoleName={user?.role_name ?? ""}
      />
      <div className="grid grid-cols-12">
        <DashboardSidebar classes="col-span-2" />
        <div className="col-span-10 py-5 px-10 font-NunitoSans">{children}</div>
      </div>
    </>
  );
};

export default Layout;
