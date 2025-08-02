import secureLocalStorage from "react-secure-storage";

class SecureLocalStorage {
  public setItem(key: string, value: any) {
    secureLocalStorage.setItem(key, value);
  }

  public getItem(key: string) {
    return secureLocalStorage.getItem(key);
  }

  public removeItem(key: string) {
    secureLocalStorage.removeItem(key);
  }

  public clear() {
    secureLocalStorage.clear();
  }
}

export const localStorageService = new SecureLocalStorage();
