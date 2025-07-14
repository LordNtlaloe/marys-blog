"use client";

import React from "react";
import Image from "next/image";

const AVATAR_URLS = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/65.jpg",
];

export function Testimonial() {
  const [active, setActive] = React.useState(2);

  return (
    <section className="py-12 px-8 lg:py-24 dark:bg-[#232E3F]">
      <div className="container max-w-screen-lg mx-auto">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-3xl lg:text-4xl font-bold text-blue-900">
            What Clients Say
          </h2>
          <p className="mx-auto w-full px-4 text-gray-500 font-normal lg:w-8/12">
            Discover what clients have to say about their experiences working
            with me. My client&apos;s satisfaction is my greatest achievement!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row bg-transparent p-8 rounded-lg shadow-none">
          <div className="w-full mb-10 lg:mb-0 lg:flex-grow">
            <h3 className="mb-4 text-2xl font-bold text-blue-900 lg:max-w-xs">
              Mobile App Development
            </h3>
            <p className="mb-3 text-gray-500 font-normal w-full lg:w-8/12">
              I had the pleasure of working with Lily on a critical web
              development project, and I can confidently say that their
              expertise and professionalism exceeded my expectations.
            </p>
            <h6 className="mb-0.5 text-base font-semibold text-blue-900">
              Michael - Technical Manager
            </h6>
            <p className="mb-5 text-sm text-gray-500 font-normal">
              Marketing @ APPLE INC.
            </p>
            <div className="flex items-center gap-4">
              {AVATAR_URLS.map((url, id) => (
                <div key={id} className="flex items-center">
                  <Image
                    src={url}
                    alt={`avatar-${id + 1}`}
                    width={36}
                    height={36}
                    className={`h-9 w-9 rounded-md cursor-pointer object-cover transition-opacity duration-300 ${active === id ? "opacity-100" : "opacity-50"
                      }`}
                    onClick={() => setActive(id)}
                  />
                  {id < AVATAR_URLS.length - 1 && (
                    <div className="w-[1px] h-9 bg-gray-200 ml-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="h-[21rem] w-full sm:w-[18rem] shrink-0 rounded-lg overflow-hidden">
            <Image
              width={768}
              height={768}
              alt="testimonial image"
              src={AVATAR_URLS[active]}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
