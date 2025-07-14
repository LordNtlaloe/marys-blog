"use client";

import {
  LayoutGrid as RectangleGroupIcon,
  Fingerprint as FingerPrintIcon,
  Palette as SwatchIcon,
  FileText as DocumentTextIcon,
} from "lucide-react";

import { SkillCard } from "@/components/general/skill-card";
import Image from "next/image";

const SKILLS = [
  {
    icon: RectangleGroupIcon,
    title: "Short Story",
    children:
      "Crafting immersive narratives with emotional depth and compelling characters. Each short story delivers a complete and resonant experience in just a few pages.",
  },
  {
    icon: FingerPrintIcon,
    title: "Flash",
    children:
      "Precision and brevity are key. I write flash fiction that captivates quickly, delivering impact in just a few hundred words without sacrificing depth.",
  },
  {
    icon: SwatchIcon,
    title: "Poetry",
    children:
      "Exploring rhythm, sound, and imagery to evoke emotion. My poetry is a fusion of expressive language and creative thought, rooted in honesty and artistry.",
  },
  {
    icon: DocumentTextIcon,
    title: "Screenplay",
    children:
      "Translating story into visual language. I develop screenplays that balance dialogue, pacing, and structure, tailored for film, TV, or web formats.",
  },
];

export function Skills() {
  return (
    <section className="py-24 relative xl:mr-0 lg:mr-5 mr-0 dark:bg-[#29384e]">
      <div className="w-full max-w-[1600px] px-4 md:px-5 mx-auto">
        <div className="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
          {/* Text & Cards Section */}
          <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
            <div className="w-full flex-col justify-center items-start gap-8 flex">
              <div className="flex-col justify-start lg:items-start items-center gap-4 flex">
                <h6 className="text-gray-400 dark:text-[#ecc6ac] text-base font-normal leading-relaxed">
                  My Skills
                </h6>
                <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                  <h2 className="text-[#232E3F] dark:text-[#F0DBCD] text-4xl font-bold leading-normal lg:text-start text-center">
                    What I Do
                  </h2>
                  <p className="text-[#29384e] dark:text-[#F0DBCD] text-base font-normal leading-relaxed lg:text-start text-center">
                    I&apos;m not just a writer; I&apos;m a storyteller. From vivid prose to powerful poetic form, I bring words to life in every format.
                  </p>
                </div>
              </div>

              <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-6">
                {SKILLS.map((props, idx) => (
                  <SkillCard key={idx} {...props} />
                ))}
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full lg:justify-start justify-center items-start flex">
            <div className="relative w-full h-[646px] sm:w-[564px] sm:h-[646px] rounded-3xl overflow-hidden">
              <Image
                src="/images/IMG_8015-1.jpg"
                alt="skills illustration"
                fill
                className="object-top object-cover rounded-3xl z-10"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Skills;
