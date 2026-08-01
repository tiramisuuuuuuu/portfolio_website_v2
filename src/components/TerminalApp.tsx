import { ReactNode, useLayoutEffect, useMemo, useState } from 'react';

import styles from './TerminalApp.module.css';
import SkillsSection from './SkillsSection';

function Command({
  command,
  body,
  isSmall,
  children,
}: {
  command: string;
  body?: string;
  isSmall?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={styles.entireCommand}>
      <div className={styles.header}>
        {!isSmall && 'user@sreya-desktop'}
        {!isSmall && <p className={styles.path}>{':'}</p>}
        <p className={styles.path}>{'~$'}</p>
        <p className={styles.command}>{command}</p>
      </div>

      <p className={styles.body}>{body}</p>

      {children}
    </div>
  );
}

export default function TerminalApp() {
  const [activeCommand, setActiveCommand] = useState<
    'about' | 'skills' | 'projects' | 'contact' | null
  >('skills');
  const [inputText, setInputText] = useState('');
  const [parentElem, setParentElem] = useState<HTMLDivElement | null>(null);
  const [isSmall, setIsSmall] = useState(false);

  const COMMANDS = useMemo(
    () => ({
      about: {
        sections: [
          <Command command="./about.sh" isSmall={isSmall} />,
          <Command
            command="cat welcome.txt"
            body="Hi there! My name is Sreya and I am a M.S. AI student, currently looking for a Software Engineering internship."
            isSmall={isSmall}
          />,
        ],
      },
      skills: {
        sections: [
          <Command command="skills" isSmall={isSmall} />,
          <div className={styles.oneLine}>
            <p>Loading {!isSmall ? 'simulation' : 'sim'}...</p>
            <p style={{ color: 'lightgreen' }}>ok</p>
          </div>,
          <SkillsSection />,
        ],
      },
      projects: {
        sections: [<Command command="ls projects" isSmall={isSmall} />],
      },
      contact: {
        sections: [<Command command="cat contact.txt" isSmall={isSmall} />],
      },
    }),
    [isSmall]
  );

  useLayoutEffect(() => {
    if (!parentElem) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width < 440) {
          setIsSmall(true);
          const input = document.getElementById('commandLineInput');
          if (input) {
            input.setAttribute('placeholder', 'Type cmd here');
          }
        } else {
          setIsSmall(false);
          const input = document.getElementById('commandLineInput');
          if (input) {
            input.setAttribute('placeholder', 'Type cmd here or use buttons');
          }
        }
      }
    });

    resizeObserver.observe(parentElem);

    return () => resizeObserver.disconnect();
  }, [parentElem]);

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === 'Enter') {
      if (
        inputText === 'about' ||
        inputText === 'skills' ||
        inputText === 'projects' ||
        inputText === 'contact'
      ) {
        setActiveCommand(inputText);
      }
    }
  };

  return (
    <div className={styles.container} ref={(el) => setParentElem(el)}>
      <div className={styles.content}>
        {activeCommand &&
          COMMANDS[activeCommand].sections.map((sectionDiv) => (
            <>{sectionDiv}</>
          ))}
      </div>
      <div className={styles.commandLine}>
        <p className={styles.path}>{'~$'}</p>
        <input
          id="commandLineInput"
          type="text"
          className={styles.inputBox}
          placeholder="Type cmd here or use buttons"
          maxLength={12}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={styles.cmdLineBttn}
          onClick={() => setActiveCommand('about')}
        >
          about
        </button>
        <button
          className={styles.cmdLineBttn}
          onClick={() => setActiveCommand('skills')}
        >
          skills
        </button>
        <button
          className={styles.cmdLineBttn}
          onClick={() => setActiveCommand('projects')}
        >
          projects
        </button>
        <button
          className={styles.cmdLineBttn}
          onClick={() => setActiveCommand('contact')}
        >
          contact
        </button>
      </div>
    </div>
  );
}
