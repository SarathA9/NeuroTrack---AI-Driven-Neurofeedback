import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useSession } from '../../contexts/SessionContext';

const NeuroVisualizer = ({ trainingType, sessionState }) => {
  const canvasRef = useRef(null);
  const { brainwaveData } = useSession();
  const animationRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || sessionState !== 'recording') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5 + 2,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
          color: getParticleColor(trainingType)
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [sessionState, trainingType]);

  return (
    <Box sx={{ width: '100%', height: '400px', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
        }}
      />
    </Box>
  );
};