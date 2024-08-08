'use client';

import { FC, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { auth, db } from '@/app/firebase/config';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast, { Toaster } from 'react-hot-toast';
import github from '../../../public/assets/github2.svg';
import youtube from '../../../public/assets/youtube2.svg';
import facebook from '../../../public/assets/facebook.svg';
import linkedin from '../../../public/assets/linkedin2.svg';
import ArrowRight from '../../../public/assets/arrow-right.svg';

interface Link {
  platform: string;
  url: string;
}

const platformImages: Record<string, string> = {
  GitHub: github,
  LinkedIn: linkedin,
  YouTube: youtube,
  Facebook: facebook,
};

const platformColors: Record<string, string> = {
  GitHub: '#1A1A1A',
  LinkedIn: '#2D68FF',
  YouTube: '#EE3939',
  Facebook: '#4267B2',
};

const PreviewPage: FC = () => {
  const [user] = useAuthState(auth);
  const { userId } = useParams();
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePicture?: string;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const profileDocRef = doc(db, 'profiles', userId || '');
          const profileDocSnap = await getDoc(profileDocRef);

          if (profileDocSnap.exists()) {
            const profileData = profileDocSnap.data() as {
              firstName?: string;
              lastName?: string;
              email?: string;
              imageUrl?: string;
            };
            setProfileData(profileData);
            setProfilePicture(profileData.imageUrl || null);
            setEmail(profileData.email || null);
          }

          // Fetch links data
          const linksQuery = query(
            collection(db, 'links'),
            where('userId', '==', userId || '')
          );
          const linksQuerySnapshot = await getDocs(linksQuery);
          const linksData = linksQuerySnapshot.docs.map(
            (doc) => doc.data() as { platform: string; url: string }
          );
          setLinks(linksData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, [user, userId]);

  const handleShareLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success('Link copied successfully to clipboard', {
        duration: 3000,
        position: 'bottom-center',
        style: { backgroundColor: 'black', color: 'white' },
      });
    } catch (error) {
      toast.error('Failed to copy link', {
        duration: 3000,
        position: 'bottom-center',
        style: { backgroundColor: 'red', color: 'white' },
      });
    }
  };

  if (!user || user.uid !== userId) {
    return (
      <div className="text-center flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-700 mt-4 text-xl">
          You do not have access to this page.
        </p>
      </div>
    );
  }

  return (
    <div className="relative bg-white sm:bg-primary min-h-screen w-full">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="relative flex flex-col gap-[60px] lg:gap-[106px] sm:gap-[126px] z-10">
        <div className="w-full top-0 sm:px-6 sm:py-4">
          <nav className="px-6 py-4 rounded-xl bg-white w-full flex justify-center gap-4 sm:gap-0 sm:justify-between items-center">
            <Link href="/" legacyBehavior className="w-full">
              <a className="rounded-lg whitespace-nowrap text-secondary sm:w-fit w-fill text-center border border-secondary bg-white px-[27px] py-[11px]">
                Back to Editor
              </a>
            </Link>
            <button
              onClick={handleShareLink}
              className="rounded-lg whitespace-nowrap text-white border sm:w-fit w-fit border-secondary bg-secondary px-[40.5px] sm:px-[27px] py-[11px]"
            >
              Share Link
            </button>
          </nav>
        </div>
        <div className="w-full flex justify-center items-center">
          <div className="h-fit sm:w-[307px] w-[237px] rounded-3xl bg-white flex flex-col py-12 gap-14 items-center">
            <div className="flex flex-col gap-[25px] items-center">
              {profilePicture ? (
                <div className="relative">
                  <Image
                    src={profilePicture}
                    alt="Profile Picture"
                    priority
                    className="w-[7rem] h-[7rem] rounded-full border-4 border-secondary object-cover"
                    width={100}
                    height={100}
                  />
                </div>
              ) : (
                <div className="rounded-full w-[7rem] h-[7rem] content-none bg-dark mx-[5rem] top-[4rem] left-0" />
              )}
              <div className="flex flex-col gap-[13px] items-center">
                {profileData.firstName && profileData.lastName && (
                  <div className="text-dark-gray text-sm mt-2">
                    {profileData.firstName} {profileData.lastName}
                  </div>
                )}
                {email && (
                  <div className="text-dark-gray text-sm mt-2">{email}</div>
                )}
              </div>
            </div>
            <div className="flex gap-[20px] w-full sm:px-14 flex-col top-[16.5rem] left-0 mx-9">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="rounded-md h-11 w-full flex items-center pl-4 pr-5 py-4 gap-2 justify-between text-white"
                  style={{ backgroundColor: platformColors[link.platform] }}
                >
                  <div className="flex gap-2 items-center">
                    <Image
                      src={platformImages[link.platform]}
                      alt={link.platform}
                      width={20}
                      height={20}
                    />
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white"
                    >
                      {link.platform}
                    </a>
                  </div>
                  <Image src={ArrowRight} alt="arrow" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="sm:flex flex-col gap-[106px] hidden h-[357px] absolute top-0 z-0 p-6 bg-secondary w-full rounded-b-[32px]"></div>
    </div>
  );
};

export default PreviewPage;
