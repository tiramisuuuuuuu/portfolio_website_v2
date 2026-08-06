'use client';

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';

import styles from './Window.module.css';
import { IoBrowsersOutline } from 'react-icons/io5';
import { MdOutlineClose } from 'react-icons/md';
import { FaTerminal } from 'react-icons/fa';
import { motion } from 'motion/react';

export default function Window({
  minimized,
  minimize,
  close,
  skipAnimation,
  focusWindow,
  zIndex,
  width,
  height,
  initialPos = 'center',
  icon,
  name,
  children,
}: {
  minimized?: boolean;
  minimize?: () => void;
  close?: () => void;
  skipAnimation?: boolean;
  focusWindow: () => void;
  zIndex: number;
  width?: number;
  height?: number;
  initialPos?: 'middle-right' | 'middle-left' | 'center';
  icon?: ReactNode;
  name?: string;
  children?: ReactNode;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSmall, setIsSmall] = useState(false);

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  useEffect(() => {
    const clampPosition = () => {
      if (!parentRef.current || !nodeRef.current) return;

      const parent = parentRef.current;
      const child = nodeRef.current;

      const maxX = parent.clientWidth - child.offsetWidth;
      const maxY = parent.clientHeight - child.offsetHeight;

      setPosition((pos) => ({
        x: Math.max(0, Math.min(pos.x, maxX)),
        y: Math.max(0, Math.min(pos.y, maxY)),
      }));
    };

    window.addEventListener('resize', clampPosition);
    return () => window.removeEventListener('resize', clampPosition);
  }, []);

  useLayoutEffect(() => {
    if (!parentRef.current || !nodeRef.current) return;

    const parent = parentRef.current;
    const child = nodeRef.current;

    // case "center"
    let x = (parent.clientWidth - child.offsetWidth) / 2;
    let y = (parent.clientHeight - child.offsetHeight) / 2;

    if (initialPos === 'middle-right') {
      x = parent.clientWidth - child.offsetWidth;
    } else if (initialPos === 'middle-left') {
      x = 0;
    }

    setPosition({ x, y });
  }, []);

  return (
    <div
      ref={parentRef}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: minimized ? 'none' : 'block',
        zIndex: zIndex,
      }}
    >
      <Draggable
        nodeRef={nodeRef}
        position={position}
        onDrag={handleDrag}
        cancel="button"
        onStart={() => {
          setIsDragging(true);
          focusWindow();
        }}
        onStop={() => setIsDragging(false)}
        handle=".drag-handle"
        bounds="parent"
      >
        <div
          ref={nodeRef}
          className={`${styles.entireWindow} ${isSmall && styles.smallWindow}`}
          style={{ width: width, height: height }}
        >
          <motion.div
            className={styles.motionWrapper}
            style={{
              pointerEvents: 'auto',
            }}
            tabIndex={0}
            onFocusCapture={() => focusWindow()}
            initial={!skipAnimation && { scale: 0 }}
            animate={{
              scale: 1,
            }}
          >
            <div
              className={`${styles.navBar} ${isDragging && styles.dragging} drag-handle`}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                {icon ? icon : <FaTerminal color="#a89bc9" size={25} />}
                <p className={styles.heading}>{name ? name : 'Portfolio'}</p>
              </div>

              <div className={styles.bttns}>
                {minimize && (
                  <button
                    onClick={() => {
                      console.log('Minimize CLICKED');
                      minimize();
                    }}
                    className={styles.bttn}
                  >
                    <div className={styles.windowButton}>_</div>
                  </button>
                )}
                {!width && !height && (
                  <button
                    onClick={() => {
                      console.log('Resize CLICKED');
                      setIsSmall((prev) => !prev);
                    }}
                    className={styles.bttn}
                  >
                    <div className={styles.windowButton}>
                      <IoBrowsersOutline />
                    </div>
                  </button>
                )}
                {close && (
                  <button
                    onClick={() => {
                      console.log('Close CLICKED');
                      close();
                    }}
                    className={styles.bttn}
                  >
                    <div className={styles.windowButton}>
                      <MdOutlineClose />
                    </div>
                  </button>
                )}
              </div>
            </div>
            <div className={styles.contentBox}>{children}</div>
          </motion.div>
        </div>
      </Draggable>
    </div>
  );
}
