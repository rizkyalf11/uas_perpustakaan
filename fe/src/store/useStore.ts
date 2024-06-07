// store/useStore.js
import create from "zustand";

interface typeState {
  isSelectBOOK: boolean;
  isSelectANGGOTA: boolean;
  isSelectPEMINJAMAN: boolean;
  book: { id: number; judul: string } | undefined;
  anggota: { id: number; email: string } | undefined;
  peminjaman: number | undefined;
  selectedAnggota: { id: number; nama: string } | undefined;
  setIsSelectBOOK: (ww: boolean) => void;
  setIsSelectANGGOTA: (ww: boolean) => void;
  setIsSelectPEMINJAMAN: (ww: boolean) => void;
  setBook: (payload: { id: number; judul: string } | undefined) => void;
  setAnggota: (payload: { id: number; email: string } | undefined) => void;
  setPeminjaman: (payload: number | undefined) => void;
  setSelectedAnggota: (
    payload: { id: number; nama: string } | undefined,
  ) => void;
}

export const useIdStore = create<typeState>((set) => ({
  isSelectBOOK: false,
  isSelectANGGOTA: false,
  isSelectPEMINJAMAN: false,
  book: undefined,
  anggota: undefined,
  peminjaman: undefined,
  selectedAnggota: undefined,
  setIsSelectBOOK: (ww: boolean) => set(() => ({ isSelectBOOK: ww })),
  setIsSelectANGGOTA: (ww: boolean) => set(() => ({ isSelectANGGOTA: ww })),
  setIsSelectPEMINJAMAN: (ww: boolean) =>
    set(() => ({ isSelectPEMINJAMAN: ww })),
  setBook: (payload: { id: number; judul: string } | undefined) =>
    set(() => ({ book: payload })),
  setAnggota: (payload: { id: number; email: string } | undefined) =>
    set(() => ({ anggota: payload })),
  setPeminjaman: (payload: number | undefined) =>
    set(() => ({ peminjaman: payload })),
  setSelectedAnggota: (payload: { id: number; nama: string } | undefined) =>
    set(() => ({ selectedAnggota: payload })),
}));
