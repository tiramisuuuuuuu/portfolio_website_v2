import Matter from 'matter-js';
import React, { RefObject, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';

// module aliases
var Engine = Matter.Engine,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

const SKILLS = ['boxA', 'boxB'];

export default function SkillsSection() {
  const nodeRefs = useRef(new Map<string, RefObject<HTMLDivElement | null>>());
  const dragIdRef = useRef<string>(null);

  const engineRef = useRef<Matter.Engine>(null);
  const bodiesRef = useRef(new Map<string, Matter.Body>());

  const requestAnimationFrameRef = useRef<number>(null);
  const startTimeRef = useRef<number>(null);

  useEffect(() => {
    const animate = (timestamp: DOMHighResTimeStamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;

      // requestAnimationFrameRef.current = requestAnimationFrame(animate);
    };

    // create physics engine and bodies
    engineRef.current = Engine.create();

    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var boxB = Bodies.rectangle(450, 50, 80, 80);
    var ground = Bodies.rectangle(400, 600, 800, 60, { isStatic: true });

    // save references to bodies
    bodiesRef.current.set('boxA', boxA);
    bodiesRef.current.set('boxB', boxB);

    // add all of the bodies to the world
    Composite.add(engineRef.current.world, [boxA, boxB, ground]);

    // start the animation loop
    requestAnimationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, []);

  function getNodeRef(skill: string) {
    let ref = nodeRefs.current.get(skill);

    if (!ref) {
      ref = React.createRef<HTMLDivElement>();
      nodeRefs.current.set(skill, ref);
    }

    return ref;
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 400,
        backgroundColor: 'grey',
      }}
    >
      {SKILLS.map((skill) => {
        const ref = getNodeRef(skill);

        return (
          <Draggable
            key={`${skill}-draggable`}
            nodeRef={ref}
            onStart={() => {
              dragIdRef.current = skill;
            }}
            onStop={() => {
              dragIdRef.current = null;
            }}
          >
            <div
              ref={ref}
              id={skill}
              style={{ width: 80, height: 80, backgroundColor: 'green' }}
            >
              {skill}
            </div>
          </Draggable>
        );
      })}
    </div>
  );
}
