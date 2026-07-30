import Matter from 'matter-js';
import { useEffect, useRef, useState } from 'react';
import styles from './SkillsSection.module.css';

// module aliases
var Engine = Matter.Engine,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Composite = Matter.Composite,
  Query = Matter.Query;

const SKILLS = ['boxA', 'boxB'];

export default function SkillsSection() {
  const [parentElem, setParentElem] = useState<HTMLDivElement | null>(null);
  const parentDimensions = useRef<{ width: number; height: number }>(null);

  const engineRef = useRef<Matter.Engine>(null);
  const bodiesRef = useRef(new Map<string, Matter.Body>());
  const mousePosRef = useRef<{ x: number; y: number }>(null);
  const draggedBodyRef = useRef<string>(null);

  const requestAnimationFrameRef = useRef<number>(null);

  useEffect(() => {
    const animate = (_: DOMHighResTimeStamp) => {
      if (draggedBodyRef.current) {
        const body = bodiesRef.current.get(draggedBodyRef.current);

        if (body && mousePosRef.current) {
          Body.setPosition(body, mousePosRef.current);
        }
      }

      if (engineRef.current) {
        Engine.update(engineRef.current, 1000 / 60);

        bodiesRef.current.forEach((body, id) => {
          const element = document.getElementById(id);

          if (element) {
            element.style.transform = `translate(${body.position.x}px, ${body.position.y}px)
                    translate(-50%, -50%)
                    rotate(${body.angle}rad)`;
          }
        });
      }

      if (parentDimensions.current) {
        bodiesRef.current.forEach((body) => {
          if (
            body.bounds.min.y > parentDimensions.current!.height ||
            body.bounds.max.y < 0 ||
            body.bounds.min.x > parentDimensions.current!.width ||
            body.bounds.max.x < 0
          ) {
            Body.setVelocity(body, { x: 0, y: 0 });
            Body.setPosition(body, { x: 80, y: 80 });
          }
        });
      }

      requestAnimationFrameRef.current = requestAnimationFrame(animate);
    };

    if (!parentElem) return;

    // create physics engine and bodies
    engineRef.current = Engine.create();

    const boxA = Bodies.rectangle(400, 200, 80, 80);
    const boxB = Bodies.rectangle(450, 50, 80, 80);
    const ground = Bodies.rectangle(400, 400, 800, 60, { isStatic: true });
    const leftWall = Bodies.rectangle(0, 200, 60, 400, { isStatic: true });
    const rightWall = Bodies.rectangle(800, 200, 60, 400, { isStatic: true });
    const topWall = Bodies.rectangle(400, 0, 800, 60, { isStatic: true });

    // save references to bodies
    bodiesRef.current.set('boxA', boxA);
    bodiesRef.current.set('boxB', boxB);
    bodiesRef.current.set('ground', ground);
    bodiesRef.current.set('leftWall', leftWall);
    bodiesRef.current.set('rightWall', rightWall);
    bodiesRef.current.set('topWall', topWall);

    // add all of the bodies to the world
    Composite.add(engineRef.current.world, [
      boxA,
      boxB,
      ground,
      leftWall,
      rightWall,
      topWall,
    ]);

    // start the animation loop
    requestAnimationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, [parentElem]);

  useEffect(() => {
    if (!parentElem) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        parentDimensions.current = { width, height };

        // get current walls
        const ground = bodiesRef.current.get('ground');
        const leftWall = bodiesRef.current.get('leftWall');
        const rightWall = bodiesRef.current.get('rightWall');
        const topWall = bodiesRef.current.get('topWall');

        if (
          !ground ||
          !leftWall ||
          !rightWall ||
          !topWall ||
          !engineRef.current
        )
          return;

        // create new walls with updated widths / heights and positions
        const newGround = Bodies.rectangle(width / 2, height, width, 60, {
          isStatic: true,
        });
        const newLeftWall = Bodies.rectangle(0, height / 2, 60, height, {
          isStatic: true,
        });
        const newRightWall = Bodies.rectangle(width, height / 2, 60, height, {
          isStatic: true,
        });
        const newTopWall = Bodies.rectangle(width / 2, 0, width, 60, {
          isStatic: true,
        });

        // add all of the walls to the world
        Composite.add(engineRef.current.world, [
          newGround,
          newLeftWall,
          newRightWall,
          newTopWall,
        ]);

        // update references to walls
        bodiesRef.current.set('ground', newGround);
        bodiesRef.current.set('leftWall', newLeftWall);
        bodiesRef.current.set('rightWall', newRightWall);
        bodiesRef.current.set('topWall', newTopWall);

        // remove previous walls
        Composite.remove(engineRef.current.world, ground);
        Composite.remove(engineRef.current.world, leftWall);
        Composite.remove(engineRef.current.world, rightWall);
        Composite.remove(engineRef.current.world, topWall);
      }
    });

    resizeObserver.observe(parentElem);

    return () => resizeObserver.disconnect();
  }, [parentElem]);

  useEffect(() => {
    if (!parentElem) return;

    const handlePointerDown = (e: PointerEvent) => {
      const rect = parentElem.getBoundingClientRect();

      const mouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      mousePosRef.current = mouse;

      const bodies = Array.from(bodiesRef.current.values());

      const hits = Query.point(
        bodies.filter((b) => !b.isStatic),
        mouse
      );

      if (hits.length > 0) {
        bodiesRef.current.forEach((b, id) => {
          if (hits[0].id === b.id) {
            draggedBodyRef.current = id;
          }
        });
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = parentElem.getBoundingClientRect();

      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const stopDragging = () => {
      draggedBodyRef.current = null;
    };

    parentElem.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopDragging);
    parentElem.addEventListener('pointerleave', stopDragging);

    return () => {
      parentElem.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopDragging);
      parentElem.removeEventListener('pointerleave', stopDragging);
    };
  }, [parentElem]);

  return (
    <div
      ref={(el) => setParentElem(el)}
      style={{
        flex: 1,
        backgroundColor: 'grey',
        position: 'relative',
        overflow: 'hidden',
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
      <div
        id={'ground'}
        style={{
          width: '100%',
          height: 10,
          backgroundColor: 'green',
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `translate(50%, %50)`,
        }}
      />
      <div
        id={'topWall'}
        style={{
          width: '100%',
          height: 10,
          backgroundColor: 'blue',
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `translate(50%, %50)`,
        }}
      />
      <div
        id={'rightWall'}
        style={{
          width: 10,
          height: '100%',
          backgroundColor: 'pink',
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `translate(50%, %50)`,
        }}
      />
      <div
        id={'leftWall'}
        style={{
          width: 10,
          height: '100%',
          backgroundColor: 'yellow',
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `translate(50%, %50)`,
        }}
      />
    </div>
  );
}
