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

  const userInitials = `${user?.FName?.[0].toUpperCase() ?? ""}${
    user?.LName?.[0].toUpperCase() ?? ""
  }`;
  console.log(userInitials, "userInitials");

  return (
    <>
      <Header
        userInitials={userInitials}
        FullName={user?.FName ?? ""}
        RoleName={user?.role.RoleName}
      />
      <div className="grid grid-cols-12">
        <DashboardSidebar />
        <div className="col-span-10 py-5 px-10 font-NunitoSans">{children}</div>
      </div>
    </>
  );
};

export default Layout;
