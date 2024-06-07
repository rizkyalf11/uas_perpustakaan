"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { IoBookOutline, IoExitOutline, IoLayersOutline, IoListOutline, IoPeopleOutline, IoPerson } from "react-icons/io5";
import MenuButton from "./MenuButton";

export default function AdminDashboard() {
  const { data: session } = useSession();

  const menus = [
    {
      label: "Data Buku",
      path: "/admin",
      icon: IoListOutline,
    },
    {
      label: "Data Anggota",
      path: "/admin/anggota",
      icon: IoPeopleOutline,
      isDynamic: 4
    },
    {
      label: "Data Peminjaman",
      path: "/admin/peminjamanlist",
      icon: IoLayersOutline,
    },
    {
      label: "Data Pengembalian",
      path: "/admin/pengembalianlist",
      icon: IoLayersOutline,
    },
    {
      label: "Peminjaman",
      path: "/admin/peminjaman",
      icon: IoBookOutline,
    },
    {
      label: "Pengembalian",
      path: "/admin/pengembalian",
      icon: IoBookOutline,
    },
  ];

  return (
    <div className="fixed h-screen w-[210px] bg-putih1">
      <div className="flex h-full w-full flex-col rounded-md bg-putih2 ">
        <h1 className="pb-2 pl-4 pr-4 pt-4 text-2xl font-bold text-biru2">
          LibOnline📚
        </h1>

        <div className="mt-4 flex flex-grow flex-col items-start">
          {menus.map((item, i) => (
            <MenuButton
              Icon={item.icon}
              label={item.label}
              key={i}
              path={item.path}
              isDynamic={item.isDynamic}
            />
          ))}
        </div>

        <div className="flex justify-between items-center gap-1 pb-2 pl-4 pr-4">
          {session && (
            <button
              className="btn btn-sm bg-biru1 text-putih1 hover:bg-biru2"
              onClick={() => signOut()}
            >
              Logout
              <IoExitOutline />
            </button>
          )}
          <p className="flex items-center">
            <IoPerson />
            {session?.user.nama}
          </p>
        </div>
      </div>
    </div>
  );
}
