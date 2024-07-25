'use client';

import Image from 'next/image';
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config';
import { signOut } from 'firebase/auth';

import logo from '../../../public/assets/logo.svg';
import logo2 from '../../../public/assets/logo_2.svg';
import link from '../../../public/assets/link.svg';
import eye from '../../../public/assets/eye.svg';
import link2 from '../../../public/assets/link_2.svg';
import profile from '../../../public/assets/profile.svg';
import profile2 from '../../../public/assets/profile_2.svg';
import Link from 'next/link';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  const isLinkActive = pathname === '/';
  const isProfileActive = pathname === '/profile';

  useEffect(() => {
    if (user) {
      const timeout = setTimeout(
        () => {
          signOut(auth)
            .then(() => {
              router.push('/login');
            })
            .catch((error) => {
              console.error('Sign-out error:', error);
            });
        },
        30 * 60 * 1000
      ); // 30 minutes

      return () => clearTimeout(timeout);
    }
  }, [user, router]);

  const handleNavigation = (path: string) => {
    if ((path === '/profile' || path === '/preview') && !user) {
      router.push('/login');
      return;
    }
    router.push(path);
  };

  return (
    <section className="w-full bg-primary sm:px-10 px-8 py-5">
      <div className="flex justify-between bg-white sm:px-3 px-3 py-2 rounded-xl">
        <Link href={'/'}>
          <Image
            src={logo}
            alt="logo"
            className="w-40 h-auto sm:block hidden"
          />
          <Image src={logo2} alt="logo" className="sm:hidden block" />
        </Link>

        <div className="flex gap-6">
          <div
            className={`flex items-center gap-1 ${
              isLinkActive
                ? 'border-2 border-purple bg-purple text-secondary py-1 px-4 rounded-md font-semibold'
                : 'text-gray text-base font-semibold'
            }`}
            onClick={() => handleNavigation('/')}
          >
            <Image
              src={isLinkActive ? link : link2}
              alt="link"
              className="w-5"
            />
            <h1 className="sm:block hidden cursor-pointer">Links</h1>
          </div>

          {user && (
            <div
              className={`flex items-center gap-1 ${
                isProfileActive
                  ? 'border-2 border-purple bg-purple text-secondary py-1 px-4 rounded-md font-semibold'
                  : 'text-gray text-base font-semibold'
              }`}
              onClick={() => handleNavigation('/profile')}
            >
              <Image
                src={isProfileActive ? profile : profile2}
                alt="profile"
                className="w-5"
              />
              <h1 className="sm:block hidden cursor-pointer">
                Profile Details
              </h1>
            </div>
          )}
        </div>

        <Link href={'/preview'}>
          <button className="border-secondary border px-5 py-1.5 rounded-md text-secondary font-semibold sm:block hidden">
            Preview
          </button>
          <Image
            src={eye}
            alt="eye"
            className="sm:hidden block border border-secondary px-3.5 py-2 w-[3rem] rounded "
          />
        </Link>
      </div>
    </section>
  );
};

export default Navbar;
