"use client";
import { SessionProvider } from "next-auth/react";
import { RetoursProvider } from "@/components/Retours";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <RetoursProvider>{children}</RetoursProvider>
    </SessionProvider>
  );
}
