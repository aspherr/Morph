import React from 'react'
import { LucideIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type FormatCardProps = {
  name: string;
  icon: LucideIcon;
  formats: string[];
}

const FormatCard = ({ name, icon: Icon, formats }: FormatCardProps) => {
  return (
    <div className="w-full md:w-auto"> 
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-2 leading-tight">
          <Icon className="w-5 h-5" />
          <CardTitle>{name}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap items-center gap-2 text-sm font-light opacity-75 h-4">
          {formats.map((fmt, i) => (
            <React.Fragment key={fmt}>
              <span className="uppercase">{fmt}</span>
              {i < formats.length - 1 && <Separator orientation="vertical" />}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FormatCard
