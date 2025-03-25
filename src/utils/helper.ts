import { jwtDecode } from "jwt-decode";

export function decodeToken(token: string) {
  try {
    return jwtDecode(token);
  } catch (err) {
    console.log("Invalid token ", err);
    return null;
  }
}
