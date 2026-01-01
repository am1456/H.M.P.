import { useEffect, useState } from "react";

const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    // Safely parse the target number (if it comes as a string or number)
    const end = parseInt(target) || 0;
    
    if (end === 0) return;

    const totalFrames = Math.round(duration / 16); // 60fps
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      
      // "easeOutQuad" logic makes the animation fast at start, slow at end
      const currentCount = Math.round(end * (1 - Math.pow(1 - progress, 2)));

      if (currentFrame === totalFrames) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(currentCount);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}</span>;
};

export default AnimatedCounter;