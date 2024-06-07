"use client";
import Link from "next/link";
import * as yup from "yup";
import useAuthModule from "../lib";
import { Form, FormikProvider, useFormik } from "formik";
import { LoginPayload } from "../interface";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/components/LoadingScreen";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const loginSchema = yup.object().shape({
  email: yup.string().required().default("").nullable(),
  password: yup.string().required().default("").nullable().min(8),
});

export default function Login() {
  const { useLogin } = useAuthModule();
  const { isPending, mutate } = useLogin();
  const { data: session, status } = useSession();
  const router = useRouter();

  const formik = useFormik<LoginPayload>({
    initialValues: loginSchema.getDefault(),
    validationSchema: loginSchema,
    enableReinitialize: true,
    onSubmit: (payload) => {
      mutate(payload);
    },
  });

  const { values, handleChange } = formik;

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (status == "loading") {
    return <LoadingScreen />;
  }

  return (
    <div className="mx-auto mt-24 max-w-md overflow-hidden px-8">
      <h1 className="mb-4 text-3xl font-bold">Login</h1>

      <div className="bg-blue-200 mb-4 h-32 w-full rounded-md bg-[url('/img/liblary.jpg')] bg-cover bg-center"></div>

      <FormikProvider value={formik}>
        <Form className="flex flex-col gap-2">
          <label htmlFor="email">
            Email<span className="text-red-500">*</span>
            <input
              type="email"
              id="email"
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
              placeholder="*********"
              className="input input-bordered mt-1 w-full"
              value={values.password}
              onChange={handleChange}
            />
          </label>
          <Link className="text-sm underline text-right" href='/lupapw'>Lupa Password?</Link>
          <button
            type="submit"
            className="btn mt-4 bg-biru1 text-putih1 hover:bg-biru2 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500"
            disabled={isPending}
          >
            Login
          </button>
        </Form>
      </FormikProvider>

      <p className="mt-2 text-center">
        Belum punya akun?{" "}
        <Link href="/register" className="underline">
          Register
        </Link>
      </p>
    </div>
  );
}
