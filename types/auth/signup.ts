// types/signup.ts

import { User } from "../user";

export interface SignupPayloadData {
  name: string;
  email: string;
  password: string;
  username: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}
