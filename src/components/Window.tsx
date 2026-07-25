"use client";

import { useRef, useState } from "react";
import Draggable from "react-draggable";

export default function Window() {
  const nodeRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const resetPosition = () => {
    setPosition({ x: 500, y: 500 });
  }

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Draggable nodeRef={nodeRef} position={position} onDrag={handleDrag}>
        <div ref={nodeRef} style={{ backgroundColor: 'yellow', opacity: '50%', width: 100, height: 50, borderRadius: '10%' }}>
          <p>:¨ ·.· ¨:</p>
          <p>`· . 𐙚</p>
        </div>
      </Draggable>
      <button onClick={resetPosition}>Reset</button>
    </div>
  );
}
