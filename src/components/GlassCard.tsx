import React from 'react';
import { Card } from '@mui/material';
import type { CardProps } from '@mui/material';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

// Merge MUI CardProps with Framer Motion props
type Merge<P1, P2> = Omit<P1, keyof P2> & P2;
export type GlassCardProps = Merge<CardProps, HTMLMotionProps<'div'>> & {
  hoverEffect?: boolean;
  glowColor?: string;
  animate?: boolean;
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hoverEffect = true,
  glowColor = 'rgba(124, 58, 237, 0.08)',
  animate = true,
  sx,
  ...props
}) => {
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      }
    : {};

  return (
    <Card
      component={motion.div}
      {...motionProps}
      {...(props as any)}
      sx={{
        position: 'relative',
        background: 'rgba(13, 14, 18, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 3,
        overflow: 'visible', // allow shadows to spill out
        transition: 'border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: '1px',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        },
        ...(hoverEffect && {
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backgroundColor: 'rgba(20, 22, 28, 0.65)',
            boxShadow: `0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 30px 0 ${glowColor}`,
            '& .card-accent-line': {
              width: '100%',
            },
          },
        }),
        ...sx,
      }}
    >
      {/* Decorative top accent line on hover */}
      {hoverEffect && (
        <span
          className="card-accent-line"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '2px',
            width: '0%',
            background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
            transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            borderRadius: '12px 12px 0 0',
          }}
        />
      )}
      {children}
    </Card>
  );
};
