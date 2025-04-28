export interface LoggedUserInterface {
  id: number;
  email: string;
  role_id: number;
  role: string;
  iat: number;
  exp: number;
}
