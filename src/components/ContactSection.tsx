import styles from './ContactSection.module.css';
import { FaGithub } from 'react-icons/fa';
import { LiaLinkedin } from 'react-icons/lia';

export default function ContactSection() {
  return (
    <div className={styles.container}>
      <div className={styles.letter}>
        <p className={styles.header}>Let's connect ˗ˏˋ ꒰ ✉︎ ꒱ ˎˊ˗</p>
        <div className={styles.leftLine} />
        <div className={styles.rightLine} />
      </div>
      <div className={styles.content}>
        <a
          href="https://github.com/tiramisuuuuuuu"
          target="_blank"
          className={styles.link}
        >
          <FaGithub size={30} /> tiramisuuuuuuu
        </a>
        <a
          href="https://www.linkedin.com/in/sreya-mathew-884509293/"
          target="_blank"
          className={styles.link}
        >
          <LiaLinkedin size={30} /> linkedin
        </a>
      </div>
    </div>
  );
}
