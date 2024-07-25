'use client';

import { useEffect, useState } from 'react';
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
import Preview from '@/components/Preview';
import Link from 'next/link';
import toast from 'react-hot-toast';

const PreviewOutput: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [links, setLinks] = useState<{ platform: string; url: string }[]>([]);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          // Fetch profile data
          const profileDocRef = doc(db, 'profiles', user.uid);
          const profileDocSnap = await getDoc(profileDocRef);

          if (profileDocSnap.exists()) {
            const profileData = profileDocSnap.data() as {
              imageUrl?: string;
              email?: string;
            };
            setProfilePicture(profileData.imageUrl || null);
            setEmail(profileData.email || null);
          }

          // Fetch links data
          const linksQuery = query(
            collection(db, 'links'),
            where('userId', '==', user.uid)
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
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-2 border-[#633CFF]"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin flex justify-center items-center rounded-full h-20 w-20 border-t-4 border-b-2 border-[#b32828]"></div>

        <p className="text-gray-700 mt-4">Please log in to continue.</p>

        <Link href="/login" legacyBehavior>
          <a className="text-[#b32828] underline mt-2 font-medium">
            Go to Login Page
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-auto flex flex-row bg-[#eee] gap-4">
      <div className="md:block flex-1 w-[33.33%] h-full">
        <Preview links={links} profilePicture={profilePicture} email={email} />
      </div>
    </div>
  );
};

export default PreviewOutput;
