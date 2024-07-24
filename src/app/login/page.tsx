'use client';
import React from 'react';
import Image from 'next/image';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

import logo from '../../../public/assets/logo.svg';
import lock from '../../../public/assets/lock.svg';
import mail from '../../../public/assets/mail.svg';
import Link from 'next/link';

const schema = yup
  .object({
    email: yup
      .string()
      .email('Invalid email address')
      .required(`Can't be empty`),
    password: yup
      .string()
      .required('Please check again')
      .min(4, 'Password cannot be less than 4 characters')
      .max(10, 'Password cannot be more than 10 characters'),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [signInWithEmailAndPassword, , , error] =
    useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await signInWithEmailAndPassword(data.email, data.password);
      if (res) {
        toast.success('Login successful!');
        reset(); // Reset form fields
        setTimeout(() => {
          router.push('/');
        }, 1000); // Redirect after 1 second
      }
    } catch (e: any) {
      console.error('Sign-in error:', e);
      if (e.code) {
        switch (e.code) {
          case 'auth/invalid-email':
            toast.error('Invalid email address');
            break;
          case 'auth/wrong-password':
            toast.error('Incorrect password');
            break;
          case 'auth/user-not-found':
            toast.error('User not found');
            break;
          default:
            toast.error('An unknown error occurred');
            break;
        }
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  return (
    <section className="w-screen mx-auto sm:h-screen flex flex-col sm:justify-center sm:items-center sm:bg-primary sm:py-0 pt-10">
      <div className="pb-5 sm:px-0 px-5">
        <Image src={logo} alt="logo" className="sm:w-full h-auto" priority />
      </div>

      <div className="border bg-white flex flex-col gap-2 sm:w-[476px] sm:h-[486px] sm:p-10 px-5 py-[3rem] rounded-md border-white">
        <h2 className="sm:text-[32px] text-2xl font-bold">Login</h2>
        <h3 className="text-base text-gray">
          Add your details below to get back into the{' '}
          <br className="sm:hidden block" /> app
        </h3>

        <form
          className="flex flex-col gap-4 pt-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="email"
              className={`text-xs ${errors.email ? 'text-red' : 'text-primary'}`}
            >
              Email address
            </label>
            <div className="relative">
              <input
                id="email"
                type="text"
                placeholder="e.g. alex@email.com"
                className={`text-base ${errors.email ? 'text-red border w-full rounded-md py-3 px-10 outline-none' : 'border w-full rounded-md py-3 px-10 text-base text-primary focus:border-secondary focus:outline-none focus:shadow-custom-shadow transition-shadow duration-300'}`}
                {...register('email')}
              />
              <p className="text-red text-xs absolute top-4 right-0 mx-5">
                {errors.email?.message}
              </p>
              <Image
                src={mail}
                alt="mail"
                className="absolute top-4 mx-3 left-0"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className={`text-xs ${errors.password ? 'text-red' : 'text-primary'}`}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className={`text-base ${errors.password ? 'text-red border w-full rounded-md py-3 px-10 outline-none' : 'border w-full rounded-md py-3 px-10 text-base text-primary focus:border-secondary focus:outline-none focus:shadow-custom-shadow transition-shadow duration-300'}`}
                {...register('password')}
              />
              <p className="text-red text-xs absolute top-4 right-0 mx-5">
                {errors.password?.message}
              </p>
              <Image
                src={lock}
                alt="lock"
                className="absolute top-4 mx-3 left-0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full border p-3 rounded-md mt-5 text-white bg-secondary hover:border-tertiary hover:bg-tertiary hover:shadow-custom-shadow transition-shadow duration-300"
          >
            Login
          </button>
        </form>

        <div className="text-center text-base mt-5">
          <h1 className="flex sm:flex-row justify-center items-center flex-col">
            Don't have an account?&nbsp;
            <Link href={'/register'} className="text-secondary">
              Create account
            </Link>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Login;
