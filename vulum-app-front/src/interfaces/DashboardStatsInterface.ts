export interface DashboardStatsInterface {
  totalUsers: number;
  user: {
    FullName: string;
    first_name: string;
    last_name: string;
    id: number;
    sales: number;
    products: number;
    orders: number;
    favorites: number;
    pendings: number;
  };
}