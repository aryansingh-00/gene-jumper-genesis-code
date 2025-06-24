
import React from 'react';
import { Pause, Zap, Shield, ArrowUp } from 'lucide-react';

interface GameHUDProps {
  health: number;
  abilities: {
    jump: number;
    speed: number;
    shield: boolean;
  };
  onPause: () => void;
  onJump: () => void;
  onGeneEdit: () => void;
  score: number;
}

const GameHUD: React.FC<GameHUDProps> = ({ 
  health, 
  abilities, 
  onPause, 
  onJump, 
  onGeneEdit, 
  score 
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="flex justify-between items-start p-4 pointer-events-auto">
        {/* DNA Health Bar */}
        <div className="bg-black/20 backdrop-blur-md rounded-lg p-3 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-300 text-sm font-mono">DNA INTEGRITY</span>
          </div>
          <div className="relative w-40 h-4 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-green-400 transition-all duration-300 ease-out"
              style={{ width: `${health}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              {/* DNA Helix Pattern */}
              <div className="flex space-x-1">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-1 h-1 bg-white/60 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-cyan-300 text-xs mt-1 font-mono">{health}/100</div>
        </div>

        {/* Score and Abilities */}
        <div className="bg-black/20 backdrop-blur-md rounded-lg p-3 border border-purple-500/30">
          <div className="text-purple-300 text-sm font-mono mb-2">SCORE: {score}</div>
          <div className="flex gap-2">
            {/* Jump Ability */}
            <div className="flex items-center gap-1">
              <ArrowUp className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-300 font-mono">x{abilities.jump}</span>
            </div>
            
            {/* Speed Ability */}
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-yellow-300 font-mono">x{abilities.speed}</span>
            </div>
            
            {/* Shield Ability */}
            <div className="flex items-center gap-1">
              <Shield className={`w-4 h-4 ${abilities.shield ? 'text-green-400' : 'text-gray-500'}`} />
            </div>
          </div>
        </div>

        {/* Pause Button */}
        <button
          onClick={onPause}
          className="bg-black/30 backdrop-blur-md hover:bg-black/50 rounded-full p-3 border border-white/20 transition-all duration-200 hover:scale-105"
        >
          <Pause className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Mobile Touch Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-auto md:hidden">
        {/* Jump Button */}
        <button
          onTouchStart={onJump}
          className="bg-cyan-500/20 backdrop-blur-md hover:bg-cyan-500/30 rounded-full p-6 border border-cyan-500/50 transition-all duration-200 active:scale-95"
        >
          <ArrowUp className="w-8 h-8 text-cyan-400" />
        </button>

        {/* Gene Edit Button */}
        <button
          onTouchStart={onGeneEdit}
          className="bg-purple-500/20 backdrop-blur-md hover:bg-purple-500/30 rounded-full p-6 border border-purple-500/50 transition-all duration-200 active:scale-95"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="text-purple-400 font-bold text-lg">E</span>
          </div>
        </button>
      </div>

      {/* Game Instructions */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 pointer-events-auto">
        <div className="bg-black/20 backdrop-blur-md rounded-lg p-3 border border-white/10 max-w-xs">
          <h3 className="text-white text-sm font-bold mb-2">Controls:</h3>
          <div className="text-xs text-gray-300 space-y-1 font-mono">
            <div>↑ or SPACE: Jump</div>
            <div>← →: Move</div>
            <div>E: Edit Genes (on purple platforms)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
