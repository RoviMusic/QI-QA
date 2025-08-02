import { authApi } from "@/lib/api/client";
import { LoginResponse, LoginType } from "../types/loginTypes";
import { cookieStorageService } from "@/shared/services/cookieStorageService";
import { localStorageService } from "@/shared/services/localStorageService";

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
      localStorageService.setItem('user', formData.user)
      localStorageService.setItem('pass', formData.pass)
      const { user } = response;
      console.log('user auth ', user)

      return user;

    } catch (error) {
      console.error("Authentication error ", error);
      return null;
    }
  }
}

export const authService = new AuthService();
