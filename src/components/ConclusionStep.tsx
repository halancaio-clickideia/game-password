import React from 'react';
import { 
  Trophy, 
  RotateCcw, 
  CheckCircle, 
  Key, 
  Lock, 
  ShieldCheck, 
  Smartphone, 
  UserX, 
  Sparkles, 
  Home, 
  Award,
  Layers
} from 'lucide-react';
import { GOLDEN_RULES } from '../utils/educationalData';
import { soundEffects } from '../utils/soundEffects';

interface ConclusionStepProps {
  onCreateAnother: () => void;
  onRetryChallenges: () => void;
  onGoHome: () => void;
  onClearSession: () => void;
}

export const ConclusionStep: React.FC<ConclusionStepProps> = ({
  onCreateAnother,
  onRetryChallenges,
  onGoHome,
  onClearSession
}) => {
  // Icon mapper for golden rules
  const renderIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Key': return <Key className="w-5 h-5 text-cyan-400" />;
      case 'Lock': return <Lock className="w-5 h-5 text-purple-400" />;
      case 'UserX': return <UserX className="w-5 h-5 text-rose-400" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-amber-400" />;
      case 'Vault': default: return <CheckCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      {/* Hero Celebration Banner */}
      <div className="text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-emerald-500/30 border border-cyan-400/40 flex items-center justify-center mb-6 cyber-glow-cyan shadow-2xl">
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-300 animate-pulse" />
        </div>

        {/* Exact phrase requested */}
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Parabéns! Você aprendeu a criar senhas mais seguras!
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Agora você conhece os segredos da matemática da segurança digital e sabe como proteger suas contas, jogos e redes sociais na internet.
        </p>
      </div>

      {/* Summary of 6 Golden Rules */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Guia de Bolso para o Mundo Real
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Resumo das Principais Recomendações
            </h3>
          </div>
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Padrão Feira de Ciências
          </span>
        </div>

        {/* 6 Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GOLDEN_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-4"
            >
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                {renderIcon(rule.icon)}
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                  {rule.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Practical summary takeaway */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-cyan-500/20 text-xs sm:text-sm text-slate-300 flex items-center gap-3">
          <Layers className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-cyan-300">A fórmula campeã:</strong> Frase com 4 palavras aleatórias + 2FA no celular + Gerenciador de senhas = Proteção quase impenetrável.
          </span>
        </div>
      </div>

      {/* Action Buttons as requested */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-center sm:justify-between gap-3">
        <button
          onClick={() => {
            soundEffects.playClick();
            onGoHome();
          }}
          className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
        >
          <Home className="w-4 h-4 text-slate-400" />
          <span>Voltar ao Início</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              soundEffects.playClick();
              onRetryChallenges();
            }}
            className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-amber-500/50 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Refazer os Desafios</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onCreateAnother();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Criar Outra Senha</span>
          </button>
        </div>
      </div>

      {/* Privacy Clear Memory Button */}
      <div className="text-center">
        <button
          onClick={() => {
            soundEffects.playClick();
            onClearSession();
          }}
          className="text-xs text-slate-500 hover:text-rose-400 transition-colors inline-flex items-center gap-1.5"
        >
          <span>🔒 Limpar dados e reiniciar completamente a sessão da feira</span>
        </button>
      </div>
    </div>
  );
};
