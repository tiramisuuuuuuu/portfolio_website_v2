"use client";

import { useRef, useState } from "react";
import Draggable from "react-draggable";

import styles from './Window.module.css';
import { IoBrowsersOutline, IoTerminal } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";

export default function Window() {
  const nodeRef = useRef(null);
  const nodeRef2 = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: any, data: {x: number, y: number}) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Draggable
        nodeRef={nodeRef}
        position={position}
        onDrag={handleDrag}
        cancel="button"
        onStart={() => setIsDragging(true)}
        onStop={() => setIsDragging(false)}
      >
        <div ref={nodeRef} className={`${styles.navBar} ${isDragging && styles.dragging}`}>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: 'center', gap: 10}}>
            <IoTerminal color="#a89bc9" size={25} />
            <p className={styles.header}>Portfolio</p>
          </div>
          
          <div className={styles.bttns}>
            <button onClick={() => {console.log("Minimize CLICKED")}} className={styles.bttn}>
              <div className={styles.windowButton}>_</div>
            </button>
            <button onClick={() => {console.log("Resize CLICKED")}} className={styles.bttn}>
              <div className={styles.windowButton}><IoBrowsersOutline /></div>
            </button>
            <button onClick={() => {console.log("Close CLICKED")}} className={styles.bttn}>
              <div className={styles.windowButton}><MdOutlineClose /></div>
            </button>
          </div>
        </div>
      </Draggable>
      <Draggable nodeRef={nodeRef2} position={position} disabled>
        <div ref={nodeRef2} className={styles.contentBox} />
      </Draggable>
    </div>
  );
}
