
import React, { useEffect, useState } from 'react';
import { Play, HelpCircle, Volume2, VolumeX, Award, Settings } from 'lucide-react';

interface GameMenuProps {
  isVisible: boolean;
  onStartGame: () => void;
  onShowInstructions: () => void;
  highScore: number;
}

const GameMenu: React.FC<GameMenuProps> = ({ 
  isVisible, 
  onStartGame, 
  onShowInstructions, 
  highScore 
}) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showParticles, setShowParticles] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowParticles(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-cyan-900/50 flex items-center justify-center z-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating DNA molecules */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div className="w-2 h-2 bg-cyan-400/30 rounded-full"></div>
          </div>
        ))}
        
        {/* Animated DNA Helix */}
        <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 opacity-20">
          <div className="relative w-32 h-64">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-1 bg-cyan-400 rounded-full"
                style={{
                  top: `${i * 12}px`,
                  left: `${16 + Math.sin(i * 0.5) * 16}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Menu Container */}
      <div className="relative bg-black/30 backdrop-blur-md rounded-3xl p-8 border border-cyan-500/30 max-w-md w-full mx-4 animate-fade-in">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
            Gene Jumper
          </h1>
          <p className="text-cyan-300 text-lg">Explore • Edit • Evolve</p>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mx-auto mt-3"></div>
        </div>

        {/* High Score */}
        {highScore > 0 && (
          <div className="text-center mb-6 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Award className="w-5 h-5" />
              <span className="font-semibold">Best Score: {highScore}</span>
            </div>
          </div>
        )}

        {/* Menu Buttons */}
        <div className="space-y-4">
          <button
            onClick={onStartGame}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3 group"
          >
            <Play className="w-6 h-6 group-hover:animate-pulse" />
            Start Game
          </button>

          <button
            onClick={onShowInstructions}
            className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-xl border border-white/20 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3"
          >
            <HelpCircle className="w-5 h-5" />
            How to Play
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-xl border border-white/20 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
            >
              {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              Sound
            </button>

            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-xl border border-white/20 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            Jump through DNA strands • Edit genes • Unlock powers
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;
