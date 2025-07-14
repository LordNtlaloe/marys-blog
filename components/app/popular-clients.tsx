"use client";

import Image from "next/image";
import { getImagePrefix } from "@/lib/utils";

const CLIENTS = [
  "coinbase",
  "spotify",
  "pinterest",
  "google",
  "amazon",
  "netflix",
];

export function PopularClients() {
  return (
    <section className="py-8 px-8 lg:py-20">
      <div className="container mx-auto grid items-center place-items-center">
        <div className="text-center">
          <h6 className="mb-4 uppercase text-sm text-gray-500 tracking-wider">
            POPULAR CLIENTS
          </h6>
          <h2 className="mb-4 text-3xl lg:text-4xl font-bold text-blue-900">
            Trusted by over 10,000+ <br /> clients
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          {CLIENTS.map((logo, key) => (
            <Image
              key={key}
              alt={logo}
              width={480}
              height={480}
              src={`${getImagePrefix()}logos/logo-${logo}.svg`}
              className="w-40 grayscale opacity-75"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularClients;
