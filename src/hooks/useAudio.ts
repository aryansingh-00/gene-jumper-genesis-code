
import { useCallback, useRef } from 'react';

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, volume: number = 0.1) => {
    const audioContext = initAudioContext();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [initAudioContext]);

  const playJumpSound = useCallback(() => {
    playTone(440, 0.1, 0.05); // A note, short duration
  }, [playTone]);

  const playGeneEditSound = useCallback(() => {
    playTone(660, 0.2, 0.05); // E note, longer duration
  }, [playTone]);

  const playGameOverSound = useCallback(() => {
    playTone(220, 0.5, 0.05); // Low A note, long duration
  }, [playTone]);

  return {
    playJumpSound,
    playGeneEditSound,
    playGameOverSound
  };
};
