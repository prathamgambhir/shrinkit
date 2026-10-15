"use client";

import { MotionProps, motion } from "motion/react";

interface MotionProviderProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  props?: any;
}

export const MotionDiv: React.FC<MotionProviderProps> = ({
  children,
  className,
  props,
}) => {
  return (
    <motion.div className={className} {...props}>
      {children}
    </motion.div>
  );
};

export const MotionSpan: React.FC<MotionProviderProps> = ({
  children,
  className,
  props,
}) => {
  return <motion.span>{children}</motion.span>;
};

export const MotionH1: React.FC<MotionProviderProps> = ({
  children,
  className,
  props,
}) => {
  return (
    <motion.h1 className={className} {...props}>
      {children}
    </motion.h1>
  );
};

export const MotionP: React.FC<MotionProviderProps> = ({
  children,
  className,
  props,
}) => {
  return (
    <motion.p className={className} {...props}>
      {children}
    </motion.p>
  );
};

export const MotionA: React.FC<MotionProviderProps> = ({
  children,
  className,
  props,
}) => {
  return (
    <motion.a className={className} {...props}>
      {children}
    </motion.a>
  );
};

