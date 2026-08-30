import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, delay = 0, as: As = motion.div }) {
  return (
    <As
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className={`surface-card p-6 ${hover ? 'transition-transform duration-200 hover:-translate-y-0.5 hover:border-accent/40' : ''} ${className}`}
    >
      {children}
    </As>
  );
}
