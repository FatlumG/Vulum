import React, { useState, useEffect, FC } from "react";
import TotalStats from "../components/TotalStats";
import users from "../assets/figures/users.svg";
import orders from "../assets/figures/orders.svg";
import Sales from "../assets/figures/sales.svg";
import pendings from "../assets/figures/pendings.svg";
import api from "../auth/api";
import { userInterface } from "../interfaces/UserInterface";

const DashboardPage: FC = () => {
  const [user, setUser] = useState<userInterface>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
        // console.log(res.data, "res.data");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1 className="text-[25px] font-bold">
        <span className="font-semibold">Welcome to dashboard </span>
        {user?.first_name}
      </h1>
      <div className="flex items-center gap-10">
        <TotalStats
          img={users}
          alt="users"
          title="Total Users"
          quantity={40689}
          percentage="8,5%"
          descr="Up from yesterday"
          up={true}
        />
        <TotalStats
          img={orders}
          alt="products"
          title="Total Products"
          quantity={user?.products}
          percentage="1,8%"
          descr="Up from yesterday"
          up={true}
        />
        <TotalStats
          img={Sales}
          alt="sales"
          title="Total Sales"
          quantity={user?.sales}
          percentage="4,3%"
          descr="Up from yesterday"
          up={false}
        />
        <TotalStats
          img={pendings}
          alt="orders"
          title="Total Orders"
          quantity={user?.orders}
          percentage="1,3%"
          descr="Up from past week"
          up={true}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
