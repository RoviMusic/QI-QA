import { authApi } from "@/lib/api/client";
import { LoginResponse, LoginType } from "../types/loginTypes";

export class AuthService {
  async dolibarAuth(formData: LoginType): Promise<any> {
    try {
      const response = await authApi.post<LoginResponse>("/api/auth/login", {
        username: formData.user,
        password: formData.pass,
      });
      console.warn("response auth ", response);

      if (!response.success) {
        console.error("Authentication failed:", response);
        return null;
      }
      const { user } = response;
      console.log('user auth ', user)

      return user;

    } catch (error) {
      console.error("Authentication error ", error);
      return error;
    }
  }
}

export const authService = new AuthService();
