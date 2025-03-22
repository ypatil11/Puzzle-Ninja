
import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  velocity: {
    x: number;
    y: number;
  };
  alpha: number;
  decay: number;
  size: number;
}

const Fireworks: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const colors = [
    "#ff0000", "#00ff00", "#0000ff", "#ffff00", 
    "#ff00ff", "#00ffff", "#ff9900", "#9900ff"
  ];

  // Create firework at random position
  const createFirework = () => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight * 0.5);
    const particleCount = 40 + Math.floor(Math.random() * 30);
    
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        color,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        alpha: 1,
        decay: 0.01 + Math.random() * 0.02,
        size: 2 + Math.random() * 3
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };
  
  // Update particle positions
  useEffect(() => {
    let fireworkInterval: number;
    let animationId: number;
    
    // Create new fireworks periodically
    fireworkInterval = window.setInterval(() => {
      createFirework();
    }, 800);
    
    // Animation loop
    const animate = () => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            velocity: {
              x: particle.velocity.x * 0.98,
              y: particle.velocity.y * 0.98 + 0.1 // Add gravity
            },
            alpha: particle.alpha - particle.decay
          }))
          .filter(particle => particle.alpha > 0)
      );
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      clearInterval(fireworkInterval);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <div className="fireworks-container fixed inset-0 pointer-events-none z-40">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.alpha,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
          }}
        />
      ))}
    </div>
  );
};

export default Fireworks;
