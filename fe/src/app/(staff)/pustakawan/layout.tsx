import PustakawanDashboard from "@/components/PustakawanDashboard";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PustakawanLayout({ children }: Props) {
  return (
    <main className="">
      <PustakawanDashboard />
      {children}
    </main>
  );
}
