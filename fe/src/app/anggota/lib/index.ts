import { PeminjamListResponse } from "@/app/(staff)/admin/interface";
import useAxiosAuth from "@/hook/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

const useAnggotaModule = () => {
  const axiosAuth = useAxiosAuth();

  const useListPinjaman = () => {
    const { data, isPending } = useQuery({
      queryKey: ['pinjamananggota'],
      queryFn: (): Promise<PeminjamListResponse> => axiosAuth.get('/anggota/activepinjam').then((res) => res.data),
      select: (res) => res
    })

    return { data, isPending }
  }
  
  const useListHistoryPinjaman = () => {
    const { data, isPending } = useQuery({
      queryKey: ['pinjamanhistoryanggota'],
      queryFn: (): Promise<PeminjamListResponse> => axiosAuth.get('/anggota/historypinjam').then((res) => res.data),
      select: (res) => res
    })

    return { data, isPending }
  }

  const useGetMsg = (id: string | undefined) => {
    const { data, isPending } = useQuery({
      queryKey: ['msg', { id }],
      queryFn: (): any => axiosAuth.get(`/chat/getmsg/${id}`).then((res) => res.data),
      select: (res) => res,
    })

    return { data, isPending }
  }

  return { useListPinjaman, useListHistoryPinjaman, useGetMsg }
}

export default useAnggotaModule;