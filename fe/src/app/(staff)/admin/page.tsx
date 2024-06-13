/* eslint-disable @next/next/no-img-element */
"use client";
import LoadingScreen from "@/components/LoadingScreen";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import usePustakawanModule from "../pustakawan/lib";
import { Pagination } from "@/components/Pagination";
import Drawer from "@/components/Drawer";
import Filter from "@/components/Filter";
import Link from "next/link";
import { useIdStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Admin() {
  const { data: session, status } = useSession();
  const { useListBook } = usePustakawanModule();
  const {
    data,
    isPending,
    params,
    handlePage,
    handlePageSize,
    setParams,
    handleFilter,
    handleClear,
    filterParams,
  } = useListBook();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const { isSelectBOOK, setIsSelectBOOK, setBook } = useIdStore();
  const router = useRouter();

  useEffect(() => {
    if (
      filterParams.judul != "" ||
      filterParams.pengarang != "" ||
      filterParams.dari_tahun_terbit != "" ||
      filterParams.sampai_tahun_terbit != ""
    ) {
      setIsFilter(true);
    } else {
      setIsFilter(false);
    }
  }, [filterParams]);

  if (status == "loading") {
    return <LoadingScreen />;
  }

  const startIndex = (params.page - 1) * params.pageSize;
  return (
    <div className="h-screen w-full  overflow-y-auto bg-putih1 pl-[230px] pr-4 pt-6">
      <h1 className="mb-4 text-2xl font-semibold">Data Buku</h1>

      <button
        onClick={() => setDrawerOpen(true)}
        className="rounded-md bg-biru1 px-3 py-1 text-putih1 hover:bg-biru2"
      >
        Filter {isFilter && "✓"}
      </button>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleFilter}
        onClear={handleClear}
      >
        <Filter params={params} setParams={setParams} />
      </Drawer>

      <div className="min-h-[500px] overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Judul</th>
              <th>Pengarang</th>
              <th>Tahun Terbit</th>
              <th>Jumah Kopi</th>
              <th>Cover</th>
              <th>Di Buat</th>
              <th>Di Update</th>
            </tr>
          </thead>
          <tbody>
            {!isPending &&
              data?.data.map((_, i) => (
                <tr
                  onClick={() => {
                    if (isSelectBOOK) {
                      if (_.jumlah_kopi != 0) {
                        router.push("/admin/peminjaman");
                        setIsSelectBOOK(false);
                        setBook({ id: _.id, judul: _.judul });
                      } else {
                        toast.error("Stok Habis");
                      }
                    }
                  }}
                  key={i}
                  className={`${isSelectBOOK && "cursor-pointer hover:bg-gray-200"}`}
                >
                  <th>{startIndex + i + 1}</th>
                  <td>{_.judul}</td>
                  <td>{_.pengarang}</td>
                  <td>{_.tahun_terbit}</td>
                  <td>{_.jumlah_kopi}</td>
                  <td>
                    <div className="h-20 w-20 bg-red-200">
                      <img
                        src={_.cover}
                        alt={_.judul}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td>{_.created_by.nama}</td>
                  <td>{_.updated_by?.nama ? _.updated_by?.nama : "-"}</td>
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
}
