export interface LoggedUserInterface {
  id: number;
  email: string;
  role_id: number;
  role: string;
  plan_id: number;
  iat: number;
  exp: number;
}
