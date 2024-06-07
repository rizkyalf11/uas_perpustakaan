import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number | undefined | null;
      nama: string | undefined | null | unknown;
      role: string | undefined | null | unknown;
      accessToken: any;
      refreshToken: any;
      token : any
    };
  }
}