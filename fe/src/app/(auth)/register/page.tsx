"use client";
import Link from "next/link";
import * as yup from "yup";
import useAuthModule from "../lib";
import { Form, FormikProvider, useFormik } from "formik";
import { RegisterPayload } from "../interface";
import toast from "react-hot-toast";
import LoadingScreen from "@/components/LoadingScreen";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const registerSchema = yup.object().shape({
  nama: yup.string().required().default("").nullable(),
  alamat: yup.string().required().default("").nullable(),
  email: yup.string().required().default("").nullable(),
  password: yup.string().required().default("").nullable().min(8),
  confirm_password: yup.string().required().default("").nullable(),
});

export default function Register() {
  const { useRegister } = useAuthModule();
  const { isPending, mutate } = useRegister();
  const { data: session, status } = useSession();
  const router = useRouter();

  const formik = useFormik<RegisterPayload>({
    initialValues: registerSchema.getDefault(),
    validationSchema: registerSchema,
    enableReinitialize: true,
    onSubmit: (payload) => {
      if (payload.password !== payload.confirm_password) {
        toast.error("Confirm Password beda!");
      } else {
        mutate({
          nama: payload.nama,
          alamat: payload.alamat,
          email: payload.email,
          password: payload.password,
        });
      }
    },
  });

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (status == "loading") {
    return <LoadingScreen />;
  }

  const { values, handleChange } = formik;

  return (
    <div className="mx-auto mt-20 max-w-md overflow-hidden px-8">
      <h1 className="mb-4 text-3xl font-bold">Register</h1>

      <div className="bg-blue-200 mb-4 h-32 w-full rounded-md bg-[url('/img/liblary.jpg')] bg-cover bg-center"></div>

      <FormikProvider value={formik}>
        <Form className="flex flex-col gap-2">
          <label htmlFor="nama">
            Nama<span className="text-red-500">*</span>
            <input
              type="text"
              id="nama"
              name="nama"
              placeholder="faisal"
              className="input input-bordered mt-1 w-full"
              value={values.nama}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="alamat">
            Alamat<span className="text-red-500">*</span>
            <input
              type="text"
              id="alamat"
              name="alamat"
              placeholder="Bekasi"
              className="input input-bordered mt-1 w-full"
              value={values.alamat}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="email">
            Email<span className="text-red-500">*</span>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="faisal@gmail.com"
              className="input input-bordered mt-1 w-full"
              value={values.email}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="password">
            Password<span className="text-red-500">*</span>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="*********"
              className="input input-bordered mt-1 w-full"
              value={values.password}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="confirm_password">
            Confirm Password<span className="text-red-500">*</span>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              placeholder="*********"
              className="input input-bordered mt-1 w-full"
              value={values.confirm_password}
              onChange={handleChange}
            />
          </label>
          <button
            type="submit"
            className="btn mt-4 bg-biru1 text-putih1 hover:bg-biru2 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500"
            disabled={isPending}
          >
            Register
          </button>
        </Form>
      </FormikProvider>

      <p className="mt-2 text-center">
        Sudah punya akun?{" "}
        <Link href="/login" className="underline">
          Login
        </Link>
      </p>
    </div>
  );
}
