
import React, { useState, useCallback, useEffect } from 'react';
import GameCanvas from '../components/GameCanvas';
import GameHUD from '../components/GameHUD';
import GameMenu from '../components/GameMenu';
import GeneEditModal from '../components/GeneEditModal';
import InstructionsModal from '../components/InstructionsModal';
import { useToast } from '@/hooks/use-toast';
import { useAudio } from '../hooks/useAudio';

type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

const Index = () => {
  const { toast } = useToast();
  const { playJumpSound, playGeneEditSound, playGameOverSound } = useAudio();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [showGeneEdit, setShowGeneEdit] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playerStats, setPlayerStats] = useState({
    health: 100,
    abilities: {
      jump: 1,
      speed: 1,
      shield: false
    }
  });
  const [geneEditDifficulty, setGeneEditDifficulty] = useState(1);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('geneJumperHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Save high score when score updates
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('geneJumperHighScore', score.toString());
      toast({
        title: "New High Score!",
        description: `You scored ${score} points!`,
        duration: 3000,
      });
    }
  }, [score, highScore, toast]);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setPlayerStats({
      health: 100,
      abilities: {
        jump: 1,
        speed: 1,
        shield: false
      }
    });
    setGeneEditDifficulty(1);
    
    toast({
      title: "Gene Jumper Started!",
      description: "Jump through DNA strands and edit genes to evolve!",
      duration: 2000,
    });
  }, [toast]);

  const pauseGame = useCallback(() => {
    setGameState(gameState === 'paused' ? 'playing' : 'paused');
  }, [gameState]);

  const gameOver = useCallback(() => {
    setGameState('gameOver');
    playGameOverSound();
    
    setTimeout(() => {
      setGameState('menu');
    }, 3000);
    
    toast({
      title: "Game Over",
      description: `Final Score: ${score}. Your DNA integrity has been compromised!`,
      duration: 4000,
    });
  }, [score, toast, playGameOverSound]);

  const handleGeneEdit = useCallback(() => {
    setShowGeneEdit(true);
    setScore(prev => prev + 10);
    playGeneEditSound();
  }, [playGeneEditSound]);

  const handleGeneEditComplete = useCallback((newAbilities: any) => {
    setPlayerStats(prev => ({
      ...prev,
      abilities: {
        jump: newAbilities.jump || prev.abilities.jump,
        speed: newAbilities.speed || prev.abilities.speed,
        shield: newAbilities.shield || prev.abilities.shield
      }
    }));
    
    setScore(prev => prev + 50);
    setGeneEditDifficulty(prev => Math.min(prev + 1, 5));
    setShowGeneEdit(false);
    
    const abilityNames = [];
    if (newAbilities.jump) abilityNames.push('Enhanced Jump');
    if (newAbilities.speed) abilityNames.push('Speed Boost');
    if (newAbilities.shield) abilityNames.push('DNA Shield');
    
    toast({
      title: "Genetic Enhancement Complete!",
      description: abilityNames.length > 0 
        ? `Unlocked: ${abilityNames.join(', ')}`
        : "Gene sequence processed successfully!",
      duration: 3000,
    });
  }, [toast]);

  const handleJump = useCallback(() => {
    playJumpSound();
    const jumpEvent = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(jumpEvent);
  }, [playJumpSound]);

  const handleMobileGeneEdit = useCallback(() => {
    const editEvent = new KeyboardEvent('keydown', { key: 'e' });
    window.dispatchEvent(editEvent);
  }, []);

  // FIXED: Only increment score when actively playing (not paused)
  useEffect(() => {
    let scoreInterval: NodeJS.Timeout;
    
    if (gameState === 'playing') {
      scoreInterval = setInterval(() => {
        setScore(prev => prev + 1);
      }, 1000); // Add 1 point every second
    }
    
    return () => {
      if (scoreInterval) {
        clearInterval(scoreInterval);
      }
    };
  }, [gameState]); // Only depend on gameState, not score

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-cyan-900/30 flex flex-col items-center justify-center p-4">
      {/* Game Title */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
          Gene Jumper
        </h1>
        <p className="text-cyan-300 text-lg">Explore the Microscopic Universe</p>
      </div>

      {/* Game Container */}
      <div className="relative">
        {/* Game Canvas */}
        {gameState === 'playing' || gameState === 'paused' ? (
          <>
            <GameCanvas
              onGeneEdit={handleGeneEdit}
              onGameOver={gameOver}
              isPaused={gameState === 'paused'}
            />
            
            <GameHUD
              health={playerStats.health}
              abilities={playerStats.abilities}
              onPause={pauseGame}
              onJump={handleJump}
              onGeneEdit={handleMobileGeneEdit}
              score={score}
            />
            
            {/* Pause Overlay */}
            {gameState === 'paused' && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-black/80 rounded-2xl p-8 text-center border border-cyan-500/30">
                  <h2 className="text-3xl font-bold text-white mb-4">Game Paused</h2>
                  <p className="text-cyan-300 mb-6">Your DNA research is on hold</p>
                  <button
                    onClick={pauseGame}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    Resume Game
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Placeholder when game is not running */
          <div className="w-[800px] h-[500px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-cyan-500/30 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
              </div>
              <p className="text-cyan-300 text-lg">Ready to explore the genetic frontier?</p>
            </div>
          </div>
        )}
      </div>

      {/* Game Stats */}
      {gameState !== 'menu' && (
        <div className="mt-6 flex gap-6 text-center">
          <div className="bg-black/20 backdrop-blur-md rounded-lg p-3 border border-cyan-500/30">
            <div className="text-cyan-400 font-bold text-lg">{score}</div>
            <div className="text-cyan-300 text-sm">Current Score</div>
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-lg p-3 border border-purple-500/30">
            <div className="text-purple-400 font-bold text-lg">{highScore}</div>
            <div className="text-purple-300 text-sm">Best Score</div>
          </div>
        </div>
      )}

      {/* Modals */}
      <GameMenu
        isVisible={gameState === 'menu'}
        onStartGame={startGame}
        onShowInstructions={() => setShowInstructions(true)}
        highScore={highScore}
      />

      <GeneEditModal
        isOpen={showGeneEdit}
        onClose={() => setShowGeneEdit(false)}
        onComplete={handleGeneEditComplete}
        difficulty={geneEditDifficulty}
      />

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      {/* Background Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Index;
