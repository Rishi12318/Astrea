import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import lipstick from '../assets/lipstick.json';

interface Props {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<'anim' | 'text' | 'fade'>('anim');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 1200);
    const t2 = setTimeout(() => setPhase('fade'), 3200);
    const t3 = setTimeout(() => onComplete(), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${phase === 'fade' ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-48 h-48 md:w-64 md:h-64">
        <Lottie animationData={lipstick} loop={false} />
      </div>
      <div className={`mt-6 text-center transition-all duration-700 ${phase === 'anim' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-white">ASTREA</h1>
        <p className="mt-3 text-sm md:text-base text-white/50 tracking-widest uppercase">AI Beauty Platform</p>
      </div>
    </div>
  );
}
