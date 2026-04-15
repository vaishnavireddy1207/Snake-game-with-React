import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [shake, setShake] = useState(false);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 200);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          triggerShake();
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          triggerShake();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (Hardware feel)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food (Pulsing neon)
    const time = Date.now() / 200;
    const pulse = Math.sin(time) * 2 + 5;
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = pulse * 2;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake (Technical segments)
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ff00' : '#004400';
      
      if (isHead) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ff00';
      }
      
      ctx.fillRect(
        segment.x * cellSize + 2,
        segment.y * cellSize + 2,
        cellSize - 4,
        cellSize - 4
      );
      
      // Add a small detail to segments
      ctx.fillStyle = isHead ? '#ffffff' : '#00ff0033';
      ctx.fillRect(
        segment.x * cellSize + cellSize / 2 - 1,
        segment.y * cellSize + cellSize / 2 - 1,
        2,
        2
      );
      
      ctx.shadowBlur = 0;
    });

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
      <div className="flex justify-between items-end w-full px-2">
        <div className="flex flex-col gap-1">
          <span className="micro-label">System Status</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500 animate-pulse' : 'bg-neon-green shadow-[0_0_8px_#00ff00]'}`} />
            <span className="font-mono text-sm tracking-tighter">
              {isPaused ? 'IDLE_MODE' : 'ACTIVE_PROTOCOL'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <span className="micro-label">Data Harvested</span>
          <span className="font-mono text-3xl font-bold text-neon-green tracking-tighter">
            {score.toString().padStart(5, '0')}
          </span>
        </div>
      </div>

      <motion.div 
        className="relative hardware-surface p-1"
        animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.2 }}
      >
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="rounded-lg bg-black cursor-none w-full aspect-square max-w-[480px]"
        />
        
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md rounded-lg z-20"
            >
              <div className="border-y border-white/10 w-full py-12 flex flex-col items-center gap-6">
                {isGameOver ? (
                  <>
                    <motion.h2 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-5xl font-black text-red-500 tracking-tighter italic uppercase"
                    >
                      Protocol Failed
                    </motion.h2>
                    <p className="micro-label">Final Score: {score}</p>
                    <button
                      onClick={resetGame}
                      className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-neon-green transition-colors rounded-none skew-x-[-12deg]"
                    >
                      Reboot System
                    </button>
                  </>
                ) : (
                  <>
                    <motion.h2 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-6xl font-black text-white tracking-tighter italic uppercase"
                    >
                      Snake <span className="text-neon-green">OS</span>
                    </motion.h2>
                    <button
                      onClick={() => setIsPaused(false)}
                      className="px-10 py-4 bg-neon-green text-black font-black uppercase tracking-widest hover:bg-white transition-colors rounded-none skew-x-[-12deg]"
                    >
                      Initialize
                    </button>
                    <div className="flex gap-8 mt-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="micro-label">Movement</span>
                        <span className="text-[10px] text-white/60">WASD / ARROWS</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="micro-label">Pause</span>
                        <span className="text-[10px] text-white/60">SPACEBAR</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
