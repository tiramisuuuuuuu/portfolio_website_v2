import styles from './HelpSection.module.css';
import { motion } from 'motion/react';

export default function HelpSection({ isSmall }: { isSmall: boolean }) {
  const helpText = {
    about: 'Quick facts about my programming journey',
    skills: 'Languages and frameworks I am familiar with',
    projects: 'Featured projects',
    contact: 'How to reach me',
    help: 'Lists commands and descriptions',
    churro: 'Add a cute cat to the desktop',
  };

  return (
    <div className={styles.container}>
      <p>
        Type any of the following into the input box! Shortcut buttons are also
        available beside the input box.
      </p>
      {Object.entries(helpText).map(([key, value]) => (
        <motion.div
          key={key}
          className={styles.pair}
          animate={
            key === 'churro' && {
              color: [
                '#ff0000',
                '#ff7f00',
                '#ffff00',
                '#00ff00',
                '#0000ff',
                '#4b0082',
                '#9400d3',
                '#ff0000',
              ],
            }
          }
          transition={{
            duration: 6,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          <p
            className={styles.key}
            style={{ width: isSmall ? '100%' : undefined }}
          >
            {key}:
          </p>
          <p className={styles.value}>{value}</p>
        </motion.div>
      ))}
    </div>
  );
}
