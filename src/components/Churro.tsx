import ChurroSvg from '../assets/churro.svg';
import FireflySvg from '../assets/firefly.svg';

import { motion } from 'motion/react';

export default function Churro() {
  return (
    <div
      style={{
        position: 'absolute',
        justifySelf: 'flex-end',
        alignSelf: 'flex-end',
        marginBottom: -13,
        marginLeft: 40,
        userSelect: 'none',
      }}
    >
      <img
        src={ChurroSvg}
        height="150"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />
      <motion.img
        src={FireflySvg}
        height="40"
        style={{
          position: 'absolute',
          top: -90,
          left: 15,
        }}
        initial={{ opacity: 0.2 }}
        animate={{ y: 5, x: 10, opacity: 0.5 }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 2,
          delay: 0.3,
        }}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />
      <motion.img
        src={FireflySvg}
        height="40"
        style={{
          position: 'absolute',
          top: -70,
          left: -15,
        }}
        initial={{ opacity: 0.2, rotate: 85 }}
        animate={{ y: 10, x: 5, opacity: 0.5, rotate: 80 }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 2,
        }}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />
      <motion.img
        src={FireflySvg}
        height="40"
        style={{
          position: 'absolute',
          top: -50,
          left: 75,
        }}
        initial={{ opacity: 0.7, rotate: -20 }}
        animate={{ y: 10, x: -5, opacity: 0.2, rotate: 0 }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 2,
          delay: 0.6,
        }}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />
    </div>
  );
}
