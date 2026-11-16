import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle, 
  Sparkles, 
  Trophy
} from 'lucide-react';
import { QUIZ_CHALLENGES } from '../utils/educationalData';
import { soundEffects } from '../utils/soundEffects';

interface ChallengeModeProps {
  onCompleteChallenges: () => void;
}

export const ChallengeMode: React.FC<ChallengeModeProps> = ({ onCompleteChallenges }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const challenge = QUIZ_CHALLENGES[currentIdx];

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
      soundEffects.playSuccess();
    } else {
      soundEffects.playAlert();
    }
  };

  const handleNext = () => {
    soundEffects.playClick();
    if (currentIdx + 1 < QUIZ_CHALLENGES.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      soundEffects.playSuccess();
    }
  };

  const handleRestart = () => {
    soundEffects.playClick();
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-8">
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-3">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>QUIZ DA FEIRA DE CIÊNCIAS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Modo Desafio — Teste Seus Conhecimentos
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl mx-auto">
          Responda aos pequenos desafios interativos e veja se você está pronto para defender suas contas no mundo digital.
        </p>
      </div>

      {/* Main Challenge Box */}
      {!isFinished ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
          {/* Progress & Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <span className="text-xs font-mono text-amber-400 font-semibold uppercase flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Desafio {currentIdx + 1} de {QUIZ_CHALLENGES.length}
            </span>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                Pontuação: <strong className="text-amber-400 font-mono text-sm">{score}</strong> acerto{score === 1 ? '' : 's'}
              </span>
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${((currentIdx + (isAnswered ? 1 : 0)) / QUIZ_CHALLENGES.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-lg sm:text-2xl font-bold text-white mb-6 leading-snug">
            {challenge.question}
          </h3>

          {/* Multiple Choice Options */}
          <div className="space-y-3 mb-6">
            {challenge.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let optionStyle = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200';

              if (isAnswered) {
                if (opt.isCorrect) {
                  optionStyle = 'bg-emerald-950/30 border-emerald-500 text-emerald-200 font-semibold cyber-glow-emerald';
                } else if (isSelected && !opt.isCorrect) {
                  optionStyle = 'bg-rose-950/30 border-rose-500 text-rose-300';
                } else {
                  optionStyle = 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                  {isAnswered && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation after answering */}
          {isAnswered && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Explicação Educativa:</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {challenge.explanation}
                  </p>
                  <p className="text-xs text-amber-300/90 font-medium mt-2">
                    💡 {challenge.tips}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all"
                >
                  <span>{currentIdx + 1 === QUIZ_CHALLENGES.length ? 'Ver Resultado Final' : 'Próximo Desafio'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished Screen */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/20 to-yellow-500/30 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto cyber-glow-purple shadow-xl">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Desafios Concluídos com Sucesso!
            </h3>
            <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
              Você acertou <strong className="text-amber-400 font-mono text-base">{score}</strong> de <strong className="text-white font-mono text-base">{QUIZ_CHALLENGES.length}</strong> questões.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 max-w-lg mx-auto text-left space-y-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
              Seu Diagnóstico de Segurança:
            </span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {score >= 4 
                ? '🏆 Nível Especialista: Você compreendeu perfeitamente que comprimento, imprevisibilidade e 2FA são os verdadeiros pilares da segurança moderna!' 
                : '🛡️ Nível Aprendiz Cibernético: Você está no caminho certo! Lembre-se sempre de trocar senhas curtas por frases-senha longas e nunca reutilizar senhas.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Refazer os Desafios</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onCompleteChallenges();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg"
            >
              <span>Ir para a Conclusão &amp; Resumo de Ouro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
