import { ReactNode, useEffect, useRef, useState } from 'react';
import { IoTerminal } from 'react-icons/io5';
import styles from './DesktopIcons.module.css';
import Window from './Window';
import TerminalApp from './TerminalApp';
import { AppsContext } from './appsContext';
import Churro from './Churro';
import ChurroApp from './ChurroApp';
import { FaCat } from 'react-icons/fa';
import { MdPhoto } from 'react-icons/md';
import HeadshotJpeg from '../assets/me.jpg';

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
    terminal: {
      status: OPEN,
      zIndex: 0,
    },
    photos: {
      status: CLOSED,
      zIndex: 0,
    },
    churro: {
      status: CLOSED,
      zIndex: 0,
    },
  });
  const firstMount = useRef(true);
  const latestZIndex = useRef(1);
  const [churroVisible, setChurroVisible] = useState(false);

  useEffect(() => {
    firstMount.current = false;
  }, []);

  useEffect(() => {
    let timerId: number | undefined;
    const startTimer = () => {
      const now = new Date();

      const elem = document.getElementById('bottom-bar');
      if (elem) {
        const hrs = now.getHours();
        elem.innerHTML = `${hrs % 12 === 0 ? 12 : hrs % 12}:${String(now.getMinutes()).padStart(2, '0')} ${hrs > 11 ? 'PM' : 'AM'}`;
      }

      const delay = 60000 - (now.getTime() % 60000);
      timerId = setTimeout(startTimer, delay);
    };
    startTimer();
    return () => clearTimeout(timerId);
  }, []);

  const openApp = (app: 'terminal' | 'photos' | 'churro') => {
    setActiveApps((prev) => {
      const prevZIndex = prev[app].zIndex;
      let zIndex;

      if (prevZIndex === latestZIndex.current) {
        zIndex = prevZIndex;
      } else {
        latestZIndex.current += 1;
        zIndex = latestZIndex.current;
      }
      return { ...prev, [app]: { status: OPEN, zIndex: zIndex } };
    });

    if (latestZIndex.current == 100) {
      setActiveApps((prev) => {
        const copy = { ...prev };
        const sortedArr = Object.entries(prev).sort(
          (a, b) => a[1].zIndex - b[1].zIndex
        );
        sortedArr.forEach((entry, idx) => {
          const key = entry[0];
          const value = entry[1];
          copy[key as keyof typeof prev] = {
            status: value.status,
            zIndex: idx,
          };
        });
        return copy;
      });

      latestZIndex.current = Object.keys(activeApps).length;
    }
  };

  const minimizeApp = (app: 'terminal' | 'photos') => {
    setActiveApps((prev) => ({
      ...prev,
      [app]: { status: MINIMIZED, zIndex: prev[app].zIndex },
    }));
  };

  const closeApp = (app: 'terminal' | 'photos' | 'churro') => {
    setActiveApps((prev) => ({
      ...prev,
      [app]: { status: CLOSED, zIndex: prev[app].zIndex },
    }));
  };

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
      <div className={styles.firstRow}>
        <AppIcon
          icon={<IoTerminal color="grey" size={50} />}
          appName="Portfolio"
          onClick={() => openApp('terminal')}
        />
      </div>
      <AppsContext
        value={{ openApp, closeApp, churroVisible, setChurroVisible }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column-reverse',
            pointerEvents: 'none',
          }}
        >
          <div id="bottom-bar" className={styles.bottomBar} />

          <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
            {churroVisible && <Churro />}

            {activeApps.terminal.status ? (
              <Window
                minimized={activeApps.terminal.status === MINIMIZED}
                minimize={() => minimizeApp('terminal')}
                close={() => {
                  closeApp('terminal');
                  closeApp('photos');
                }}
                skipAnimation={firstMount.current}
                focusWindow={() => openApp('terminal')}
                zIndex={activeApps.terminal.zIndex}
              >
                <TerminalApp />
              </Window>
            ) : null}
            {activeApps.photos.status && activeApps.terminal.status ? (
              <Window
                width={250}
                height={250}
                initialPos="middle-right"
                minimized={activeApps.terminal.status === MINIMIZED}
                focusWindow={() => openApp('photos')}
                zIndex={activeApps.photos.zIndex}
                icon={<MdPhoto color="#a89bc9" size={25} />}
                name="Photos"
              >
                <img
                  src={HeadshotJpeg}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    userSelect: 'none',
                  }}
                />
              </Window>
            ) : null}
            {activeApps.churro.status ? (
              <Window
                width={250}
                height={200}
                initialPos="middle-left"
                close={() => closeApp('churro')}
                focusWindow={() => openApp('churro')}
                zIndex={activeApps.churro.zIndex}
                icon={<FaCat color="#a89bc9" size={25} />}
                name="Churro App"
              >
                {<ChurroApp />}
              </Window>
            ) : null}
          </div>
        </div>
      </AppsContext>
    </div>
  );
}
