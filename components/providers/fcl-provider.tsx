"use client";

import { useEffect, useState } from "react";
import { configureFCL } from "@/lib/fcl-config";

interface FCLProviderProps {
  children: React.ReactNode;
}

export default function FCLProvider({ children }: FCLProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true);

    // Configure FCL when the component mounts
    configureFCL();
  }, []);

  // Prevent hydration mismatch by ensuring client-side rendering
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#0A0C14] via-[#1A1F2C] to-[#0A0C14]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0A0C14] via-[#1A1F2C] to-[#0A0C14]">
      {children}
    </div>
  );
}
