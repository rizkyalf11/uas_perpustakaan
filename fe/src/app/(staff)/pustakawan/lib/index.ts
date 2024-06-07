import { usePagination } from "@/hook/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookCreateArrayPayload,
  BookListFilter,
  BookListResponse,
  BookResponse,
  BookUpdatePayload,
} from "../interface";
import useAxiosAuth from "@/hook/useAxiosAuth";
import toast from "react-hot-toast";
import useUploadFile from "@/hook/useUploadFile";
import { useRouter } from "next/navigation";

const usePustakawanModule = () => {
  const axiosAuth = useAxiosAuth();
  const { uploadSingle } = useUploadFile();
  const router = useRouter();
  const queryClient = useQueryClient();

  // LIST BUKU
  const defaultParams = {
    page: 1,
    pageSize: 10,
    judul: "",
    pengarang: "",
    dari_tahun_terbit: "",
    sampai_tahun_terbit: "",
  };

  const getBookList = async (
    params: BookListFilter,
  ): Promise<BookListResponse> => {
    return axiosAuth.get("/book/list", { params }).then((res) => res.data);
  };

  const useListBook = () => {
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
      queryKey: ["book", filterParams],
      queryFn: () => getBookList(filterParams),
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

  // CREATE BUKU
  const createBuku = async (payload: BookCreateArrayPayload): Promise<any> => {
    const modifiedPayload = { ...payload };

    for (let i = 0; i < payload.data.length; i++) {
      const book = modifiedPayload.data[i];
      if (book.file !== undefined) {
        const res = await uploadSingle(book.file);

        modifiedPayload.data[i] = {
          ...book,
          cover: res.data.file_url,
        };

        delete modifiedPayload.data[i].file;
      }
    }

    return axiosAuth.post("/book/createbulk", payload).then((res) => res.data);
  };

  const useCreateBook = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: (payload: BookCreateArrayPayload) => createBuku(payload),
      onSuccess: (res) => {
        toast.success("Berhasil Menambah Data Buku");
        router.push("/pustakawan");
        queryClient.invalidateQueries();
      },
      onError: () => {
        toast.error("Gagal Menambah Data Buku");
      },
    });

    return { mutate, isPending };
  };

  // UPDATE BUKU
  const updateBuku = async (payload: BookUpdatePayload, id: string): Promise<any> => {

    if (payload.file !== undefined) {
			const res = await uploadSingle(payload.file)

			payload = {
				...payload,
				cover: res.data.file_url,
			}
		}

    return axiosAuth.put(`/book/update/${id}`, payload);
  };

  const useUpdateBook = (id: string) => {
    const { mutate, isPending } = useMutation(
      {
        mutationFn: (payload: BookUpdatePayload) => updateBuku(payload, id),
        onSuccess: () => {
          toast.success('Berhasil Mengupdate Buku');
          router.push('/pustakawan');
        },
        onError: () => {
          toast.error('Ada Kesalahan!');
        }
      }
    )

    return { mutate, isPending }
  }

  // HAPUS BUKU
  const useDeleteBook = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: (id: number) => axiosAuth.delete(`/book/delete/${id}`),
      onSuccess: () => {
        toast.success("Berhasil Menghapus Buku!");
        queryClient.invalidateQueries();
        router.push("/pustakawan");
      },
      onError: () => {
        toast.error("Ada Kesalahan!");
      },
    });

    return { mutate, isPending }
  };

  // DETAIL
  const useDetailBook = (id: number) => {
    const { data, isPending } = useQuery({
      queryKey: ['detailbook', { id }],
      queryFn: (): Promise<BookResponse> => axiosAuth.get(`/book/detail/${id}`).then((res) => res.data),
      select: (res) => res
    })

    return { data, isPending }
  }

  return { useListBook, useCreateBook, useDeleteBook, useDetailBook, useUpdateBook };
};

export default usePustakawanModule;
