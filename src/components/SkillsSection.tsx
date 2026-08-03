import Matter from 'matter-js';
import { useEffect, useRef, useState } from 'react';
import styles from './SkillsSection.module.css';
import HiSvg from '../assets/block-letters.svg';
import rectanglesJson from '../assets/rectangles.json';
import { FaAws, FaFigma, FaNode, FaPython, FaReact } from 'react-icons/fa';
import { DiDjango } from 'react-icons/di';
import { BiLogoPostgresql } from 'react-icons/bi';
import { FcLinux } from 'react-icons/fc';
import { SiPostman, SiTypescript, SiVite } from 'react-icons/si';
import { RiNextjsFill, RiTailwindCssFill } from 'react-icons/ri';
import { FaCss } from 'react-icons/fa6';

// module aliases
var Engine = Matter.Engine,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Composite = Matter.Composite,
  Query = Matter.Query;

const SKILLS = {
  Python: <FaPython color="#306998" size={40} />,
  AWS: <FaAws color="orange" size={40} />,
  React: <FaReact color="#61dbfb" size={40} />,
  Django: <DiDjango color="#092E20" size={40} />,
  Postgres: <BiLogoPostgresql color="#0064a5" size={40} />,
  Linux: <FcLinux size={40} />,
  Figma: <FaFigma color="#f24e1e" size={40} />,
  Postman: <SiPostman color="#FF6C37" size={30} />,
  Typescript: <SiTypescript color="#3178C6" size={30} />,
  Nodejs: <FaNode color="#339933" size={40} />,
  Nextjs: <RiNextjsFill color="black" size={40} />,
  Tailwind: <RiTailwindCssFill color="#22D3EE" size={40} />,
  CSS: <FaCss color="#663399" size={40} />,
  Vite: <SiVite color="#6B1EB9" size={30} />,
};

export default function SkillsSection() {
  const [parentElem, setParentElem] = useState<HTMLDivElement | null>(null);
  const parentDimensions = useRef<{ width: number; height: number }>(null);
  const [svgElem, setSvgElem] = useState<HTMLImageElement | null>(null);

  const engineRef = useRef<Matter.Engine>(null);
  const bodiesRef = useRef(new Map<string, Matter.Body>());
  const svgBodiesRef = useRef<Matter.Body[]>(null);
  const mousePosRef = useRef<{ x: number; y: number }>(null);
  const draggedBodyRef = useRef<string>(null);

  const requestAnimationFrameRef = useRef<number>(null);

  const createSvgBodies = (
    targetCenterX: number,
    targetCenterY: number,
    newWidth?: number,
    newHeight?: number
  ) => {
    if (!engineRef.current) return;

    const oldSvgBodies = svgBodiesRef.current;
    svgBodiesRef.current = null;

    if (oldSvgBodies) {
      oldSvgBodies.forEach((b) => {
        Composite.remove(engineRef.current!.world, b);
      });
    }

    const SVG_WIDTH = 478;
    const SVG_HEIGHT = 81;
    const scaleX = newWidth ? newWidth / SVG_WIDTH : 1;
    const scaleY = newHeight ? newHeight / SVG_HEIGHT : 1;

    const svgBodies = rectanglesJson.map((rect) => {
      // Move rectangle relative to SVG center, scale, then move to Matter center
      const x = (rect.x - SVG_WIDTH / 2) * scaleX + targetCenterX;

      const y = (rect.y - SVG_HEIGHT / 2) * scaleY + targetCenterY;

      return Bodies.rectangle(x, y, rect.width * scaleX, rect.height * scaleY, {
        isStatic: true,
        angle: (rect.angle * Math.PI) / 180,
      });
    });

    svgBodiesRef.current = svgBodies;

    Composite.add(engineRef.current.world, svgBodies);
  };

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
            Body.setPosition(body, {
              x: Math.random() * parentDimensions.current!.width,
              y: 0,
            });
          }
        });
      }

      requestAnimationFrameRef.current = requestAnimationFrame(animate);
    };

    if (!parentElem) return;

    // create physics engine and bodies
    engineRef.current = Engine.create();

    // create bodies for each skill
    Object.keys(SKILLS).forEach((id) => {
      const body = Bodies.circle(Math.random() * 800 + 10, 0, 25);

      bodiesRef.current.set(id, body);

      Composite.add(engineRef.current!.world, [body]);
    });

    // create a static body for the svg image
    createSvgBodies(200, 200);

    const ground = Bodies.rectangle(400, 400, 800, 10, { isStatic: true });
    const leftWall = Bodies.rectangle(0, 200, 10, 400, { isStatic: true });
    const rightWall = Bodies.rectangle(800, 200, 10, 400, { isStatic: true });
    const topWall = Bodies.rectangle(400, 0, 800, 10, { isStatic: true });

    // save references to bodies
    bodiesRef.current.set('ground', ground);
    bodiesRef.current.set('leftWall', leftWall);
    bodiesRef.current.set('rightWall', rightWall);
    bodiesRef.current.set('topWall', topWall);

    // add all of the bodies to the world
    Composite.add(engineRef.current.world, [
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
        const newGround = Bodies.rectangle(width / 2, height, width, 10, {
          isStatic: true,
        });
        const newLeftWall = Bodies.rectangle(0, height / 2, 10, height, {
          isStatic: true,
        });
        const newRightWall = Bodies.rectangle(width, height / 2, 10, height, {
          isStatic: true,
        });
        const newTopWall = Bodies.rectangle(width / 2, 0, width, 10, {
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
    if (!svgElem) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        if (parentDimensions.current) {
          createSvgBodies(
            parentDimensions.current.width / 2,
            parentDimensions.current.height / 2,
            width,
            height
          );
        }
      }
    });

    resizeObserver.observe(svgElem);

    return () => resizeObserver.disconnect();
  }, [svgElem]);

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
        position: 'relative',
        overflow: 'hidden',
        minHeight: 300,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className={styles.container}
    >
      {Object.entries(SKILLS).map(([skill, icon]) => (
        <div
          id={skill}
          key={`skill-${skill}`}
          style={{
            width: 50,
            height: 50,
            borderRadius: 40,

            position: 'absolute',
            left: 0,
            top: 0,
            transform: `translate(50%, %50)`,
          }}
          className={styles.iconDiv}
        >
          {icon}
        </div>
      ))}
      <img
        src={HiSvg}
        ref={(el) => setSvgElem(el)}
        width="200"
        style={{ width: '50%' }}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        className={styles.hiSvg}
      />
    </div>
  );
}
