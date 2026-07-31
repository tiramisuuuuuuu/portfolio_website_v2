import { ReactNode, useState } from 'react';

import styles from './TerminalApp.module.css';
import SkillsSection from './SkillsSection';

function Command({
  command,
  body,
  children,
}: {
  command: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <div className={styles.entireCommand}>
      <div className={styles.header}>
        user@sreya-desktop
        <p className={styles.path}>{':~$'}</p>
        <p className={styles.command}>{command}</p>
      </div>

      <p className={styles.body}>{body}</p>

      {children}
    </div>
  );
}

const COMMANDS = {
  about: {
    sections: [
      <Command command="./about.sh" />,
      <Command
        command="cat welcome.txt"
        body="Hi there! My name is Sreya and I am a M.S. AI student, currently looking for a Software Engineering internship."
      />,
    ],
  },
  skills: {
    sections: [
      <Command command="skills" />,
      <div className={styles.oneLine}>
        <p>Loading emulation...</p>
        <p style={{ color: 'lightgreen' }}>ok</p>
      </div>,
      <SkillsSection />,
    ],
  },
};

export default function TerminalApp() {
  const [activeCommand, setActiveCommand] = useState<'about' | 'skills'>(
    'skills'
  );

  return (
    <div className={styles.content}>
      {COMMANDS[activeCommand].sections.map((sectionDiv) => (
        <>{sectionDiv}</>
      ))}
    </div>
  );
}
