import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

function Leaf({ deleteLeaf }: { deleteLeaf: () => void }) {
  const leafAttr = useMemo(() => {
    return {
      icon: Math.random() < 0.5 ? '🍂' : '🍁',
      startX: Math.floor(Math.random() * 600) - 200,
      endX: Math.floor(Math.random() * -window.innerWidth * 0.6) - 500,
      endY: window.innerHeight + 10,
      startRotate: Math.floor(Math.random() * 360),
      endRotate: Math.floor(Math.random() * 540),
      duration: Math.floor(Math.random() * 20) + 30,
    };
  }, []);

  return (
    <motion.p
      style={{
        position: 'absolute',
        right: 0,
      }}
      initial={{
        y: -10,
        x: leafAttr.startX,
        rotate: leafAttr.startRotate,
      }}
      animate={{
        y: leafAttr.endY,
        x: leafAttr.endX,
        rotate: leafAttr.endRotate,
        opacity: [1, 1, 0.5, 0],
        transition: {
          duration: leafAttr.duration,
          ease: 'linear',
          times: [0, 0.9, 0.97, 1],
        },
      }}
      onAnimationComplete={deleteLeaf}
    >
      {leafAttr.icon}
    </motion.p>
  );
}

export default function Leaves() {
  const [leafKeys, setLeafKeys] = useState<string[]>([]);

  useEffect(() => {
    let timerId: number | undefined;
    const startTimer = () => {
      if (!document.hidden) {
        setLeafKeys((prev) => {
          if (prev.length == 15) {
            return prev;
          }
          return [...prev, crypto.randomUUID()];
        });
      }
      const delay = Math.floor(Math.random() * 3001) + 3000;
      timerId = setTimeout(startTimer, delay);
    };
    startTimer();
    return () => clearTimeout(timerId);
  }, []);

  const deleteLeaf = (key: string) => {
    setLeafKeys((prev) => prev.filter((item) => item !== key));
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {leafKeys.map((stableLeafKey) => (
        <Leaf
          key={stableLeafKey}
          deleteLeaf={() => deleteLeaf(stableLeafKey)}
        />
      ))}
    </div>
  );
}
