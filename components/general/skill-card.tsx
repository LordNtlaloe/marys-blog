"use client";

import { Card, CardContent } from "@/components/ui/card";

interface SkillCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

export function SkillCard({ icon: Icon, title, children }: SkillCardProps) {
  return (
    <Card className="bg-transparent shadow-none mx-2">
      <CardContent className="grid justify-center text-center">
        <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-full bg-[#232E3F] p-2.5 text-white shadow">
          <Icon className="h-6 w-6" strokeWidth={2} />
        </div>
        <h3 className="mb-2 text-lg font-semibold dark:text-[#F0DBCD]">{title}</h3>
        <p className="px-8 text-gray-500 font-normal dark:text-gray-50">{children}</p>
      </CardContent>
    </Card>
  );
}

export default SkillCard;
