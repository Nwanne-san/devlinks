'use client';
import React from 'react';
import Image from 'next/image';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase/config'; // Adjust path as needed
import { doc, setDoc } from 'firebase/firestore';
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
    confirmpassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], 'Passwords do not match')
      .required('Confirm Password is required'),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [createUserWithEmailAndPassword, , , firebaseError] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = async (data: FormData) => {
    try {
      const { email, password } = data;
      const userCredential = await createUserWithEmailAndPassword(
        email,
        password
      );

      if (userCredential) {
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          createdAt: new Date(),
        });
        toast.success('Sign-up successful! Redirecting to sign-in...');
        reset(); // Reset the form fields
        setTimeout(() => {
          window.location.href = '/login'; // Redirect after 3 seconds
        }, 3000);
      } else {
        toast.error('Sign-up failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Firebase error:', error);
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            toast.error('Invalid email address');
            break;
          case 'auth/weak-password':
            toast.error('Password should be at least 6 characters');
            break;
          case 'auth/email-already-in-use':
            toast.error('Email already in use');
            break;
          default:
            toast.error('An error occurred');
            break;
        }
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  return (
    <section className="w-screen mx-auto sm:h-screen flex flex-col sm:justify-center sm:items-center sm:bg-primary sm:py-0 pt-10">
      <div className="sm:pb-10 pb-5 sm:px-0 px-5">
        <Image src={logo} alt="logo" className="sm:w-full h-auto" priority />
      </div>

      <div className="border bg-white flex flex-col gap-2 sm:w-[476px] sm:h-auto sm:p-10 px-5 py-[2rem] rounded-md border-white">
        <h2 className="sm:text-[32px] text-2xl font-bold">Create account</h2>
        <h3 className="text-base text-gray">
          Let's get you started sharing your links!
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
                className={`text-base ${
                  errors.email
                    ? 'text-red border w-full rounded-md py-3 px-10 outline-none'
                    : 'border w-full rounded-md py-3 px-10 text-base text-primary focus:border-secondary focus:outline-none  focus:shadow-custom-shadow transition-shadow duration-300 focus:outline-[.2px]'
                }`}
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
              Create Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                className={`text-base ${
                  errors.password
                    ? 'text-red border w-full rounded-md py-3 px-10 outline-none'
                    : 'border w-full rounded-md py-3 px-10 text-base text-primary focus:border-secondary focus:outline-none   focus:shadow-custom-shadow transition-shadow duration-300'
                }`}
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
          <div>
            <label htmlFor="confirmpassword" className="text-xs text-primary">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmpassword"
                type="password"
                placeholder="At least 8 characters"
                className="border w-full rounded-md py-3 px-10 text-base text-primary  focus:shadow-custom-shadow transition-shadow focus:border-secondary focus:outline-none  focus:outline-[.2px] duration-300"
                {...register('confirmpassword')}
              />
              <p className="text-red text-xs absolute top-4 right-0 mx-5">
                {errors.confirmpassword?.message}
              </p>
              <Image
                src={lock}
                alt="lock"
                className="absolute top-4 mx-3 left-0"
              />
            </div>

            <p className="text-gray text-xs pt-5">
              Password must contain at least 8 characters
            </p>
          </div>
          <button
            type="submit"
            className="w-full border p-3 rounded-md mt-2 text-white bg-secondary hover:border-tertiary hover:bg-tertiary hover:shadow-custom-shadow transition-shadow duration-300"
          >
            Create new account
          </button>
        </form>

        <div className="text-center text-base mt-5">
          <h1 className="flex sm:flex-row justify-center items-center flex-col">
            Already have an account?&nbsp;
            <Link href={'/login'} className="text-secondary">
              Sign in
            </Link>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Signup;
