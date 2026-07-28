'use client';

import { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';

import styles from './Window.module.css';
import { IoBrowsersOutline, IoTerminal } from 'react-icons/io5';
import { MdOutlineClose } from 'react-icons/md';

export default function Window() {
  const nodeRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <div
      ref={parentRef}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
        <div ref={nodeRef} className={styles.entireWindow}>
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
              <IoTerminal color="#a89bc9" size={25} />
              <p className={styles.heading}>Portfolio</p>
            </div>

            <div className={styles.bttns}>
              <button
                onClick={() => {
                  console.log('Minimize CLICKED');
                }}
                className={styles.bttn}
              >
                <div className={styles.windowButton}>_</div>
              </button>
              <button
                onClick={() => {
                  console.log('Resize CLICKED');
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
