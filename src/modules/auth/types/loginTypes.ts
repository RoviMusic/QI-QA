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
  success: boolean,
  user: {
    id: string,
    login: string,
    entity: string,
    admin: boolean,
    name: string,
    email: string,
  },
  dolibarr_url: string,
  session_id: string,
  message: string
}
