"use client";
import { Form, FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import { CreatePeminjaman } from "../interface";
import useAdminModule from "../lib";
import { useIdStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSocket } from "@/components/socketContext";

const getDatePlusDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

const createPeminjamanSchema = yup.object().shape({
  tanggal_pinjam: yup
    .string()
    .default(() => new Date().toISOString().split("T")[0])
    .nullable()
    .required(),
  tanggal_kembali: yup
    .string()
    .default(() => getDatePlusDays(3))
    .nullable()
    .required(),
  id_anggota: yup.number().default(undefined).nullable().required(),
  id_buku: yup.number().default(undefined).nullable().required(),
});

export default function Peminjaman() {
  const { useCreatePeminjaman } = useAdminModule();
  const { isPending, mutate } = useCreatePeminjaman();
  const router = useRouter();
  const { socket } = useSocket();

  const { book, anggota, setIsSelectBOOK, setIsSelectANGGOTA } = useIdStore();

  const formik = useFormik<CreatePeminjaman>({
    initialValues: createPeminjamanSchema.getDefault(),
    validationSchema: createPeminjamanSchema,
    enableReinitialize: true,
    onSubmit: (val) => {
      mutate(val);
      if(socket) {
        socket.emit('trigPeminjaman', {
          id_anggota: anggota?.id
        })
      }
    },
  });

  const { handleChange, handleSubmit, setFieldValue, values } = formik;

  useEffect(() => {
    if (book) {
      setFieldValue("id_buku", book.id);
    }
    if (anggota) {
      setFieldValue("id_anggota", anggota.id);
    }
  }, [book, setFieldValue, anggota]);

  return (
    <div className="h-screen w-full  overflow-y-auto bg-putih1 pl-[230px] pr-4 pt-6">
      <h1 className="mb-4 text-2xl font-semibold">Peminjaman</h1>

      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex w-full flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex h-32 w-full flex-col">
                <span className="label-text mb-2">
                  Buku<span className="text-red-500">*</span>
                </span>
                <div
                  onClick={() => {
                    setIsSelectBOOK(true);
                    router.push("/admin");
                  }}
                  className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                >
                  {book != undefined && (
                    <h3 className="text-md text-black">
                      {book != undefined && book.judul}
                    </h3>
                  )}
                  {book == undefined && (
                    <span className="mt-2 text-sm text-gray-500">
                      Select Book
                    </span>
                  )}
                </div>
              </div>
              <div className="flex h-32 w-full flex-col">
                <span className="label-text mb-2">
                  Anggota<span className="text-red-500">*</span>
                </span>
                <div
                  onClick={() => {
                    setIsSelectANGGOTA(true);
                    router.push("/admin/anggota");
                  }}
                  className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                >
                  {anggota != undefined && (
                    <h3 className="text-md text-black">
                      {anggota != undefined && anggota.email}
                    </h3>
                  )}
                  {anggota == undefined && (
                    <span className="mt-2 text-sm text-gray-500">
                      Select Anggota
                    </span>
                  )}
                </div>
              </div>
            </div>

            <label className="form-control w-full" htmlFor="judul">
              <div className="label">
                <span className="label-text">Tanggal Pinjam</span>
              </div>
              <input
                id="tanggal_pinjam"
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                name="tanggal_pinjam"
                value={values.tanggal_pinjam}
              />
            </label>
            <label className="form-control w-full" htmlFor="judul">
              <div className="label">
                <span className="label-text">
                  Tanggal Kembali<span className="text-red-500">*</span>
                </span>
              </div>
              <input
                id="tanggal_pinjam"
                type="date"
                placeholder="Type here"
                className="input input-bordered w-full"
                name="tanggal_kembali"
                value={values.tanggal_kembali}
                onChange={handleChange}
              />
            </label>
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="btn mb-4 mt-4 flex bg-biru1 text-putih1 hover:bg-biru2 disabled:bg-gray-400"
          >
            Pinjam
          </button>
        </Form>
      </FormikProvider>
    </div>
  );
}
