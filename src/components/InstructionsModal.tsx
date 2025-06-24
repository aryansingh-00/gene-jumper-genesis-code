
import React from 'react';
import { X, ArrowUp, Zap, Shield } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-cyan-500/30 max-w-3xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            How to Play Gene Jumper
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Game Overview */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              Game Overview
            </h3>
            <p className="text-gray-300 leading-relaxed">
              You are a molecular explorer jumping through DNA strands in a microscopic world. 
              Your mission is to collect genetic material and edit genes to enhance your abilities 
              while navigating increasingly challenging platforms.
            </p>
          </section>

          {/* Controls */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              Controls
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                <h4 className="text-cyan-300 font-semibold mb-2">Desktop</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">↑</kbd> or <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">SPACE</kbd> - Jump</div>
                  <div><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">←</kbd> <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">→</kbd> - Move left/right</div>
                  <div><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">E</kbd> - Edit genes (on purple platforms)</div>
                </div>
              </div>
              <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                <h4 className="text-cyan-300 font-semibold mb-2">Mobile</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>Touch left/right sides to move</div>
                  <div>Tap jump button to jump</div>
                  <div>Tap gene edit button near purple platforms</div>
                </div>
              </div>
            </div>
          </section>

          {/* Platform Types */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              Platform Types
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-cyan-500/10 to-green-500/10 p-4 rounded-lg border border-cyan-500/20">
                <h4 className="text-cyan-300 font-semibold mb-2">DNA Strands (Cyan)</h4>
                <p className="text-sm text-gray-300">Basic platforms that glow when you land on them. Safe to jump on and provide particle effects.</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/20">
                <h4 className="text-purple-300 font-semibold mb-2">Gene Platforms (Purple)</h4>
                <p className="text-sm text-gray-300">Special platforms where you can edit genes. Press E to open the gene editor and unlock new abilities.</p>
              </div>
            </div>
          </section>

          {/* Gene Editing */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              Gene Editing System
            </h3>
            <div className="bg-black/20 p-4 rounded-lg border border-white/10 mb-4">
              <h4 className="text-white font-semibold mb-3">Base Pair Rules:</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded text-white font-bold flex items-center justify-center">A</span>
                  <span className="text-gray-300">pairs with</span>
                  <span className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded text-white font-bold flex items-center justify-center">T</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded text-white font-bold flex items-center justify-center">G</span>
                  <span className="text-gray-300">pairs with</span>
                  <span className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded text-white font-bold flex items-center justify-center">C</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Drag and drop the correct base pairs to complete the DNA sequence. Each successful gene edit unlocks powerful abilities!
            </p>
          </section>

          {/* Abilities */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              Genetic Abilities
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-black/20 p-4 rounded-lg border border-cyan-500/20 text-center">
                <ArrowUp className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <h4 className="text-cyan-300 font-semibold mb-1">Enhanced Jump</h4>
                <p className="text-xs text-gray-400">Jump higher and farther. Unlocked with Adenine-rich sequences.</p>
              </div>
              <div className="bg-black/20 p-4 rounded-lg border border-yellow-500/20 text-center">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h4 className="text-yellow-300 font-semibold mb-1">Speed Boost</h4>
                <p className="text-xs text-gray-400">Move faster across platforms. Unlocked with Thymine-rich sequences.</p>
              </div>
              <div className="bg-black/20 p-4 rounded-lg border border-green-500/20 text-center">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h4 className="text-green-300 font-semibold mb-1">DNA Shield</h4>
                <p className="text-xs text-gray-400">Protection from hazards. Requires balanced G-C base pairs.</p>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              Pro Tips
            </h3>
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4 rounded-lg border border-orange-500/20">
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Look for purple gene platforms to unlock new abilities</li>
                <li>• Experiment with different base pair combinations</li>
                <li>• Use particle effects to time your jumps perfectly</li>
                <li>• Combine abilities for maximum effectiveness</li>
                <li>• Don't fall off the screen - it's game over!</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 hover:scale-105"
          >
            Ready to Jump!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;
