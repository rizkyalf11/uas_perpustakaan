"use client";
import React, { useState } from "react";
import * as yup from "yup";
import { BookCreateArrayPayload } from "../interface";
import usePustakawanModule from "../lib";
import {
  ArrayHelpers,
  FieldArray,
  Form,
  FormikProvider,
  useFormik,
} from "formik";
import {
  IoAddOutline,
  IoCloudUploadOutline,
  IoTrashOutline,
} from "react-icons/io5";

export const BookCreateSchema = yup.object().shape({
  judul: yup.string().default("").nullable().required(""),
  pengarang: yup.string().default("").nullable().required(""),
  cover: yup
    .string()
    .default("")
    .nullable()
    .required(""),
  jumlah_kopi: yup.number().default(undefined).nullable().required(""),
  tahun_terbit: yup.number().default(undefined).nullable().required(""),
});

const defaultArr: BookCreateArrayPayload = {
  data: [
    {
      judul: "",
      pengarang: "",
      tahun_terbit: undefined,
      jumlah_kopi: undefined,
      cover: "",
    },
  ],
};

const BookCreateArraySchema = yup
  .object()
  .shape({
    data: yup.array().of(BookCreateSchema),
  })
  .default(defaultArr);

export default function CreateBuku() {
  const { useCreateBook } = usePustakawanModule();
  const { mutate, isPending } = useCreateBook();
  const [fileName, setFileName] = useState("");

  const formik = useFormik<BookCreateArrayPayload>({
    initialValues: BookCreateArraySchema.getDefault(),
    validationSchema: BookCreateArraySchema,
    enableReinitialize: true,
    onSubmit: (val) => {
      mutate(val);
    },
  });

  const {
    handleChange,
    handleSubmit,
    setFieldValue,
    values,
  } = formik;

  return (
    <div className="h-screen w-full  overflow-y-auto bg-putih1 pl-[230px] pr-4 pt-6">
      <h1 className="text-2xl font-semibold">Tambah Data Buku</h1>

      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit} className="flex flex-col">
          <FieldArray
            name="data"
            render={(arrHelp: ArrayHelpers) => (
              <>
                {values &&
                  values.data.map((item, i) => (
                    <section key={i} className="border mt-4 shadow-sm p-1">
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
                          name={`data[${i}]judul`}
                          value={item.judul}
                          onChange={handleChange}
                        />
                      </label>
                      <label
                        className="form-control w-full"
                        htmlFor="pengarang"
                      >
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
                          name={`data[${i}]pengarang`}
                          value={item.pengarang}
                          onChange={handleChange}
                        />
                      </label>
                      <label
                        className="form-control w-full"
                        htmlFor="tahun_terbit"
                      >
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
                          name={`data[${i}]tahun_terbit`}
                          value={item.tahun_terbit}
                          onChange={handleChange}
                        />
                      </label>
                      <label
                        className="form-control w-full"
                        htmlFor="jumlah_kopi"
                      >
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
                          name={`data[${i}]jumlah_kopi`}
                          value={item.jumlah_kopi}
                          onChange={handleChange}
                        />
                      </label>
                      <label
                        htmlFor="cover"
                        className="mt-4 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                      >

                        <IoCloudUploadOutline className="text-4xl text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">
                          {item.cover
                            ? item.cover
                            : "Click to select"}
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
                                setFieldValue(`data[${i}]cover`, file.name);
                              };
                              reader.readAsDataURL(file);
                              setFieldValue(`data[${i}]file`, file);
                            } else {
                              setFileName("");
                            }
                          }}
                        />
                      </label>

                      <div>
                        <button onClick={() => arrHelp.pop()} className="mt-2 rounded-md bg-red-500 p-1 text-putih1 hover:bg-red-600">
                          <IoTrashOutline />
                        </button>
                      </div>
                    </section>
                  ))}

                <div>
                  <button onClick={() => arrHelp.push(BookCreateSchema.getDefault())} className="mt-2 rounded-md bg-biru1 p-1 text-putih1 hover:bg-biru2">
                    <IoAddOutline />
                  </button>
                </div>
              </>
            )}
          />

          <button className="btn mb-4 mt-4 bg-biru1 text-putih1 hover:bg-biru2">
            Tambah
          </button>
        </Form>
      </FormikProvider>
    </div>
  );
}
