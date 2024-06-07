import { BaseResponse } from "@/lib/axiosClient";

interface User {
  id?: number;
  nama: string,
  email: string,
  password: string;
  alamat: string;
}

export interface RegisterResponse extends BaseResponse {}
export interface RegisterPayload extends Pick<User, 'nama' |'alamat' | 'email' | 'password'> {
  confirm_password?: string;
}

export interface LoginPayload extends Pick<User, 'email' | 'password'> {}
export interface LoginResponse extends BaseResponse {}