"use client";

import LoadingScreen from "@/components/LoadingScreen";
import useAdminModule from "../../lib";
import { useSession } from "next-auth/react";
import { Pagination } from "@/components/Pagination";

export default function DetailAnggota({ params }: { params: { id: string } }) {
  const {
    useListPeminjamanDetail,
    useListPengembalianDetail,
    useAnggotaDetail,
  } = useAdminModule();
  const { data: session, status } = useSession();

  const { data: anggota, isPending: loadAnggota } = useAnggotaDetail(params.id);

  const {
    data: dataPeminjam,
    isPending: isPendingPeminjam,
    params: paramsPeminjam,
    handlePage: handlePagePeminjam,
    handlePageSize: handlePageSizePeminjam,
    handleClear: handleClearPeminjam,
    filterParams: filterParamsPeminjam,
    setFilterParams: setFilterParamsPeminjam,
  } = useListPeminjamanDetail(params.id);

  const {
    data,
    isPending,
    params: paramsPengembalian,
    handlePage,
    handlePageSize,
    handleClear,
    filterParams,
    setFilterParams,
  } = useListPengembalianDetail(params.id);

  const startIndexPeminjam =
    (paramsPeminjam.page - 1) * paramsPeminjam.pageSize;
  const startIndexPengembalian =
    (paramsPengembalian.page - 1) * paramsPengembalian.pageSize;

  if (status == "loading") {
    return <LoadingScreen />;
  }

  console.log(anggota);

  return (
    <div className="flex h-screen w-full flex-col  overflow-y-auto bg-putih1 pl-[230px] pr-4 pt-6">
      <h1 className="mb-6 text-2xl font-semibold">
        Data Anggota ({anggota?.data.nama})
        <span className="text-sm font-normal text-gray-400">
          {anggota?.data.email}
        </span>
      </h1>

      <p className="mb-2 font-medium">Pinjaman</p>
      <div className="min-h-[250px] overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Buku</th>
              <th>tgl_pinjam</th>
              <th>tgl_kembali</th>
            </tr>
          </thead>
          <tbody>
            {!isPendingPeminjam &&
              dataPeminjam?.data.map((_, i) => (
                <tr key={i}>
                  <th>{startIndexPeminjam + i + 1}</th>
                  <td>{_.id_buku.judul}</td>
                  <td>{_.tanggal_pinjam}</td>
                  <td className={
                      new Date().toISOString().split("T")[0] > _.tanggal_kembali 
                        ? "text-red-500"
                        : ""
                    }>{_.tanggal_kembali}</td>
                </tr>
              ))}
          </tbody>
        </table>
        {isPendingPeminjam && (
          <div className="mt-4 w-full justify-center">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        )}
      </div>

      <Pagination
        page={paramsPeminjam.page}
        pageSize={paramsPeminjam.pageSize}
        handlePageSize={handlePageSizePeminjam}
        handlePage={handlePagePeminjam}
        pagination={dataPeminjam?.pagination}
      />
      
      <p className="mb-2 mt-4 font-medium">Pengembalian</p>
      <div className="min-h-[250px] overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Buku</th>
              <th>tgl_pinjam</th>
              <th>tgl_kembali</th>
              <th>DI Kembalikan</th>
              <th>Denda</th>
            </tr>
          </thead>
          <tbody>
            {!isPending &&
              data?.data.map((_, i) => (
                <tr key={i}>
                  <th>{startIndexPeminjam + i + 1}</th>
                  <td>{_.peminjaman_id.id_buku.judul}</td>
                  <td>{_.peminjaman_id.tanggal_pinjam}</td>
                  <td>{_.peminjaman_id.tanggal_kembali}</td>
                  <td  className={
                      _.tanggal_pengembalian > _.peminjaman_id.tanggal_kembali 
                        ? "text-red-500"
                        : ""
                    }>{_.tanggal_pengembalian}</td>
                  <td>{_.denda}</td>
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
        page={paramsPengembalian.page}
        pageSize={paramsPengembalian.pageSize}
        handlePageSize={handlePageSize}
        handlePage={handlePage}
        pagination={data?.pagination}
      />
      <div className="mb-2"></div>
    </div>
  );
}
