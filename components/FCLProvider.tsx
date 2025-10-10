"use client";

import { useEffect } from "react";
import { configureFCL } from "@/lib/fcl-config";

interface FCLProviderProps {
  children: React.ReactNode;
}

export default function FCLProvider({ children }: FCLProviderProps) {
  useEffect(() => {
    // Configure FCL when the component mounts
    configureFCL();
  }, []);

  return <>{children}</>;
}
