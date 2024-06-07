"use client"
import * as yup from 'yup';
import useAuthModule from '../lib';
import { Form, FormikProvider, useFormik } from 'formik';
import Link from 'next/link';
import { IoArrowBack, IoArrowBackOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

const lupaPwSchema = yup.object().shape({
  email: yup.string().required().default("").nullable(),
});

export default function LupaPW() {
  const { useLupaPw } = useAuthModule();
  const { isPending, mutate } = useLupaPw();
  const router = useRouter();

  const formik = useFormik<{email: string}>({
    initialValues: lupaPwSchema.getDefault(),
    validationSchema: lupaPwSchema,
    enableReinitialize: true,
    onSubmit: (payload) => {
      mutate(payload);
    },
  });

  const { values, handleChange } = formik;
  
  return (
    <div className="mx-auto mt-24 max-w-md overflow-hidden px-8">
      <button className='mb-4' onClick={() => router.push('/login')}>
        <IoArrowBackOutline size={25} />
      </button>
      <h1 className="mb-4 text-3xl font-bold">Lupa Password</h1>

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
          <button
            type="submit"
            className="btn mt-4 bg-biru1 text-putih1 hover:bg-biru2 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500"
            disabled={isPending}
          >
            Send Email
          </button>
        </Form>
      </FormikProvider>
    </div>
  )
}
