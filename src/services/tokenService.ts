
import { jwtDecode } from "jwt-decode";
interface DecodedToken {
  _id: string;
  email?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

export function decodeToken(token: string): DecodedToken {
  const decodedToken = jwtDecode<DecodedToken>(token);
  return decodedToken;
}
