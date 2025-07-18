export type LoginType = {
  user: string;
  pass: string;
};

export interface ExternalApiResponse {
  data: {
    firstname: string;
  };
  status: "success" | "error";
  message: string;
}

export interface LoginResponse {
  isAuthenticated: boolean,
  user: {
    email: string,
    name: string,
    id: string
  }
}
