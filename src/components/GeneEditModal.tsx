
import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';

interface BasePair {
  id: string;
  base: 'A' | 'T' | 'G' | 'C';
  paired: boolean;
  position: number;
}

interface GeneEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (abilities: { jump?: number; speed?: number; shield?: boolean }) => void;
  difficulty: number;
}

const GeneEditModal: React.FC<GeneEditModalProps> = ({ 
  isOpen, 
  onClose, 
  onComplete, 
  difficulty 
}) => {
  const [sequence, setSequence] = useState<BasePair[]>([]);
  const [targetSequence, setTargetSequence] = useState<BasePair[]>([]);
  const [selectedBase, setSelectedBase] = useState<BasePair | null>(null);
  const [matches, setMatches] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const basePairs: Record<'A' | 'T' | 'G' | 'C', 'A' | 'T' | 'G' | 'C'> = {
    'A': 'T',
    'T': 'A',
    'G': 'C',
    'C': 'G'
  } as const;

  const generateSequence = () => {
    const bases: ('A' | 'T' | 'G' | 'C')[] = ['A', 'T', 'G', 'C'];
    const length = Math.min(4 + difficulty, 8);
    
    const newSequence: BasePair[] = [];
    const newTargetSequence: BasePair[] = [];
    
    for (let i = 0; i < length; i++) {
      const randomBase = bases[Math.floor(Math.random() * bases.length)];
      const pairedBase = basePairs[randomBase];
      
      newSequence.push({
        id: `seq-${i}`,
        base: randomBase,
        paired: false,
        position: i
      });
      
      newTargetSequence.push({
        id: `target-${i}`,
        base: pairedBase,
        paired: false,
        position: i
      });
    }
    
    // Shuffle target sequence for puzzle
    const shuffledTarget = [...newTargetSequence].sort(() => Math.random() - 0.5);
    
    setSequence(newSequence);
    setTargetSequence(shuffledTarget);
    setMatches(0);
    setIsComplete(false);
    setSelectedBase(null);
    
    console.log('Generated sequence:', newSequence);
    console.log('Target sequence:', shuffledTarget);
  };

  useEffect(() => {
    if (isOpen) {
      console.log('Gene edit modal opened, generating sequence...');
      generateSequence();
    }
  }, [isOpen, difficulty]);

  const handleBaseClick = (clickedBase: BasePair, isFromTarget: boolean) => {
    console.log('Base clicked:', clickedBase, 'from target:', isFromTarget);
    
    if (isFromTarget) {
      setSelectedBase(clickedBase);
    } else if (selectedBase && !clickedBase.paired) {
      // Try to pair the selected base with the clicked sequence base
      if (basePairs[clickedBase.base] === selectedBase.base) {
        console.log('Valid pair found!');
        
        // Mark sequence base as paired
        setSequence(prev => prev.map(base => 
          base.id === clickedBase.id ? { ...base, paired: true } : base
        ));
        
        // Remove base from target sequence
        setTargetSequence(prev => prev.filter(base => base.id !== selectedBase.id));
        
        // Update matches
        setMatches(prev => {
          const newMatches = prev + 1;
          if (newMatches === sequence.length) {
            setIsComplete(true);
          }
          return newMatches;
        });
        
        setSelectedBase(null);
      } else {
        console.log('Invalid pair');
        // Visual feedback for wrong pair could be added here
        setSelectedBase(null);
      }
    }
  };

  const handleComplete = () => {
    console.log('Completing gene edit...');
    
    // Calculate abilities based on gene sequence
    const abilities: { jump?: number; speed?: number; shield?: boolean } = {};
    
    const aCount = sequence.filter(base => base.base === 'A').length;
    const tCount = sequence.filter(base => base.base === 'T').length;
    const gCount = sequence.filter(base => base.base === 'G').length;
    const cCount = sequence.filter(base => base.base === 'C').length;
    
    console.log('Base counts:', { aCount, tCount, gCount, cCount });
    
    if (aCount >= 2) abilities.jump = 1.5;
    if (tCount >= 2) abilities.speed = 1.3;
    if (gCount >= 2 && cCount >= 2) abilities.shield = true;
    
    console.log('Abilities unlocked:', abilities);
    
    onComplete(abilities);
    onClose();
  };

  const getBaseColor = (base: 'A' | 'T' | 'G' | 'C') => {
    switch (base) {
      case 'A': return 'from-red-400 to-red-600';
      case 'T': return 'from-blue-400 to-blue-600';
      case 'G': return 'from-green-400 to-green-600';
      case 'C': return 'from-yellow-400 to-yellow-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-cyan-500/30 max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Gene Editor</h2>
            <p className="text-cyan-300 text-sm">Click to select bases and pair them correctly</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Gene Sequence */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">DNA Sequence</h3>
            <div className="flex gap-2 justify-center flex-wrap">
              {sequence.map((base) => (
                <div key={base.id} className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-lg border-2 ${
                      base.paired 
                        ? 'border-green-400 bg-gradient-to-br ' + getBaseColor(base.base)
                        : 'border-gray-500 bg-gradient-to-br from-gray-600 to-gray-800 cursor-pointer hover:border-white'
                    } flex items-center justify-center text-white font-bold text-xl transition-all duration-200 hover:scale-105`}
                    onClick={() => handleBaseClick(base, false)}
                  >
                    {base.base}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {base.paired ? '✓' : '○'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Bases */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Available Bases</h3>
            <div className="flex gap-2 justify-center flex-wrap">
              {targetSequence.map((base) => (
                <div
                  key={base.id}
                  className={`w-16 h-16 rounded-lg border-2 ${
                    selectedBase?.id === base.id 
                      ? 'border-yellow-400 ring-2 ring-yellow-400/50'
                      : 'border-white/30'
                  } bg-gradient-to-br ${getBaseColor(base.base)} flex items-center justify-center text-white font-bold text-xl cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg`}
                  onClick={() => handleBaseClick(base, true)}
                >
                  {base.base}
                </div>
              ))}
            </div>
            {selectedBase && (
              <p className="text-center text-cyan-300 mt-2 text-sm">
                Selected: {selectedBase.base} - Click on its pair in the sequence above
              </p>
            )}
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Progress</span>
              <span className="text-cyan-300">{matches}/{sequence.length}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-cyan-500 to-green-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${sequence.length > 0 ? (matches / sequence.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Base Pair Reference */}
          <div className="mb-6 p-4 bg-black/20 rounded-lg border border-white/10">
            <h4 className="text-white font-semibold mb-2">Base Pair Rules:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded text-white text-xs flex items-center justify-center font-bold">A</span>
                <span className="text-gray-300">pairs with</span>
                <span className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">T</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded text-white text-xs flex items-center justify-center font-bold">G</span>
                <span className="text-gray-300">pairs with</span>
                <span className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded text-white text-xs flex items-center justify-center font-bold">C</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={generateSequence}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            
            {isComplete && (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105"
              >
                <Check className="w-4 h-4" />
                Apply Genetic Enhancement
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneEditModal;
