export interface LoggedUserInterface {
  userId: number;
  email: string;
  name: string;
  stripe_customer_id:string;
  role_id: number;
  role: string;
  plan_id: number;
  iat: number;
  exp: number;
}
