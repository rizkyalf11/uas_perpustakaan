/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function SkelBookCard() {
  return (
    <div className="flex h-80 flex-col overflow-hidden rounded-md border bg-putih1 shadow-md">
      <div className={`h-[70%] w-full overflow-hidden bg-gray-300 animate-pulse`}>
        {/* <img src={cover} alt={judul} height="100%" /> */}
      </div>
      <div className="h-[30%] w-full p-2">
        <div className="flex items-center justify-between">
          {/* <p className="text-lg font-semibold">{judul}</p> */}

          {/* <p className="text-sm text-gray-400">{tahun_terbit}</p> */}
        </div>
        {/* <p className="text-sm text-gray-600">Pengarang {pengarang}</p> */}
        {/* <p className="text-sm text-gray-400">Tersedia {jumlah_kopi}</p> */}
      </div>
    </div>
  );
}
