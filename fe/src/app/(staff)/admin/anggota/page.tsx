"use client";

import LoadingScreen from "@/components/LoadingScreen";
import useAdminModule from "../lib";
import { useSession } from "next-auth/react";
import { Pagination } from "@/components/Pagination";
import { useRouter } from "next/navigation";
import { useIdStore } from "@/store/useStore";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

export default function Anggota() {
  const { data: session, status } = useSession();
  const { useAnggotaList } = useAdminModule();
  const { isSelectANGGOTA, setIsSelectANGGOTA, setAnggota, setSelectedAnggota } = useIdStore();
  const router = useRouter();

  const {
    data,
    isPending,
    params,
    handlePage,
    handlePageSize,
    handleClear,
    filterParams,
    setFilterParams,
  } = useAnggotaList();

  if (status == "loading") {
    return <LoadingScreen />;
  }

  const startIndex = (params.page - 1) * params.pageSize;

  return (
    <div className="flex h-screen w-full flex-col  overflow-y-auto bg-putih1 pl-[230px] pr-4 pt-6">
      <h1 className="mb-4 text-2xl font-semibold">Data Anggota</h1>

      <label className="input input-md input-bordered flex items-center gap-2">
        <input
          value={filterParams.keyword}
          onChange={(e) => {
            setFilterParams((params) => {
              return { ...params, keyword: e.target.value };
            });
            if (e.target.value == "") {
              handleClear();
            }
          }}
          type="text"
          className="w-full"
          placeholder="Search"
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
              <th>Nama</th>
              <th>Email</th>
              <th>Alamat</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isPending &&
              data?.data.map((_, i) => (
                <tr
                  key={i}
                  className={`${isSelectANGGOTA && "cursor-pointer hover:bg-gray-200"} cursor-pointer`}
                  onClick={() => {
                    if (isSelectANGGOTA) {
                      router.push("/admin/peminjaman");
                      setIsSelectANGGOTA(false);
                      setAnggota({ id: _.id, email: _.email });
                    } else {
                      router.push(`/admin/anggota/${_.id}`)
                    }
                  }}
                >
                  <th>{startIndex + i + 1}</th>
                  <td>{_.nama}</td>
                  <td>{_.email}</td>
                  <td>{_.alamat}</td>
                  <td>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAnggota({ id: _.id, nama: _.nama });
                      router.push(`/admin/anggota/chat/${_.id}`)
                    }} className="bg-biru1 text-putih1 p-1 rounded-md hover:bg-biru2">
                      <IoChatbubbleEllipsesOutline />
                    </button>
                  </td>
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
