"use client"

import useAnggotaModule from "../lib"

export default function Pengembalian() {
  const { useListHistoryPinjaman  } = useAnggotaModule();
  const { data, isPending } = useListHistoryPinjaman();

  return (
    <div>
      <p className="mt-5 text-xl font-semibold">Data Pinjaman</p>
      
      <div className="mt-2 min-h-[500px] overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Buku</th>
              <th>tgl_kembali</th>
              <th>di-kembalikan</th>
              <th>denda</th>
            </tr>
          </thead>
          <tbody>
            {!isPending &&
              data?.data.map((_, i) => (
                <tr
                
                  key={i}
                >
                  <th>{i + 1}</th>
                  <td>{_.id}</td>
                  <td>{_.id_buku.judul}</td>
                  <td>{_.tanggal_kembali}</td>
                  <td className={`${_.pengembalian.denda != null && 'text-red-500'}`}>{_.pengembalian.tanggal_pengembalian}</td>
                  <td>{_.pengembalian.denda}</td>
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
    </div>
  )
}
