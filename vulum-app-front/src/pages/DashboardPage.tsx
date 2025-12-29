import { FC } from "react";
import TotalStats from "../components/TotalStats";
import usersIcon from "../assets/figures/users.svg";
import ordersIcon from "../assets/figures/orders.svg";
import salesIcon from "../assets/figures/sales.svg";
import pendingsIcon from "../assets/figures/pendings.svg";
import DashboardChart from "../components/dashboard/DashboardChart";
import getDashboardData from "../hooks-apiCalls/useDashboardData";

const DashboardPage: FC = () => {
  const { stats, monthlyStats, loading, error } = getDashboardData();

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-[25px] font-bold">
        <span className="font-semibold">Welcome to dashboard </span>
        {stats?.user?.first_name ?? ""}
      </h1>

      <div className="flex items-center gap-10">
        <TotalStats
          img={usersIcon}
          alt="users"
          title="Total Users"
          quantity={stats?.totalUsers ?? 0}
          percentage="8,5%"
          descr="Up from yesterday"
          up={true}
        />
        <TotalStats
          img={pendingsIcon}
          alt="products"
          title="Total Products"
          quantity={stats?.user?.products ?? 0}
          percentage="1,8%"
          descr="Up from yesterday"
          up={true}
        />
        <TotalStats
          img={salesIcon}
          alt="sales"
          title="Total Sales"
          quantity={stats?.user?.sales ?? 0}
          percentage="4,3%"
          descr="Up from yesterday"
          up={false}
        />
        <TotalStats
          img={ordersIcon}
          alt="orders"
          title="Total Orders"
          quantity={stats?.user?.orders ?? 0}
          percentage="1,3%"
          descr="Up from past week"
          up={true}
        />
      </div>

      {loading ? (
        <p className="mt-6 text-gray-500">Loading charts...</p>
      ) : (
        <div className="mt-6">
          <DashboardChart data={monthlyStats} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
