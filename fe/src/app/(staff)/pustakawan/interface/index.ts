import { BaseResponsePagination, BaseResponseSuccess } from "@/lib/axiosClient";

export interface Book {
  id: number;
  judul: string;
  pengarang: string;
  tahun_terbit: number | undefined;
  jumlah_kopi: number | undefined;
  cover: string;
  created_by: { id: number, nama: string };
  updated_by: { id: number, nama: string } | null;
}

export interface BookListResponse extends BaseResponsePagination {
  data: Book[];
}

export interface BookResponse extends BaseResponseSuccess {
  data: Book;
}

export interface BookListFilter extends Partial<Book> {
  dari_tahun_terbit?: string;
  sampai_tahun_terbit?: string;
  page: number;
  pageSize: number;
}

export interface BookCreatePayload extends Pick<Book, 'cover' | 'judul' | 'jumlah_kopi' | 'pengarang' | 'tahun_terbit'> {
  file?: File
}

export interface BookUpdatePayload extends Pick<Book, 'cover' | 'judul' | 'jumlah_kopi' | 'pengarang' | 'tahun_terbit' | 'id'> {
  file?: File
}

export interface BookCreateArrayPayload {
  data: BookCreatePayload[];
}