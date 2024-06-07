"use client";
import LoadingScreen from "@/components/LoadingScreen";
import { signOut, useSession } from "next-auth/react";
import usePustakawanModule from "../(staff)/pustakawan/lib";
import BookCard from "@/components/BookCard";
import SkelBookCard from "@/components/SkelBookCard";
import { Pagination } from "@/components/Pagination";
import { useState } from "react";

export default function Anggota() {
  const { useListBook } = usePustakawanModule();
  const [isSearch, setIsSearch] = useState(false);
  const {
    data,
    handleClear,
    filterParams,
    setFilterParams,
    isPending
  } = useListBook();

  return (
    <main className="flex flex-col">
      <label className="input input-md input-bordered mt-8 flex items-center gap-2">
        <input
          value={filterParams.judul}
          onChange={(e) => {
            setFilterParams((params) => {
              return { ...params, judul: e.target.value };
            });
            setIsSearch(true);
            if (e.target.value == "") {
              handleClear();
              setIsSearch(false);
            }
          }}
          type="text"
          className="w-full"
          placeholder="judul"
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

      <div className="mt-4 grid grid-cols-2 gap-2">
        {data?.data != undefined
          ? data?.data.map((itm, i) => (
              <BookCard
                key={i}
                judul={itm.judul}
                pengarang={itm.pengarang}
                jumlah_kopi={itm.jumlah_kopi || 0}
                tahun_terbit={itm.tahun_terbit || 0}
                cover={itm.cover}
              />
            ))
          : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
              <SkelBookCard key={i} />
            ))}
      </div>

      {!isSearch && (
        <div className="join mt-4 grid grid-cols-2">
          <button
            onClick={() =>
              setFilterParams((prev) => {
                if (prev.page > 1) {

                  return {
                    ...prev,
                    page: prev.page - 1,
                  };
                }

                return prev;
              })
            }
            className="btn btn-outline join-item hover:bg-biru1 hover:text-putih1"
          >
            Previous page
          </button>
          <button
            onClick={() => {
              setFilterParams((prev) => {
                if (
                  data?.pagination?.totalPage &&
                  prev.page < data.pagination.totalPage
                ) {

                  return {
                    ...prev,
                    page: prev.page + 1,
                  };
                }

                return prev;
              });
            }}
            className="btn btn-outline join-item hover:bg-biru1 hover:text-putih1"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
