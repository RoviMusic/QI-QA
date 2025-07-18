import { authApi } from "@/lib/api/client";
import { LoginResponse } from "../types/loginTypes";

export class AuthService {
  async authenticate(username: string, password: string): Promise<any> {
    try {
      const response = await authApi.post<LoginResponse>(
        "/api/auth/login",
        {
          username: username,
          password: password
        }
      );

      if (!response.isAuthenticated) {
        console.error("Authentication failed:", response);
        return null;
      }
      const { user } = response;

      return user;
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
