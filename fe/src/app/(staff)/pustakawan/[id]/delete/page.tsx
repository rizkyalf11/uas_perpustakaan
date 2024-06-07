"use client";
import { Form, FormikProvider, useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import usePustakawanModule from "../../lib";
import LoadingScreen from "@/components/LoadingScreen";
import { IoWarning, IoWarningOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const DeleteSchema = yup.object().shape({
  input: yup.string().default("").nullable(),
});

const DeletePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { useDetailBook, useDeleteBook } = usePustakawanModule();
  const { data, isPending } = useDetailBook(Number(params.id));
  const { mutate, isPending: isPDelete } = useDeleteBook();

  const formik = useFormik<{ input: string }>({
    initialValues: DeleteSchema.getDefault(),
    validationSchema: DeleteSchema,
    enableReinitialize: true,
    onSubmit: (val) => {
      console.log(data?.data.judul, "|||", val.input);
      if (val.input === data?.data.judul) {
        mutate(Number(params.id));
      } else {
        toast.error("Gagal Menghapus Buku!");
        router.push("/pustakawan");
      }
    },
  });

  const { handleChange, handleSubmit, values } = formik;

  return (
    <div className="h-screen w-full  overflow-y-auto bg-putih1 pl-[230px] pr-4 pt-6">
      <h1 className="text-2xl font-semibold mb-2">Hapus Data Buku</h1>

      {isPending ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        <FormikProvider value={formik}>
          <Form
            onSubmit={handleSubmit}
            className="flex flex-col items-center border p-1 shadow-sm"
          >
            <div className="mb-4 text-red-700">
              <IoWarningOutline size={32} />
            </div>
            <p className="mb-4 text-lg font-semibold">
              Tulis &quot;{data?.data.judul}&quot; untuk Konfirmasi
            </p>
            <label className="form-control w-full" htmlFor="judul">
              <input
                id="judul"
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                name="input"
                value={values.input}
                onChange={handleChange}
              />
            </label>
            <button
              disabled={isPDelete}
              className="mt-3 w-full rounded-md bg-red-500 px-3 py-1 text-putih1 hover:bg-red-600 disabled:bg-gray-400"
            >
              DELETE
            </button>
          </Form>
        </FormikProvider>
      )}
    </div>
  );
};

export default DeletePage;
