import { authApi } from "@/lib/api/client";
import { LoginResponse, LoginType } from "../types/loginTypes";

export class AuthService {
  // async authenticate(username: string, password: string): Promise<any> {
  //   try {
  //     const response = await authApi.post<LoginResponse>("/api/auth/login", {
  //       username: username,
  //       password: password,
  //     });

  //     if (!response.isAuthenticated) {
  //       console.error("Authentication failed:", response);
  //       return null;
  //     }
  //     const { user } = response;

  //     return user;
  //   } catch (error) {
  //     console.error("Authentication error:", error);
  //     return null;
  //   }
  // }

  async dolibarAuth(formData: LoginType): Promise<any> {
    try {
      const response = await authApi.post<LoginResponse>("/api/auth/login_dolibarr", {
        username: formData.user,
        password: formData.pass,
      });

      if (!response.success) {
        console.error("Authentication failed:", response);
        return null;
      }
      const { user } = response;
      console.log('user auth ', user)

      return user;

    } catch (error) {
      console.error("Authentication error ", error);
      return null
    }
  }
}

export const authService = new AuthService();
