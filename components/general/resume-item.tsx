"use client";

import { Card } from "@/components/ui/card";

interface ResumeItemProps {
  icon: React.ElementType;
  children: React.ReactNode;
}

export function ResumeItem({ icon: Icon, children }: ResumeItemProps) {
  return (
    <div className="flex items-start gap-4">
      <Card className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-200 p-2">
        <Icon className="h-6 w-6 text-gray-700" strokeWidth={2} />
      </Card>
      <p className="w-full text-gray-500 font-normal">{children}</p>
    </div>
  );
}

export default ResumeItem;
