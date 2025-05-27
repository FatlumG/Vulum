import React from "react";
import Header from "../components/Header";
import DashboardSidebar from "../components/DashboardSidebar";
import TotalStats from "../components/TotalStats";
import users from "../assets/figures/users.svg";
import orders from "../assets/figures/orders.svg";
import Sales from "../assets/figures/sales.svg";
import pendings from "../assets/figures/pendings.svg";

const DashboardPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="grid grid-cols-12">
        <DashboardSidebar classes="col-span-2" />
        <div className="col-span-10 py-5 px-10 font-NunitoSans">
          <h1 className="text-[32px] font-bold">Dashboard</h1>
          <div className="flex items-center gap-10">
            <TotalStats
              img={users}
              alt="users"
              title="Total Users"
              quantity="40,689"
              percentage="8,5%"
              descr="Up from yesterday"
              up={true}
            />
            <TotalStats
              img={orders}
              alt="orders"
              title="Total Orders"
              quantity="10293"
              percentage="1,3%"
              descr="Up from past week"
              up={true}
            />
            <TotalStats
              img={Sales}
              alt="sales"
              title="Total Sales"
              quantity="$89,000"
              percentage="4,3%"
              descr="Up from yesterday"
              up={false}
            />
            <TotalStats
              img={pendings}
              alt="pendings"
              title="Total Pendings"
              quantity="2040"
              percentage="1,8%"
              descr="Up from yesterday"
              up={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
