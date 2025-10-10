"use client";

import Image from "next/image";

interface CustomIconProps {
  name: "logo" | "ai-trust" | "verification" | "smart-lending";
  size?: number;
  className?: string;
}

export default function CustomIcon({ name, size = 64, className = "" }: CustomIconProps) {
  const iconMap = {
    logo: "/logo.svg",
    "ai-trust": "/ai-trust-icon.svg",
    verification: "/verification-icon.svg",
    "smart-lending": "/smart-lending-icon.svg",
  };

  return (
    <Image
      src={iconMap[name]}
      alt={`SmartLend ${name} icon`}
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
