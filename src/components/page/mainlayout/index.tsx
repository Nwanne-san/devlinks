'use client';
import { FC } from 'react';
import Image from 'next/image';
import innerShape from '../../../../public/assets/Rectangle 15.svg';
import outerShape from '../../../../public/assets/Subtract.svg';
import github from '../../../../public/assets/github2.svg';
import youtube from '../../../../public/assets/youtube2.svg';
import linkedin from '../../../../public/assets/linkedin2.svg';
import facebook from '../../../../public/assets/facebook.svg';
import arrow from '../../../../public/assets/arrow.svg';

interface MainLayoutProps {
  links: { platform: string; url: string }[];
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

const platformImages: Record<string, string> = {
  GitHub: github,
  LinkedIn: linkedin,
  YouTube: youtube,
  Facebook: facebook,
};

const MainLayout: FC<MainLayoutProps> = ({
  links = [],
  profilePicture,
  firstName,
  lastName,
  email,
}) => {
  const validLinks = links.filter(
    (link) => link.platform && platformImages[link.platform]
  );

  const boxes = new Array(5).fill(null);

  return (
    <div className="py-[7rem] px-[5rem] lg:block hidden">
      <div className="h-[631px] w-[307px] relative">
        <Image
          className="absolute top-0 left-0"
          style={{ width: '90%', height: 'auto' }}
          alt="inner shape"
          src={innerShape}
        />
        <Image
          src={outerShape}
          alt="outer"
          className="w-[16rem] absolute top-3 mx-2.5"
        />
        <div>
          <div className="rounded-full w-[7rem] h-[7rem] content-none bg-dark mx-[5rem] top-[4rem] absolute left-0">
            {profilePicture && (
              <Image
                src={profilePicture}
                alt="Profile Picture"
                className="rounded-full"
                layout="fill"
              />
            )}
          </div>
          {!firstName && !lastName && (
            <>
              <div className="w-[10rem] top-[12rem] mx-[3.6rem] absolute h-5 rounded-full bg-dark" />
              <div className="w-[5rem] top-[14rem] mx-[6.4rem] absolute h-2 rounded-full bg-dark" />
            </>
          )}
          {firstName && lastName && (
            <div className="text-center absolute top-[12rem] left-0 right-0 ">
              <span className="text-black mr-[2rem] text-xl font-semibold">
                {firstName} {lastName}
              </span>
            </div>
          )}
          {email && (
            <div className="text-center absolute top-[14rem] left-0 right-0 ">
              <span className="text-black mr-[2rem] text-sm">{email}</span>
            </div>
          )}
        </div>
        <div className="absolute flex gap-3 flex-col top-[16.5rem] left-0 mx-9">
          {boxes.map((_, index) => (
            <div
              key={index}
              className={`rounded-md w-[13rem] h-11 flex items-center justify-between pl-2 gap-1 text-white ${
                validLinks[index] && validLinks[index].platform === 'GitHub'
                  ? 'bg-black'
                  : validLinks[index] &&
                      validLinks[index].platform === 'LinkedIn'
                    ? 'bg-[#2D68FF]'
                    : validLinks[index] &&
                        validLinks[index].platform === 'YouTube'
                      ? 'bg-red'
                      : validLinks[index] &&
                          validLinks[index].platform === 'Facebook'
                        ? 'bg-[#4267B2]'
                        : 'bg-dark'
              }`}
            >
              {validLinks[index] ? (
                <>
                  <div className="flex gap-1 items-center mx-1">
                    <Image
                      src={platformImages[validLinks[index].platform] || ''}
                      alt={validLinks[index].platform}
                      width={20}
                      height={20}
                    />
                    <a
                      href={validLinks[index].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white"
                    >
                      {validLinks[index].platform}
                    </a>
                  </div>
                  <Image src={arrow} alt="arrow" className="mx-2" />
                </>
              ) : (
                <span className="text-gray-500"></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
