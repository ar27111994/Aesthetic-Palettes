"use client";

import React from "react";
import { cn } from "@utils/cn";
import { Size } from "@typings/Size";
import Image from "next/image";

type Shape = "circle" | "square";

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: React.ReactNode; // Text or icon to display if src fails
  size?: Size;
  shape?: Shape;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "",
  fallback,
  size = "md",
  shape = "circle",
  className,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    sm: "h-8 w-8", // 32px
    md: "h-11 w-11", // 44px (Ensure min touch target if interactive)
    lg: "h-12 w-12", // 48px
  };

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-md",
  };

  const baseClasses =
    "inline-flex items-center justify-center overflow-hidden bg-background-subtle align-middle text-text-secondary select-none"; // Use design system colors

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <span
      className={cn(
        baseClasses,
        sizeClasses[size],
        shapeClasses[shape],
        className,
      )}
    >
      {src && !imageError ? (
        <Image
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span className="text-sm font-medium">{fallback}</span>
      )}
    </span>
  );
};

export { Avatar };
