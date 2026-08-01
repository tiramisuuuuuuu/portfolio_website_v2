import { ReactNode, useLayoutEffect, useMemo, useRef, useState } from 'react';

import styles from './TerminalApp.module.css';
import SkillsSection from './SkillsSection';
import { AnimatePresence, stagger } from 'motion/react';
import { motion } from 'motion/react';

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

// define visual states as sections animate from initially 'closed' to open
const itemVariants = {
  closed: {
    opacity: 0.1,
  },
  open: {
    opacity: 1,
  },
};

// parent controls how visual states propogate to children
const parentVariants = {
  closed: {
    transition: { delayChildren: stagger(0.5, { from: 'last' }) },
  },
  open: {
    transition: { delayChildren: stagger(0.5) },
  },
};

function MotionWrapper({
  flex,
  children,
}: {
  flex?: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div
      variants={itemVariants}
      style={flex ? { display: 'flex', flex: 1 } : undefined}
    >
      {children}
    </motion.div>
  );
}

export default function TerminalApp() {
  const [activeCommand, setActiveCommand] = useState<
    'about' | 'skills' | 'projects' | 'contact' | 'help' | null
  >('skills');
  const inputText = useRef('');
  const [submittedText, setSubmittedText] = useState('');
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
      help: {
        sections: [<Command command="help" isSmall={isSmall} />],
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
        inputText.current === 'about' ||
        inputText.current === 'skills' ||
        inputText.current === 'projects' ||
        inputText.current === 'contact' ||
        inputText.current === 'help'
      ) {
        setActiveCommand(inputText.current);
      } else {
        setActiveCommand(null);
        setSubmittedText(inputText.current);
      }
    }
  };

  return (
    <div className={styles.container} ref={(el) => setParentElem(el)}>
      <AnimatePresence mode="wait">
        <motion.div
          className={styles.content}
          key={activeCommand}

          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.3 }}

          initial="closed"
          animate="open"
          variants={parentVariants}
        >
          {activeCommand &&
            COMMANDS[activeCommand].sections.map((sectionDiv, idx) => (
              <MotionWrapper
                key={`${activeCommand}-${idx}`}
                flex={activeCommand === 'skills' && idx === 2}
              >
                {sectionDiv}
              </MotionWrapper>
            ))}
          {!activeCommand && (
            <>
              <MotionWrapper key="submitted text">
                <Command
                  command={submittedText}
                  body="Could not find command"
                  isSmall={isSmall}
                />
              </MotionWrapper>

              {COMMANDS['help'].sections.map((sectionDiv, idx) => (
                <MotionWrapper key={`help-${idx}`}>{sectionDiv}</MotionWrapper>
              ))}
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <div className={styles.commandLine}>
        <p className={styles.path}>{'~$'}</p>
        <input
          id="commandLineInput"
          type="text"
          className={styles.inputBox}
          placeholder="Type cmd here or use buttons"
          maxLength={12}
          onChange={(e) => (inputText.current = e.target.value)}
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
