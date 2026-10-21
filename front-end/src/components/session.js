import { jwtDecode } from "jwt-decode";

// Decoding checks the cookie format; the backend remains responsible for authentication.
export function getSessionToken(cookies) {
  const token = cookies.get("TOKEN");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    if (typeof decoded.id !== "string" || !decoded.id ||
        (decoded.exp && decoded.exp * 1000 <= Date.now())) {
      throw new Error("Invalid or expired session");
    }
    return token;
  } catch {
    cookies.remove("TOKEN", { path: "/" });
    return null;
  }
}
