'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';

export default function Client({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Hide Navbar on specific static routes
  const hideNavbar = pathname === '/login' || pathname === '/register' || pathname.startsWith('/preview');

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
