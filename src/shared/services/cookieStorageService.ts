import { deleteCookie, getCookie, setCookie } from "cookies-next";

class SecureCookieStorage {
  public setItem(key: string, value: any) {
    setCookie(key, value);
  }

  public getItem(key: string) {
    return getCookie(key);
  }

  public removeItem(key: string) {
    deleteCookie(key);
  }
}

export const cookieStorageService = new SecureCookieStorage();
