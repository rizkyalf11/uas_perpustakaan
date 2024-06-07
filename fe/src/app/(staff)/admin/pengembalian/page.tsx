"use client";
import * as yup from "yup";
import useAdminModule from "../lib";
import { CreatePengembalian } from "../interface";
import { Form, FormikProvider, useFormik } from "formik";
import { useIdStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const createPengembalianSchema = yup.object().shape({
  tanggal_pengembalian: yup
    .string()
    .default(() => new Date().toISOString().split("T")[0])
    .nullable()
    .required(),
  peminjaman_id: yup.number().default(undefined).nullable().required(),
});

export default function Pengembalian() {
  const { useCreatePengembalian } = useAdminModule();
  const { isPending, mutate } = useCreatePengembalian();
  const router = useRouter();

  const { setIsSelectPEMINJAMAN, peminjaman } = useIdStore();


  const formik = useFormik<CreatePengembalian>({
    initialValues: createPengembalianSchema.getDefault(),
    validationSchema: createPengembalianSchema,
    enableReinitialize: true,
    onSubmit: (val) => {
      mutate(val);
    },
  });

  const { handleSubmit, setFieldValue, values } = formik;

  useEffect(() => {
    if (peminjaman) {
      setFieldValue("peminjaman_id", peminjaman);
    }
  }, [peminjaman, setFieldValue]);

  return (
    <div className="h-screen w-full  overflow-y-auto bg-putih1 pl-[230px] pr-4 pt-6">
      <h1 className="mb-4 text-2xl font-semibold">Pengembalian</h1>

      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex w-full flex-col gap-4">
            <div className="flex h-32 w-full flex-col">
              <span className="label-text mb-2">
                Peminjaman ID<span className="text-red-500">*</span>
              </span>
              <div
                onClick={() => {
                  setIsSelectPEMINJAMAN(true);
                  router.push("/admin/peminjamanlist");
                }}
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
              >
                {peminjaman != undefined && (
                  <h3 className="text-md text-black">
                    {peminjaman != undefined && `ID PEMINJAMAN: ${peminjaman}`}
                  </h3>
                )}
                {peminjaman == undefined && (
                  <span className="mt-2 text-sm text-gray-500">
                    Select Peminjaman
                  </span>
                )}
              </div>
            </div>

            <label className="form-control w-full" htmlFor="judul">
              <div className="label">
                <span className="label-text">Tanggal Kembali</span>
              </div>
              <input
                id="tanggal_pengembalian"
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                name="tanggal_pengembalian"
                value={values.tanggal_pengembalian}
              />
            </label>
            
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="btn mb-4 mt-4 flex bg-biru1 text-putih1 hover:bg-biru2 disabled:bg-gray-400"
          >
            Submit
          </button>
        </Form>
      </FormikProvider>
    </div>
  );
}
