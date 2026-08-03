import { ReactNode, useEffect, useRef, useState } from 'react';
import { IoTerminal } from 'react-icons/io5';
import styles from './DesktopIcons.module.css';
import Window from './Window';
import TerminalApp from './TerminalApp';

const CLOSED = 0;
const OPEN = 1;
const MINIMIZED = 2;

function AppIcon({
  icon,
  appName,
  onClick,
}: {
  icon: ReactNode;
  appName: string;
  onClick: () => void;
}) {
  return (
    <button className={styles.iconDiv} onClick={onClick}>
      {icon}
      <p className={styles.iconText}>{appName}</p>
    </button>
  );
}

export default function DesktopIcons() {
  const [activeApps, setActiveApps] = useState({
    terminal: OPEN,
  });
  const firstMount = useRef(true);

  useEffect(() => {
    firstMount.current = false;
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      }}
    >
      <AppIcon
        icon={<IoTerminal color="grey" size={50} />}
        appName="Portfolio"
        onClick={() => setActiveApps((prev) => ({ ...prev, terminal: OPEN }))}
      />
      {activeApps.terminal ? (
        <Window
          minimized={activeApps.terminal === MINIMIZED}
          minimize={() =>
            setActiveApps((prev) => ({ ...prev, terminal: MINIMIZED }))
          }
          close={() => setActiveApps((prev) => ({ ...prev, terminal: CLOSED }))}
          skipAnimation={firstMount.current}
        >
          <TerminalApp />
        </Window>
      ) : null}
    </div>
  );
}
