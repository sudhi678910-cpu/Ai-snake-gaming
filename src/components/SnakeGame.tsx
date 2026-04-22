import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { GameState } from '../types';
import { Trophy, RotateCcw, Play } from 'lucide-react';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    isGameOver: false,
    score: 0,
    highscore: Number(localStorage.getItem('snakeHighscore') || 0)
  });
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((snake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Check if food spawned on snake
      if (!snake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setState({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      isGameOver: false,
      score: 0,
      highscore: Number(localStorage.getItem('snakeHighscore') || 0)
    });
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (state.direction !== 'DOWN') setState(prev => ({ ...prev, direction: 'UP' }));
          break;
        case 'ArrowDown':
          if (state.direction !== 'UP') setState(prev => ({ ...prev, direction: 'DOWN' }));
          break;
        case 'ArrowLeft':
          if (state.direction !== 'RIGHT') setState(prev => ({ ...prev, direction: 'LEFT' }));
          break;
        case 'ArrowRight':
          if (state.direction !== 'LEFT') setState(prev => ({ ...prev, direction: 'RIGHT' }));
          break;
        case ' ':
          if (state.isGameOver) resetGame();
          else setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.direction, state.isGameOver]);

  useEffect(() => {
    if (state.isGameOver || isPaused) return;

    const moveSnake = () => {
      setState(prev => {
        const head = { ...prev.snake[0] };
        switch (prev.direction) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Collision Check (Walls)
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          return { ...prev, isGameOver: true };
        }

        // Collision Check (Self)
        if (prev.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
          return { ...prev, isGameOver: true };
        }

        const newSnake = [head, ...prev.snake];
        let newFood = prev.food;
        let newScore = prev.score;
        let newHighscore = prev.highscore;

        // Food Check
        if (head.x === prev.food.x && head.y === prev.food.y) {
          newFood = generateFood(newSnake);
          newScore += 10;
          if (newScore > newHighscore) {
            newHighscore = newScore;
            localStorage.setItem('snakeHighscore', String(newHighscore));
          }
        } else {
          newSnake.pop();
        }

        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          score: newScore,
          highscore: newHighscore
        };
      });
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [state.isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const cellSize = canvas.width / GRID_SIZE;

      // Clear background
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines subtly
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
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

      // Draw snake
      state.snake.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#00f2ff' : '#007aff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = isHead ? '#00f2ff' : '#007aff';
        
        const x = segment.x * cellSize + 2;
        const y = segment.y * cellSize + 2;
        const size = cellSize - 4;
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw food
      const time = Date.now() / 1000;
      const pulse = Math.sin(time * 8) * 6 + 18;
      ctx.fillStyle = '#ff0055';
      ctx.shadowBlur = pulse;
      ctx.shadowColor = '#ff0055';
      const fx = state.food.x * cellSize + cellSize / 2;
      const fy = state.food.y * cellSize + cellSize / 2;
      ctx.beginPath();
      ctx.arc(fx, fy, cellSize / 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [state]);


  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full max-w-xl mx-auto">
      <div className="flex justify-between w-full font-mono text-sm tracking-widest text-cyan-400 mb-2 px-2">
        <div className="flex items-center gap-2">
          <Trophy size={16} />
          <span>SCORE: {state.score.toString().padStart(4, '0')}</span>
        </div>
        <div className="opacity-50">
          <span>HIGH: {state.highscore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative group">
        {/* Neon Border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        
        <div className="relative bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full h-auto aspect-square block"
          />

          <AnimatePresence>
            {(isPaused || state.isGameOver) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6"
              >
                {state.isGameOver ? (
                  <>
                    <h2 className="text-4xl font-bold text-red-500 mb-2 font-display tracking-tighter uppercase italic">System Failure</h2>
                    <p className="text-zinc-400 mb-8 font-mono text-sm">CRITICAL COLLISION DETECTED</p>
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 px-8 py-3 bg-red-500/10 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 group font-bold uppercase tracking-widest text-xs"
                    >
                      <RotateCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                      Reboot Core
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-bold text-cyan-400 mb-8 font-display tracking-tighter uppercase italic">Ready to Sync?</h2>
                    <button
                      onClick={() => setIsPaused(false)}
                      className="flex items-center gap-2 px-8 py-3 bg-cyan-500/10 border border-cyan-500 text-cyan-400 rounded-full hover:bg-cyan-500 hover:text-black transition-all transform hover:scale-105 active:scale-95 group font-bold uppercase tracking-widest text-xs"
                    >
                      <Play size={18} />
                      Initialize
                    </button>
                    <p className="mt-6 text-zinc-500 font-mono text-[10px] uppercase tracking-tighter">Use Arrow Keys to Navigate · Space to Pause</p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
