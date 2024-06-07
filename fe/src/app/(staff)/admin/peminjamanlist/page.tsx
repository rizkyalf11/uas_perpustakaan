"use client";

import { useRouter } from "next/navigation";
import useAdminModule from "../lib";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/components/LoadingScreen";
import { Pagination } from "@/components/Pagination";
import { useIdStore } from "@/store/useStore";

const PeminjamanList = () => {
  const { data: session, status } = useSession();
  const { useListPeminjaman } = useAdminModule();
  const router = useRouter();
  const { isSelectPEMINJAMAN, setIsSelectPEMINJAMAN, setPeminjaman } =
    useIdStore();

  const {
    data,
    isPending,
    params,
    handlePage,
    handlePageSize,
    handleClear,
    filterParams,
    setFilterParams,
  } = useListPeminjaman();

  if (status == "loading") {
    return <LoadingScreen />;
  }

  console.log(data?.data);

  const startIndex = (params.page - 1) * params.pageSize;

  return (
    <div className="flex h-screen w-full flex-col  overflow-y-auto bg-putih1 pl-[230px] pr-4 pt-6">
      <h1 className="mb-4 text-2xl font-semibold">Data Peminjaman</h1>

      <label className="input input-md input-bordered flex items-center gap-2">
        <input
          value={filterParams.email}
          onChange={(e) => {
            setFilterParams((params) => {
              return { ...params, email: e.target.value };
            });
            if (e.target.value == "") {
              handleClear();
            }
          }}
          type="text"
          className="w-full"
          placeholder="email"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd"
          />
        </svg>
      </label>

      <div className="mt-2 min-h-[500px] overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Email Anggota</th>
              <th>tgl_pinjam</th>
              <th>tgl_kembali</th>
              <th>ID-Anggota</th>
              <th>Buku</th>
            </tr>
          </thead>
          <tbody>
            {!isPending &&
              data?.data.map((_, i) => (
                <tr
                  className={`${isSelectPEMINJAMAN && "cursor-pointer hover:bg-gray-200"}`}
                  onClick={() => {
                    if (isSelectPEMINJAMAN) {
                      router.push("/admin/pengembalian");
                      setIsSelectPEMINJAMAN(false);
                      setPeminjaman(_.id);
                    }
                  }}
                  key={i}
                >
                  <th>{startIndex + i + 1}</th>
                  <td>{_.id}</td>
                  <td>{_.id_anggota.email}</td>
                  <td>{_.tanggal_pinjam}</td>
                  <td className={`${new Date().toISOString().split("T")[0] > _.tanggal_kembali && 'text-red-500'}`}>{_.tanggal_kembali}</td>
                  <td>{_.id_anggota.id}</td>
                  <td>{_.id_buku.judul}</td>
                </tr>
              ))}
          </tbody>
        </table>
        {isPending && (
          <div className="mt-4 w-full justify-center">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        )}
      </div>

      <Pagination
        page={params.page}
        pageSize={params.pageSize}
        handlePageSize={handlePageSize}
        handlePage={handlePage}
        pagination={data?.pagination}
      />
      <div className="pb-2"></div>
    </div>
  );
};

export default PeminjamanList;
