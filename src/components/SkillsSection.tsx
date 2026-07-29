import Matter from 'matter-js';
import { useEffect, useRef, useState } from 'react';

// module aliases
var Engine = Matter.Engine,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint,
  World = Matter.World;

const SKILLS = ['boxA', 'boxB'];

export default function SkillsSection() {
  const [parentElem, setParentElem] = useState<HTMLDivElement | null>(null);

  const engineRef = useRef<Matter.Engine>(null);
  const bodiesRef = useRef(new Map<string, Matter.Body>());

  const requestAnimationFrameRef = useRef<number>(null);
  const prevTimestampRef = useRef<number>(null);

  useEffect(() => {
    const animate = (timestamp: DOMHighResTimeStamp) => {
      if (!prevTimestampRef.current) {
        prevTimestampRef.current = timestamp;
      }

      const elapsed = timestamp - prevTimestampRef.current;
      prevTimestampRef.current = timestamp;

      if (engineRef.current) {
        Engine.update(engineRef.current, elapsed);

        bodiesRef.current.forEach((body, id) => {
          const element = document.getElementById(id);

          if (element) {
            element.style.transform = `translate(${body.position.x}px, ${body.position.y}px)
                    translate(-50%, -50%)
                    rotate(${body.angle}rad)`;
          }
        });
      }

      requestAnimationFrameRef.current = requestAnimationFrame(animate);
    };

    if (!parentElem) return;

    // create physics engine and bodies
    engineRef.current = Engine.create();

    // accept mouse input in world
    const mouse = Mouse.create(parentElem);
    const mouseConstraint = MouseConstraint.create(engineRef.current, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    World.add(engineRef.current.world, mouseConstraint);

    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var boxB = Bodies.rectangle(450, 50, 80, 80);
    var ground = Bodies.rectangle(400, 400, 800, 60, { isStatic: true });

    // save references to bodies
    bodiesRef.current.set('boxA', boxA);
    bodiesRef.current.set('boxB', boxB);
    bodiesRef.current.set('ground', ground);

    // add all of the bodies to the world
    Composite.add(engineRef.current.world, [boxA, boxB, ground]);

    // start the animation loop
    requestAnimationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, [parentElem]);

  return (
    <div
      ref={(el) => setParentElem(el)}
      style={{
        position: 'relative',
        width: '100%',
        height: 400,
        backgroundColor: 'grey',
      }}
    >
      {SKILLS.map((skill) => (
        <div
          id={skill}
          style={{
            width: 80,
            height: 80,
            backgroundColor: 'green',
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `translate(50%, %50)`,
          }}
        >
          {skill}
        </div>
      ))}
    </div>
  );
}
