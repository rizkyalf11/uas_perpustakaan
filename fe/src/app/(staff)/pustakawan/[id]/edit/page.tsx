"use client";
import React, { useState } from "react";
import usePustakawanModule from "../../lib";
import { Form, FormikProvider, useFormik } from "formik";
import { BookUpdatePayload } from "../../interface";
import { BookCreateSchema } from "../../create-buku/page";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function EditPage({ params }: { params: { id: string } }) {
  const { useDetailBook, useUpdateBook } = usePustakawanModule();
  const { data, isPending } = useDetailBook(Number(params.id));
  const { isPending: isPUpdate, mutate } = useUpdateBook(params.id);
  const [fileName, setFileName] = useState("");

  const formik = useFormik<BookUpdatePayload>({
    initialValues: {
      cover: data?.data.cover || "",
      judul: data?.data.judul || "",
      pengarang: data?.data.pengarang || "",
      jumlah_kopi: data?.data.jumlah_kopi,
      tahun_terbit: data?.data.tahun_terbit,
      id: data?.data.id || 0,
    },
    validationSchema: BookCreateSchema,
    enableReinitialize: true,
    onSubmit: (val) => {
      mutate(val);
    },
  });

  const { handleChange, handleSubmit, setFieldValue, values } = formik;

  return (
    <div className="h-screen w-full  overflow-y-auto bg-putih1 pl-[230px] pr-4 pt-6">
      <h1 className="mb-2 text-2xl font-semibold">Update Data Buku</h1>

      {isPending ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        <FormikProvider value={formik}>
          <Form onSubmit={handleSubmit} className="flex flex-col">
            <label className="form-control w-full" htmlFor="judul">
              <div className="label">
                <span className="label-text">
                  Judul<span className="text-red-500">*</span>
                </span>
              </div>
              <input
                id="judul"
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                name="judul"
                value={values.judul}
                onChange={handleChange}
              />
            </label>
            <label className="form-control w-full" htmlFor="pengarang">
              <div className="label">
                <span className="label-text">
                  Pengarang<span className="text-red-500">*</span>
                </span>
              </div>
              <input
                id="pengarang"
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                name="pengarang"
                value={values.pengarang}
                onChange={handleChange}
              />
            </label>
            <label className="form-control w-full" htmlFor="tahun_terbit">
              <div className="label">
                <span className="label-text">
                  Tahun Terbit<span className="text-red-500">*</span>
                </span>
              </div>
              <input
                id="tahun_terbit"
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                name="tahun_terbit"
                value={values.tahun_terbit}
                onChange={handleChange}
              />
            </label>
            <label className="form-control w-full" htmlFor="jumlah_kopi">
              <div className="label">
                <span className="label-text">
                  Jumlah Kopi<span className="text-red-500">*</span>
                </span>
              </div>
              <input
                id="jumlah_kopi"
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                name="jumlah_kopi"
                value={values.jumlah_kopi}
                onChange={handleChange}
              />
            </label>
            <label
              htmlFor="cover"
              className="mt-4 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
            >
              <IoCloudUploadOutline className="text-4xl text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">
                {values.cover ? values.cover : "Click to select"}
              </span>
              <input
                id="cover"
                name="cover"
                type="file"
                className="hidden"
                onChange={(event: any) => {
                  const file = event.target.files[0];

                  if (file) {
                    setFileName(file.name);
                    let reader = new FileReader();
                    reader.onloadend = () => {
                      setFieldValue(`cover`, file.name);
                    };
                    reader.readAsDataURL(file);
                    setFieldValue(`file`, file);
                  } else {
                    setFileName("");
                  }
                }}
              />
            </label>

            <button
              disabled={isPUpdate}
              className="btn mb-4 mt-4 bg-biru1 text-putih1 hover:bg-biru2 disabled:bg-gray-400"
            >
              Update
            </button>
          </Form>
        </FormikProvider>
      )}
    </div>
  );
}
