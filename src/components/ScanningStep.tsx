import React, { useEffect, useState } from 'react';
import { Shield, Cpu, Binary, Search, CheckCircle2, Lock } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface ScanningStepProps {
  onScanComplete: () => void;
}

const SCAN_STEPS = [
  { text: 'Medindo comprimento e diversidade de caracteres...', icon: Binary },
  { text: 'Varrendo sequências alfanuméricas e atalhos de teclado...', icon: Search },
  { text: 'Confrontando termos com dicionários de vazamentos e leetspeak...', icon: Cpu },
  { text: 'Calculando entropia matemática e tempo estimado de quebra...', icon: Lock }
];

export const ScanningStep: React.FC<ScanningStepProps> = ({ onScanComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    soundEffects.playScanTick(1);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next < SCAN_STEPS.length) {
          soundEffects.playScanTick(1 + next * 0.2);
          return next;
        }
        return prev;
      });
    }, 550);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(100, prev + 12);
      });
    }, 200);

    const finishTimeout = setTimeout(() => {
      soundEffects.playSuccess();
      onScanComplete();
    }, 2400);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(finishTimeout);
    };
  }, [onScanComplete]);

  return (
    <div className="w-full max-w-xl mx-auto py-8 text-center">
      {/* Animated Radar Shield */}
      <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
        {/* Radar concentric rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping opacity-30"></div>
        <div className="absolute -inset-3 rounded-full border border-cyan-400/30 animate-pulse"></div>
        <div className="absolute inset-0 rounded-full bg-slate-900/90 border-2 border-cyan-500/60 flex items-center justify-center shadow-xl cyber-glow-cyan">
          <Shield className="w-12 h-12 text-cyan-400 animate-pulse" />
        </div>
        {/* Rotating sweep line */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="w-full h-full bg-gradient-to-tr from-cyan-500/25 to-transparent animate-spin origin-center"></div>
        </div>
      </div>

      {/* Main Messages as requested */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
        Analisando sua senha...
      </h2>
      <p className="text-sm sm:text-base text-cyan-300/90 font-medium mb-8">
        Verificando comprimento, combinações e padrões de segurança.
      </p>

      {/* Diagnostic Console Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-left shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span className="text-xs text-slate-400 font-mono ml-2">cyber-scanner v2.6.4</span>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold">{progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-5">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Step list */}
        <div className="space-y-3 font-mono text-xs sm:text-sm">
          {SCAN_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div 
                key={step.text} 
                className={`flex items-center gap-3 transition-opacity duration-300 ${
                  isDone 
                    ? 'text-emerald-400 opacity-100' 
                    : isCurrent 
                      ? 'text-cyan-300 opacity-100' 
                      : 'text-slate-500 opacity-40'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Icon className={`w-4 h-4 shrink-0 ${isCurrent ? 'animate-spin text-cyan-400' : ''}`} />
                )}
                <span className="truncate">{step.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
