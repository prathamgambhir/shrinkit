import { cn } from "@/lib/utils";
import React from "react";

// export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
//   children: React.ReactNode;
//   className?: string;
// }

//if want to use this interface i have to simply add it as :ContainerProps

export const Container = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  props ?: any
}) => {
  return (
    <div
      className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
