/* eslint-disable prettier/prettier */
'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';
export default function Client({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbar =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.match(/^\/[^/]+\/preview$/);
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
