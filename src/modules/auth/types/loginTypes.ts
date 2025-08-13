import { UserType } from "@/shared/types/userTypes";

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
  user: UserType,
  message: string
}
