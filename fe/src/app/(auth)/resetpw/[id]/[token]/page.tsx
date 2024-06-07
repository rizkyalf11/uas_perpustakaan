"use client"
import useAuthModule from '@/app/(auth)/lib';
import { Form, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';

const resetPwSchema = yup.object().shape({
  new_password: yup.string().required().default("").nullable().min(8),
});

export default function ResetPw({ params }: { params: { id: string, token: string } }) {
  const { useResetPw } = useAuthModule();
  const { isPending, mutate } = useResetPw();

  const formik = useFormik<{new_password: string}>({
    initialValues: resetPwSchema.getDefault(),
    validationSchema: resetPwSchema,
    enableReinitialize: true,
    onSubmit: (payload) => {
      mutate({
        id: params.id,
        token: params.token,
        new_password: payload.new_password
      });
    },
  });

  const { values, handleChange } = formik;

  return (
    <div className="mx-auto mt-24 max-w-md overflow-hidden px-8">
      <h1 className="mb-4 text-3xl font-bold">Lupa Password</h1>

      <div className="bg-blue-200 mb-4 h-32 w-full rounded-md bg-[url('/img/liblary.jpg')] bg-cover bg-center"></div>

      <FormikProvider value={formik}>
        <Form className="flex flex-col gap-2">
          <label htmlFor="password">
            New Password<span className="text-red-500">*</span>
            <input
            name='new_password'
              type="password"
              id="password"
              placeholder="***********"
              className="input input-bordered mt-1 w-full"
              value={values.new_password}
              onChange={handleChange}
            />
          </label>
          <button
            type="submit"
            className="btn mt-4 bg-biru1 text-putih1 hover:bg-biru2 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500"
            disabled={isPending}
          >
            Reset Password
          </button>
        </Form>
      </FormikProvider>
    </div>
  )
}
