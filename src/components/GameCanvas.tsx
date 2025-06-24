
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface GameState {
  player: {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityX: number;
    velocityY: number;
    onGround: boolean;
    health: number;
    abilities: {
      jump: number;
      speed: number;
      shield: boolean;
    };
  };
  platforms: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'dna' | 'gene';
    glowing: boolean;
  }>;
  particles: Array<{
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    life: number;
    maxLife: number;
    color: string;
  }>;
  camera: {
    x: number;
    y: number;
  };
}

interface GameCanvasProps {
  onGeneEdit: (geneData: any) => void;
  onGameOver: () => void;
  isPaused: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onGeneEdit, onGameOver, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const gameStateRef = useRef<GameState>({
    player: {
      x: 100,
      y: 300,
      width: 30,
      height: 40,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      health: 100,
      abilities: {
        jump: 1,
        speed: 1,
        shield: false
      }
    },
    platforms: [
      { x: 0, y: 450, width: 200, height: 20, type: 'dna', glowing: false },
      { x: 250, y: 400, width: 150, height: 20, type: 'dna', glowing: false },
      { x: 450, y: 350, width: 180, height: 20, type: 'gene', glowing: false },
      { x: 680, y: 300, width: 200, height: 20, type: 'dna', glowing: false },
      { x: 920, y: 250, width: 150, height: 20, type: 'gene', glowing: false }
    ],
    particles: [],
    camera: { x: 0, y: 0 }
  });

  // Game physics constants
  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;
  const MOVE_SPEED = 5;
  const FRICTION = 0.8;

  const createParticles = useCallback((x: number, y: number, color: string, count: number) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 10,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: (Math.random() - 0.5) * 4 - 2,
        life: 60,
        maxLife: 60,
        color
      });
    }
    
    gameStateRef.current.particles.push(...newParticles);
  }, []);

  const jump = useCallback(() => {
    const gameState = gameStateRef.current;
    if (gameState.player.onGround && !isPaused) {
      gameState.player.velocityY = JUMP_FORCE * gameState.player.abilities.jump;
      gameState.player.onGround = false;
      createParticles(gameState.player.x + gameState.player.width / 2, gameState.player.y + gameState.player.height, '#00ffff', 5);
    }
  }, [isPaused, createParticles]);

  const checkGeneInteraction = useCallback(() => {
    const gameState = gameStateRef.current;
    const player = gameState.player;
    const genePlatforms = gameState.platforms.filter(p => p.type === 'gene');
    
    for (const platform of genePlatforms) {
      if (player.x < platform.x + platform.width &&
          player.x + player.width > platform.x &&
          player.y < platform.y + platform.height &&
          player.y + player.height > platform.y) {
        onGeneEdit({
          platformId: platform,
          playerPosition: { x: player.x, y: player.y }
        });
        break;
      }
    }
  }, [onGeneEdit]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
      
      if (e.key === 'e' || e.key === 'Enter') {
        checkGeneInteraction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [jump, checkGeneInteraction]);

  const updateGame = useCallback(() => {
    if (isPaused) return;

    const gameState = gameStateRef.current;
    const player = gameState.player;

    // Handle input
    if (keysRef.current['arrowleft'] || keysRef.current['a']) {
      player.velocityX = -MOVE_SPEED * player.abilities.speed;
    } else if (keysRef.current['arrowright'] || keysRef.current['d']) {
      player.velocityX = MOVE_SPEED * player.abilities.speed;
    } else {
      player.velocityX *= FRICTION;
    }

    // Apply gravity
    player.velocityY += GRAVITY;

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Platform collision
    player.onGround = false;
    for (const platform of gameState.platforms) {
      if (player.x < platform.x + platform.width &&
          player.x + player.width > platform.x &&
          player.y + player.height > platform.y &&
          player.y + player.height < platform.y + platform.height + player.velocityY) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.onGround = true;
        platform.glowing = true;
      } else {
        platform.glowing = false;
      }
    }

    // Boundary collision
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > 1200) player.x = 1200 - player.width;
    
    // Death condition
    if (player.y > 600) {
      player.health = 0;
      onGameOver();
    }

    // Update camera
    gameState.camera.x = Math.max(0, player.x - 400);

    // Update particles
    gameState.particles = gameState.particles
      .map(p => ({
        ...p,
        x: p.x + p.velocityX,
        y: p.y + p.velocityY,
        life: p.life - 1
      }))
      .filter(p => p.life > 0);
  }, [isPaused, onGameOver]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = gameStateRef.current;

    // Clear canvas with animated background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw floating molecules (background effect)
    ctx.save();
    for (let i = 0; i < 20; i++) {
      const x = (i * 60 + Date.now() * 0.01) % (canvas.width + 100);
      const y = 50 + Math.sin(Date.now() * 0.002 + i) * 30;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 136, ${0.1 + Math.sin(Date.now() * 0.003 + i) * 0.1})`;
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(-gameState.camera.x, 0);

    // Draw platforms
    gameState.platforms.forEach(platform => {
      ctx.save();
      
      if (platform.type === 'dna') {
        // DNA strand platform
        const glowIntensity = platform.glowing ? 0.8 : 0.3;
        const gradient = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
        gradient.addColorStop(0, `rgba(0, 255, 136, ${glowIntensity})`);
        gradient.addColorStop(1, `rgba(0, 200, 100, ${glowIntensity * 0.6})`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // DNA helix pattern
        ctx.strokeStyle = `rgba(0, 255, 255, ${glowIntensity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < platform.width; x += 10) {
          const y1 = platform.y + 5 + Math.sin((x + Date.now() * 0.01) * 0.1) * 3;
          const y2 = platform.y + 15 + Math.sin((x + Date.now() * 0.01) * 0.1 + Math.PI) * 3;
          ctx.moveTo(platform.x + x, y1);
          ctx.lineTo(platform.x + x, y2);
        }
        ctx.stroke();
      } else {
        // Gene platform
        const glowIntensity = platform.glowing ? 1.0 : 0.5;
        const gradient = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
        gradient.addColorStop(0, `rgba(255, 100, 255, ${glowIntensity})`);
        gradient.addColorStop(1, `rgba(200, 50, 200, ${glowIntensity * 0.6})`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Gene markers
        ctx.fillStyle = `rgba(255, 255, 255, ${glowIntensity})`;
        for (let x = 10; x < platform.width; x += 30) {
          ctx.fillRect(platform.x + x, platform.y + 5, 4, 10);
        }
      }
      
      ctx.restore();
    });

    // Draw particles
    gameState.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw player
    const player = gameState.player;
    ctx.save();
    
    // Player glow effect
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    
    // Player body (glowing suit)
    const playerGradient = ctx.createRadialGradient(
      player.x + player.width / 2, player.y + player.height / 2, 0,
      player.x + player.width / 2, player.y + player.height / 2, player.width
    );
    playerGradient.addColorStop(0, '#00ffff');
    playerGradient.addColorStop(0.7, '#0088ff');
    playerGradient.addColorStop(1, '#004488');
    
    ctx.fillStyle = playerGradient;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Player helmet
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + 12, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    ctx.restore();
  }, []);

  const gameLoop = useCallback(() => {
    updateGame();
    drawGame();
    if (!isPaused) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [updateGame, drawGame, isPaused]);

  useEffect(() => {
    if (!isPaused) {
      gameLoop();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, gameLoop]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      className="border border-cyan-500/30 rounded-lg bg-gradient-to-b from-slate-900 to-slate-800"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default GameCanvas;
