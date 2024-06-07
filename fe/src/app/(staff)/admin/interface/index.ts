import { BaseResponsePagination, BaseResponseSuccess } from "@/lib/axiosClient";
import PeminjamanList from "../peminjamanlist/page";

interface Peminjaman {
  id: number;
  tanggal_pinjam: string;
  tanggal_kembali: string;
  id_anggota: number | undefined;
  id_buku: number | undefined;
}

export interface CreatePeminjaman
  extends Pick<
    Peminjaman,
    "tanggal_pinjam" | "tanggal_kembali" | "id_anggota" | "id_buku"
  > {}

// ANGGOTA
interface Anggota {
  id: number;
  nama: string;
  alamat: string;
  email: string;
}

export interface AnggotaListResponse extends BaseResponsePagination {
  data: Anggota[];
}

export interface AnggotaDetailResponse extends BaseResponseSuccess {
  data: Anggota;
}

export interface FindAnggota {
  page: number;
  pageSize: number;
  keyword: string;
}

// PEMINJAMAN LIST
export interface PeminjamanList {
  id: number;
  is_return: boolean;
  tanggal_pinjam: string;
  tanggal_kembali: string;
  created_at: Date;
  id_anggota: {
    id: number;
    nama: string;
    email: string;
  };
  id_buku: {
    id: number;
    judul: string;
  };
  pengembalian: {
    id: number;
    tanggal_pengembalian: string;
    denda: string
  }
}

export interface PeminjamListResponse extends BaseResponsePagination {
  data: PeminjamanList[];
}

export interface FindPeminjaman {
  page: number;
  pageSize: number;
  email: string;
}

// PENGEMBALIAN LIST
interface PengembalianList {
  id: number;
  tanggal_pengembalian: string;
  denda: null | string;
  created_at: Date;
  peminjaman_id: {
    id: number;
    tanggal_kembali: string;
    tanggal_pinjam: string;
    id_anggota: {
      id: number;
      nama: string;
      email: string;
    };
    id_buku: {
      id: number;
      judul: string;
    };
  };
}

export interface PengembalianListResponse extends BaseResponsePagination {
  data: PengembalianList[];
}

export interface FindPengembalian {
  page: number;
  pageSize: number;
  email: string;
}

export interface FindPengembalianDetail {
  page: number;
  pageSize: number;
}

export interface CreatePengembalian {
  tanggal_pengembalian: string;
  peminjaman_id: number | undefined;
}