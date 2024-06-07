/* eslint-disable @next/next/no-img-element */
"use client";
import LoadingScreen from "@/components/LoadingScreen";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import usePustakawanModule from "./lib";
import { Pagination } from "@/components/Pagination";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import Drawer from "@/components/Drawer";
import Filter from "@/components/Filter";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Pustakawan() {
  const { data: session, status } = useSession();
  const { useListBook } = usePustakawanModule();
  const { data, isPending, params, handlePage, handlePageSize, setParams, handleFilter, handleClear, filterParams } = useListBook();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if(filterParams.judul != '' || filterParams.pengarang != '' || filterParams.dari_tahun_terbit != '' || filterParams.sampai_tahun_terbit != '') {
      setIsFilter(true)
    } else {
      setIsFilter(false)
    }

  }, [filterParams])

  if (status == "loading") {
    return <LoadingScreen />;
  }

  const startIndex = (params.page - 1) * params.pageSize;

  return (
    <div className="h-screen w-full  overflow-y-auto bg-putih1 pl-[230px] pr-4 pt-6">
      {/* <div className="flex min-h-screen flex-wrap gap-4">
        {data?.data != undefined
          ? data?.data.map((itm, i) => (
              <BookCard
                key={i}
                judul={itm.judul}
                pengarang={itm.pengarang}
                jumlah_kopi={itm.jumlah_kopi}
                tahun_terbit={itm.tahun_terbit}
                cover={itm.cover}
              />
            ))
          : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
              <SkelBookCard key={i} />
            ))}
      </div> */}

      <h1 className="text-2xl font-semibold mb-4">Data Buku</h1>

      <button onClick={() => setDrawerOpen(true)} className="rounded-md bg-biru1 px-3 py-1 text-putih1 hover:bg-biru2">
        Filter {isFilter && '✓'}
      </button>

      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} onSubmit={handleFilter} onClear={handleClear} >
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isPending && data?.data.map((_, i) => (
              <tr key={i}>
                <th>{startIndex + i + 1}</th>
                <td>{_.judul}</td>
                <td>{_.pengarang}</td>
                <td>{_.tahun_terbit}</td>
                <td>{_.jumlah_kopi}</td>
                <td><Link href={_.cover} className="underline" target="_blank">link</Link></td>
                <td>{_.created_by.nama}</td>
                <td>{_.updated_by?.nama ? _.updated_by?.nama : "-"}</td>
                <td>
                  <div className="flex gap-1">
                    <button onClick={() => router.push(`/pustakawan/${_.id}/edit`)} className="rounded-md bg-blue-500 p-1 text-white hover:bg-blue-600">
                      <IoPencilOutline />
                    </button>
                    <button onClick={() => router.push(`/pustakawan/${_.id}/delete`)} className="rounded-md bg-red-500 p-1 text-white hover:bg-red-600">
                      <IoTrashOutline />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isPending && (
          <div className="w-full justify-center mt-4">
            <span className="loading loading-spinner loading-sm"></span>  
          </div>
        ) }
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
