import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

function Leaf({
    deleteLeaf,    
}: { deleteLeaf: () => void; }) {
    const leafAttr = useMemo(() => {
        return ({
            icon: Math.random() < 0.5 ? '🍂' : '🍁',
            startX: Math.floor(Math.random() * 600) - 200,
            endX: -500,
            startRotate: Math.floor(Math.random() * 360),
            endRotate: Math.floor(Math.random() * 540),
        });
    }, []);
    
    return (
        <motion.p
            style={{
                position: 'absolute',
                right: 0,
            }}
            initial={{
                y: -50,
                x: leafAttr.startX,
                rotate: leafAttr.startRotate,
            }}
            animate={{
                y: window.innerHeight + 100,
                x: leafAttr.endX,
                rotate: leafAttr.endRotate,
                transition: { duration: 20, ease: "linear", }
            }}
            onAnimationComplete={deleteLeaf}
        >{leafAttr.icon}</motion.p>
    );
}

export default function Leaves() {
    const [leafKeys, setLeafKeys] = useState<string[]>([]);

    useEffect(() => {
        let timerId : number | undefined;
        const startTimer = () => {
            if (!document.hidden) {
                setLeafKeys(prev => {
                    if (prev.length >= 8) {
                        return prev;
                    }
                    return [...prev, crypto.randomUUID()]
                })
            }
            const delay = Math.floor(Math.random() * 3001) + 1000;
            timerId = setTimeout(startTimer, delay)
        }
        startTimer()
        return () => clearTimeout(timerId)
    }, [])

    const deleteLeaf = (key: string) => {
        setLeafKeys(prev => prev.filter(item => item !== key));
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {leafKeys.map((stableLeafKey) => 
                <Leaf
                    key={stableLeafKey}
                    deleteLeaf={() => deleteLeaf(stableLeafKey)}
                />
            )}
        </div>
    );
}
