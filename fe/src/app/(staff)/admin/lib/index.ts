import { useMutation, useQuery } from "@tanstack/react-query";
import { AnggotaDetailResponse, AnggotaListResponse, CreatePeminjaman, CreatePengembalian, FindAnggota, FindPeminjaman, FindPengembalian, FindPengembalianDetail, PeminjamListResponse, PengembalianListResponse } from "../interface";
import useAxiosAuth from "@/hook/useAxiosAuth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hook/usePagination";

const useAdminModule = () => {
  const axiosAuth = useAxiosAuth();
  const router = useRouter();

  // ANGGOTA DETAIL
  const useAnggotaDetail = (id: string) => {
    const { data, isPending } = useQuery({
      queryKey: ['detailanggota', { id }],
      queryFn: ():Promise<AnggotaDetailResponse> => axiosAuth.get(`/anggota/detail/${id}`).then((res) => res.data),
      select: (res) => res
    })

    return { data, isPending } 
  }

  // LIST ANGGOTA
  const defaultParams = {
    page: 1,
    pageSize: 10,
    keyword: "",
  };

  const getAnggotaList = async (
    params: FindAnggota,
  ): Promise<AnggotaListResponse> => {
    return axiosAuth.get("/anggota/list", { params }).then((res) => res.data);
  };

  const useAnggotaList = () => {
    const {
      params,
      setParams,
      handleFilter,
      handleClear,
      handlePageSize,
      handlePage,
      filterParams,
      setFilterParams
    } = usePagination(defaultParams);

    const { data, isPending } = useQuery({
      queryKey: ["anggota", filterParams],
      queryFn: () => getAnggotaList(filterParams),
      select: (res) => res,
    });

    return {
      data,
      isPending,
      params,
      setParams,
      filterParams,
      handlePage,
      handlePageSize,
      handleFilter,
      handleClear,
      setFilterParams
    };
  };

  // CREATE PEMINJAMAN
  const useCreatePeminjaman = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: (payload: CreatePeminjaman) => axiosAuth.post('/peminjaman/create', payload),
      onSuccess() {
        toast.success('Proses Peminjaman Berhasil!');
        router.push('/admin');
      },
      onError() {
        toast.error('Ada Kesalahan!');
      }
    })

    return { mutate, isPending }
  }
  
  // CREATE PENGENMBALIAN
  const useCreatePengembalian = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: (payload: CreatePengembalian) => axiosAuth.post('/pengembalian/create', payload),
      onSuccess() {
        toast.success('Proses Pengembalian Berhasil!');
        router.push('/admin');
      },
      onError() {
        toast.error('Ada Kesalahan!');
      }
    })

    return { mutate, isPending }
  }

  // LIST PEMINJAMAN
  const defaultParamsPEMINJAMAN = {
    page: 1,
    pageSize: 10,
    email: "",
  };

  const getPeminjamanList = async (
    params: FindPeminjaman,
  ): Promise<PeminjamListResponse> => {
    return axiosAuth.get("/peminjaman/list", { params }).then((res) => res.data);
  };

  const useListPeminjaman = () => {
    const {
      params,
      setParams,
      handleFilter,
      handleClear,
      handlePageSize,
      handlePage,
      filterParams,
      setFilterParams
    } = usePagination(defaultParamsPEMINJAMAN);

    const { data, isPending } = useQuery({
      queryKey: ['peminjaman', filterParams],
      queryFn: () => getPeminjamanList(filterParams),
      select: (res) => res    
    })

    return {
      data,
      isPending,
      params,
      setParams,
      filterParams,
      handlePage,
      handlePageSize,
      handleFilter,
      handleClear,
      setFilterParams
    };
  }
  
  // LIST PENGEMBALIAN
  const defaultParamsPENGEMBALIAN = {
    page: 1,
    pageSize: 10,
    email: "",
  };

  const getPengembalianList = async (
    params: FindPengembalian,
  ): Promise<PengembalianListResponse> => {
    return axiosAuth.get("/pengembalian/list", { params }).then((res) => res.data);
  };

  const useListPengembalian = () => {
    const {
      params,
      setParams,
      handleFilter,
      handleClear,
      handlePageSize,
      handlePage,
      filterParams,
      setFilterParams
    } = usePagination(defaultParamsPENGEMBALIAN);

    const { data, isPending } = useQuery({
      queryKey: ['pengembalian', filterParams],
      queryFn: () => getPengembalianList(filterParams),
      select: (res) => res    
    })

    return {
      data,
      isPending,
      params,
      setParams,
      filterParams,
      handlePage,
      handlePageSize,
      handleFilter,
      handleClear,
      setFilterParams
    };
  }
  
  // LIST PENGEMBALIAN DETAIL
  const defaultParamsPENGEMBALIANdetail = {
    page: 1,
    pageSize: 10,
  };

  const getPengembalianListDetail = async (
    id: string,
    params: FindPengembalianDetail,
  ): Promise<PengembalianListResponse> => {
    return axiosAuth.get(`/pengembalian/detail/${id}`, { params }).then((res) => res.data);
  };

  const useListPengembalianDetail = (id: string) => {
    const {
      params,
      setParams,
      handleFilter,
      handleClear,
      handlePageSize,
      handlePage,
      filterParams,
      setFilterParams
    } = usePagination(defaultParamsPENGEMBALIANdetail);

    const { data, isPending } = useQuery({
      queryKey: ['pengembaliandetail', [filterParams, id]],
      queryFn: () => getPengembalianListDetail(id, filterParams),
      select: (res) => res    
    })

    return {
      data,
      isPending,
      params,
      setParams,
      filterParams,
      handlePage,
      handlePageSize,
      handleFilter,
      handleClear,
      setFilterParams
    };
  }
  
  // LIST PEMINJAMAN DETAIL
  const defaultParamsPEMINJAMANdetail = {
    page: 1,
    pageSize: 10,
  };

  const getPeminjamanListDetail = async (
    id: string,
    params: FindPengembalianDetail,
  ): Promise<PeminjamListResponse> => {
    return axiosAuth.get(`/peminjaman/detail/${id}`, { params }).then((res) => res.data);
  };

  const useListPeminjamanDetail = (id: string) => {
    const {
      params,
      setParams,
      handleFilter,
      handleClear,
      handlePageSize,
      handlePage,
      filterParams,
      setFilterParams
    } = usePagination(defaultParamsPEMINJAMANdetail);

    const { data, isPending } = useQuery({
      queryKey: ['peminjamandetail', [filterParams, id]],
      queryFn: () => getPeminjamanListDetail(id, filterParams),
      select: (res) => res    
    })

    return {
      data,
      isPending,
      params,
      setParams,
      filterParams,
      handlePage,
      handlePageSize,
      handleFilter,
      handleClear,
      setFilterParams
    };
  }

  return { useCreatePeminjaman, useAnggotaList, useListPeminjaman, useListPengembalian, useCreatePengembalian, useListPengembalianDetail, useListPeminjamanDetail, useAnggotaDetail }
}

export default useAdminModule;