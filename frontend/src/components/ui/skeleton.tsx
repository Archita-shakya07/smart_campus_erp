import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, count = 1, ...props }, ref) => {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? ref : undefined}
            className={`bg-gray-200 rounded-lg animate-pulse h-4 mb-2 ${className}`}
            {...props}
          />
        ))}
      </>
    );
  }
);

Skeleton.displayName = "Skeleton";