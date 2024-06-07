import { axiosClient, axiosClientRefresh } from "@/lib/axiosClient";
import { signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface SessionUser {
  id: number;
  refreshToken: string;
  accessToken: string;
  name: string;
  email: string;
}

export const useRefreshToken = () => {
  const { data: session, update } = useSession();

  useEffect(() => {
    const requestIntercept = axiosClientRefresh.interceptors.request.use(
      (config: any) => {
        if (session?.user) {
          config.headers["Authorization"] =
            `Bearer ${session.user.refreshToken}`;
          config.headers.id = session.user.id;
        }

        return config;
      },
      (error: any) => Promise.reject(error),
    );

    const responseIntercept = axiosClientRefresh.interceptors.response.use(
      async (response: any) => response,
      async (error: any) => {
        toast.error('Login Ulang!');
        signOut();
        // window.location.replace("/login");
      },
    );

    return () => {
      axiosClientRefresh.interceptors.request.eject(requestIntercept);
      axiosClientRefresh.interceptors.response.eject(responseIntercept);
    };
  }, [session]);

  const refreshToken = async () => {
    if (!session) return;

    try {
      const { user } = session as Session & { user: SessionUser };

      const res = await axiosClientRefresh.get("/auth/refresh-token", {
        headers: {
          Authorization: `Bearer ${user.refreshToken}`,
          id: user.id,
        },
      });

      await update({
        ...session,
        user: {
          ...user,
          accessToken: res.data.data.access_token,
          refreshToken: res.data.data.refresh_token,
        },
      });

      return true;
    } catch {
      return false;
    }
  };

  return { refreshToken };
};
