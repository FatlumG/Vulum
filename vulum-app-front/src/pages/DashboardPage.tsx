import { FC, lazy, Suspense } from "react";
import TotalStats from "../components/TotalStats";
import usersIcon from "../assets/figures/users.svg";
import ordersIcon from "../assets/figures/orders.svg";
import salesIcon from "../assets/figures/sales.svg";
import pendingsIcon from "../assets/figures/pendings.svg";
import getDashboardData from "../hooks-apiCalls/useDashboardData";

const DashboardChart = lazy(() => import("../components/dashboard/DashboardChart"));

const DashboardPage: FC = () => {
  const { stats, monthlyStats, loading, error } = getDashboardData();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Welcome back, {stats?.user?.first_name ?? ""}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TotalStats
          img={usersIcon}
          alt="users"
          title="Total Users"
          quantity={stats?.totalUsers ?? 0}
          percentage="8.5%"
          descr="Up from yesterday"
          up={true}
        />
        <TotalStats
          img={pendingsIcon}
          alt="products"
          title="Total Products"
          quantity={stats?.user?.products ?? 0}
          percentage="1.8%"
          descr="Up from yesterday"
          up={true}
        />
        <TotalStats
          img={salesIcon}
          alt="sales"
          title="Total Sales"
          quantity={stats?.user?.sales ?? 0}
          percentage="4.3%"
          descr="Up from yesterday"
          up={false}
        />
        <TotalStats
          img={ordersIcon}
          alt="orders"
          title="Total Orders"
          quantity={stats?.user?.orders ?? 0}
          percentage="1.3%"
          descr="Up from past week"
          up={true}
        />
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Revenue Overview</h2>
          <p className="text-sm text-muted-foreground">Monthly performance</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-sm text-muted-foreground">Loading charts...</div>
          </div>
        ) : (
          <div className="p-4">
            <Suspense fallback={<div className="flex items-center justify-center h-[50vh]"><div className="text-sm text-muted-foreground">Loading chart...</div></div>}>
              <DashboardChart data={monthlyStats} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
