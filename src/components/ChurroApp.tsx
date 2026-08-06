import { useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { AppsContext } from './appsContext';
import styles from './ChurroApp.module.css';

export default function ChurroApp() {
  const { churroVisible, setChurroVisible } = useContext(AppsContext);

  const states = {
    frame1: '',
    frame2: 'ฅ ฅ',
    frame3: 'ฅᨐฅ',
    frame4: 'ฅ^._.^ฅ',
    rest: 'ᓚ₍ ^. ̫ .^₎',
    frame5: '',
    chill: '≽(-˕ - ≼マ',
    asleep: '/ᐠ - ˕ -マ ᶻ 𝗓 𐰁',
  };
  const [animationPhase, setAnimationPhase] = useState(
    !churroVisible ? 'rest' : 'frame5'
  );
  const timerId = useRef<number>(null);

  useEffect(() => {
    if (animationPhase === 'chill') {
      const id = setTimeout(() => {
        setAnimationPhase('asleep');
      }, 5000);
      timerId.current = id;
    }
  }, [animationPhase]);

  return (
    <div>
      <motion.div
        key={`${animationPhase}-text`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 1,
            delay: 0.8,
          },
        }}
        className={styles.quotes}
      >
        {animationPhase === 'rest' && '"Hi, I\'m Churro."'}
        {animationPhase === 'asleep' && '"ZZZ"'}
        {animationPhase === 'chill' && 'What a beautiful sunset.'}
      </motion.div>

      <motion.div
        key={`${animationPhase}-emoticon`}
        initial={{ opacity: 0.5 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.7,
          },
        }}
        onAnimationComplete={() => {
          if (animationPhase === 'frame1') {
            setAnimationPhase('frame2');
          } else if (animationPhase === 'frame2') {
            setAnimationPhase('frame3');
          } else if (animationPhase === 'frame3') {
            setAnimationPhase('frame4');
          } else if (animationPhase === 'frame4') {
            setAnimationPhase('rest');
          } else if (animationPhase === 'frame5') {
            setAnimationPhase('chill');
          }
        }}
        className={styles.emoticonContainer}
      >
        {states[animationPhase as keyof typeof states]}
      </motion.div>

      <button
        onClick={() => {
          churroVisible
            ? setAnimationPhase('frame1')
            : setAnimationPhase('frame5');
          clearTimeout(timerId.current ?? undefined);
          timerId.current = null;
          setChurroVisible(!churroVisible);
        }}
      >
        {!churroVisible ? 'Deploy' : 'Recall'} Churro
      </button>
    </div>
  );
}
