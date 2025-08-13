import { authApi } from "@/lib/api/client";
import { LoginResponse, LoginType } from "../types/loginTypes";
import { cookieStorageService } from "@/shared/services/cookieStorageService";
import { localStorageService } from "@/shared/services/localStorageService";
import { UserType } from "@/shared/types/userTypes";

export class AuthService {
  async dolibarAuth(formData: LoginType): Promise<UserType | null> {
    try {
      const response = await authApi.post<LoginResponse>("/api/auth/login", {
        username: formData.user,
        password: formData.pass,
      });

      if (!response.success) {
        console.error("Authentication failed:", response);
        return null;
      }
      localStorageService.setItem('user', formData.user)
      localStorageService.setItem('pass', formData.pass)
      const { user } = response;
      console.log('user auth ', user)

      return user;

    } catch (error: any) {
      console.error("Authentication error ", error.response);
      throw new Error(error);
    }
  }
}

export const authService = new AuthService();
