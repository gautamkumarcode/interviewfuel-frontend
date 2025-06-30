import {User} from "../user"

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user:User ;
    token: string;
  };
}


export interface LoginPayloadData {
  email: string;
  password: string;
}
