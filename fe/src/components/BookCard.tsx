/* eslint-disable @next/next/no-img-element */
import React from "react";

interface Props {
  cover: string;
  judul: string;
  tahun_terbit: number;
  jumlah_kopi: number;
  pengarang: string;
}

export default function BookCard({
  cover,
  judul,
  pengarang,
  tahun_terbit,
  jumlah_kopi,
}: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border bg-putih1 shadow-md">
      <div className="h-[140px] w-full overflow-hidden bg-black">
        <img src={cover} alt={judul} className="object-cover h-full w-full" />
      </div>
      <div className="h-[85px] w-full p-2">
        <div className="flex items-center justify-between">
          <p className="text-md font-semibold">{judul}</p>

          <p className="text-xs text-gray-400">{tahun_terbit}</p>
        </div>
        <p className="text-xs text-gray-600"><span className="text-gray-500">Pengarang</span> {pengarang}</p>
        <p className="text-xs text-gray-400">Tersedia {jumlah_kopi}</p>
      </div>
    </div>
  );
}
