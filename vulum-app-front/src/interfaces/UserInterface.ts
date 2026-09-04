export interface userInterface {
  address: string;
  bio: string;
  email: string;
  first_name: string;
  favorites: number;
  FullName: string;
  last_name: string;
  orders: number;
  payments: number;
  pendings: number;
  phone: string;
  pricing_plan: object;
  products: number;
  profile_photo_url: null;
  role: any;
  role_name: string;
  sales: number;
  todos: number;
  username: string;
  id: number;

  salesData?: { month: string; sales: number }[];
  ordersData?: { month: string; orders: number }[];
  productsData?: { month: string; products: number }[];
}
