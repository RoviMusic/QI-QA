import { authApi } from "@/lib/api/client";
import { LoginResponse, LoginType } from "../types/loginTypes";
import { localStorageService } from "@/shared/services/localStorageService";
import { UserType } from "@/shared/types/userTypes";
import { loginAction } from "../actions/authActions";

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
      
      await loginAction(user.id)

      return user;

    } catch (error: any) {
      console.error("Authentication error ", error.response);
      throw new Error(error);
    }
  }

  // async logout() {
  //   try{
  //     localStorageService.removeItem('user');
  //     localStorageService.removeItem('pass');
  //     localStorageService.removeItem('dolibarrToken')
  //     await deleteSession();
  //   }catch(error){
  //     console.error(error)
  //     throw new Error('Ocurrió un error al cerrar sesión')
  //   }
  // }
}

export const authService = new AuthService();
