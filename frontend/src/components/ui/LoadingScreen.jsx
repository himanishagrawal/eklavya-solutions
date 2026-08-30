import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo.jsx';

export default function LoadingScreen({ label = 'Loading Eklavya Solutions' }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-5 bg-base">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
      >
        <Logo withWordmark={false} size={40} />
      </motion.div>
      <p className="font-display text-sm tracking-wide text-ink-muted">{label}</p>
    </div>
  );
}
