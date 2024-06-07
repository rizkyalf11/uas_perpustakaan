import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoginPayload, RegisterPayload, RegisterResponse } from "../interface";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import useAxiosAuth from "@/hook/useAxiosAuth";

const useAuthModule = () => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession();

  // lupapw
  const useLupaPw = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: (payload: { email: string }) => axiosClient.post('/auth/lupa-pw', payload),
      onSuccess: () => {
        toast.success('Silahkan Cek Email!');
        router.push('/login');
      },
      onError: () => {
        toast.error('Ada Kesalahan')
      }
    })

    return { mutate, isPending }
  }
  
  // resetpw
  const useResetPw = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: (payload: { new_password: string, id: string, token: string }) => axiosClient.post(`/auth/reset-pw/${payload.id}/${payload.token}`, { new_password: payload.new_password }),
      onSuccess: () => {
        toast.success('Silahkan Login Kembali!');
        router.push('/login');
      },
      onError: () => {
        toast.error('Ada Kesalahan')
      }
    })

    return { mutate, isPending }
  }

  // register
  const useRegister = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: (payload: RegisterPayload): Promise<RegisterResponse> =>
        axiosClient.post("/anggota/register", payload).then((res) => res.data),
      onSuccess: () => {
        toast.success("Registrasi Berhasil!");
        router.push("/login");
      },
      onError: () => {
        toast.success("Registrasi gagal!");
      },
    });

    return { mutate, isPending };
  };

  // login
  const useLogin = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: (payload: LoginPayload) =>
        axiosClient.post("/auth/login", payload).then((res) => res.data),
      onSuccess: async(res) => {
        toast.success('Login Berhasil!');
        await signIn('credentials', {
          redirect: false,
          id: res.data.id,
          nama: res.data.nama,
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token,
          role: res.data.role
        })
        router.push('/');
      },
      onError: (e: any) => {
        console.log(e.response)
        toast.error(e.response.data.message)
      }
    });
    
    return { mutate, isPending }
  };

  // prifle
  const useProfile = () => {
    const { data, isPending } = useQuery({
      queryKey: ['profile'],
      queryFn: () => axiosAuth.get('/auth/profile').then((res) => res.data),
      select: (res) => res,
      enabled: !!session == true
    })

    return { data, isPending }
  }

  return { useRegister, useLogin, useProfile, useLupaPw, useResetPw };
};

export default useAuthModule;
