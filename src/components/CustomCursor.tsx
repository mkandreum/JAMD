import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setActive(true);
    const handleMouseUp = () => setActive(false);
    
    // Track hover on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName.toLowerCase() === 'a' || 
          (e.target as HTMLElement).tagName.toLowerCase() === 'button' ||
          (e.target as HTMLElement).closest('a, button')) {
        setActive(true);
      }
    };
    
    const handleMouseOut = () => setActive(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <div className={active ? 'cursor-active' : ''}>
      <div 
        className="cursor-dot" 
        style={{ left: `${position.x}px`, top: `${position.y}px` }} 
      />
      <div 
        className="cursor-outline" 
        style={{ left: `${position.x}px`, top: `${position.y}px` }} 
      />
    </div>
  );
}
