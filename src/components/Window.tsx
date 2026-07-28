'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';

import styles from './Window.module.css';
import { IoBrowsersOutline } from 'react-icons/io5';
import { MdOutlineClose } from 'react-icons/md';
import { FaTerminal } from 'react-icons/fa';

export default function Window({
  minimized,
  minimize,
  close,
}: {
  minimized: boolean;
  minimize: () => void;
  close: () => void;
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

    const x = (parent.clientWidth - child.offsetWidth) / 2;
    const y = (parent.clientHeight - child.offsetHeight) / 2;

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
      }}
    >
      <Draggable
        nodeRef={nodeRef}
        position={position}
        onDrag={handleDrag}
        cancel="button"
        onStart={() => setIsDragging(true)}
        onStop={() => setIsDragging(false)}
        handle=".drag-handle"
        bounds="parent"
      >
        <div
          ref={nodeRef}
          className={`${styles.entireWindow} ${isSmall && styles.smallWindow}`}
          style={{
            pointerEvents: 'auto',
          }}
          tabIndex={0}
          onFocusCapture={() => console.log('Window focused')}
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
              <FaTerminal color="#a89bc9" size={25} />
              <p className={styles.heading}>Portfolio</p>
            </div>

            <div className={styles.bttns}>
              <button
                onClick={() => {
                  console.log('Minimize CLICKED');
                  minimize();
                }}
                className={styles.bttn}
              >
                <div className={styles.windowButton}>_</div>
              </button>
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
            </div>
          </div>
          <div className={styles.contentBox} />
        </div>
      </Draggable>
    </div>
  );
}
