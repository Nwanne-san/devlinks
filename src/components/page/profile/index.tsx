'use client';
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import MainLayout from '../mainlayout';
import upload from '../../../../public/assets/upload.svg';
import { db, auth, storage } from '@/app/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast, Toaster } from 'react-hot-toast';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

const DesktopPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data() as FormData & {
            imageUrl?: string;
          };
          setValue('firstName', profileData.firstName);
          setValue('lastName', profileData.lastName);
          setValue('email', profileData.email);
          setProfilePicture(profileData.imageUrl || null);
          setFirstName(profileData.firstName || '');
          setLastName(profileData.lastName || '');
          setEmail(profileData.email || '');
        }
      };
      fetchProfile();
    }
  }, [user, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit = async (data: FormData) => {
    if (user) {
      try {
        let imageUrl: string | undefined;
        if (selectedFile) {
          const imageRef = ref(storage, `profile_images/${user.uid}`);
          await uploadBytes(imageRef, selectedFile);
          imageUrl = await getDownloadURL(imageRef);
        }

        await setDoc(doc(db, 'profiles', user.uid), {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          imageUrl,
        });

        // Update local state
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setProfilePicture(imageUrl || profilePicture);

        toast.success('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile.');
      }
    }
  };

  return (
    <div className="w-full flex bg-primary justify-center">
      <MainLayout
        profilePicture={profilePicture || undefined}
        // firstName={firstName}
        // lastName={lastName}
        // email={email}
        links={[]} // Pass your links here if you have any
      />
      <div className="border w-full mx-[10rem] mb-[5rem] py-[2rem] px-[2rem] bg-white border-white">
        <h1 className="text-black text-[32px] font-bold">Profile Details</h1>
        <h2 className="text-dark-gray">
          Add your details to create a personal touch to your profile
        </h2>
        <div className="flex border mt-[2rem] rounded-md border-primary bg-primary py-[2rem] px-[2rem] gap-[20rem] items-center">
          <h3 className="text-base text-dark-gray">Profile picture</h3>
          <div className="flex items-center gap-10">
            {profilePicture ? (
              <div className="relative">
                <Image
                  src={profilePicture}
                  alt="Profile Picture"
                  className="w-[20rem] h-[13rem] rounded-full object-cover"
                  width={100}
                  height={100}
                />
                <div
                  className="absolute top-0 right-0 bg-purple text-white rounded-full p-2 cursor-pointer"
                  onClick={handleUploadClick}
                >
                  <Image src={upload} alt="upload" width={20} height={20} />
                  <h4 className="text-secondary font-semibold">
                    + Upload Image
                  </h4>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept="image/png, image/jpeg"
                  />
                </div>
              </div>
            ) : (
              <div
                className="border border-purple bg-purple py-[3rem] px-[2rem] rounded-md flex flex-col items-center cursor-pointer"
                onClick={handleUploadClick}
              >
                <Image src={upload} alt="upload" />
                <h4 className="text-secondary font-semibold">+ Upload Image</h4>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept="image/png, image/jpeg"
                />
              </div>
            )}
            <h5 className="text-xs text-dark-gray">
              Image must be below 1024x1024px. <br /> Use PNG or JPG format.
            </h5>
          </div>
        </div>

        {selectedFile && (
          <div className="mt-4 text-dark-gray">
            <p>Selected file: {selectedFile.name}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border mt-[2rem] rounded-md border-primary py-[2rem] px-[2rem] flex flex-col gap-[1rem] bg-primary items-center">
            <div className="flex gap-[rem] w-full relative">
              <label
                htmlFor="firstName"
                className="w-full text-dark-gray text-base"
              >
                First name*
              </label>
              <input
                type="text"
                placeholder="e.g John"
                {...register('firstName', { required: "Can't be empty" })}
                className="w-full rounded-md py-2 border px-[2rem] border-light-gray text-base"
              />
              {errors.firstName && (
                <span className="text-red-500 absolute top-3 px-4 right-0 text-red text-xs">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="flex gap-[rem] w-full relative">
              <label
                htmlFor="lastName"
                className="w-full text-dark-gray text-base"
              >
                Last name*
              </label>
              <input
                type="text"
                placeholder="e.g Appleseed"
                {...register('lastName', { required: "Can't be empty" })}
                className="w-full rounded-md py-2 border px-[2rem] border-light-gray text-base"
              />
              {errors.lastName && (
                <span className="text-red-500 absolute top-3 right-0 px-4 text-red text-xs">
                  {errors.lastName.message}
                </span>
              )}
            </div>
            <div className="flex gap-[rem] w-full">
              <label
                htmlFor="email"
                className="w-full text-dark-gray text-base"
              >
                Email
              </label>
              <input
                type="text"
                placeholder="e.g email@example.com"
                {...register('email', {
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full rounded-md py-2 border px-[2rem] border-light-gray text-base"
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="text-right border py-2 px-7 mt-[5rem] ml-[54rem] border-t rounded-md text-white bg-secondary"
          >
            Save
          </button>
        </form>

        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </div>
  );
};

export default DesktopPage;
