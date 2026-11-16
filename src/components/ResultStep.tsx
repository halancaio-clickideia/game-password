import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  Lock, 
  Unlock, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  ThumbsUp, 
  ArrowUpRight, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { PasswordAnalysisResult, CriterionStatus } from '../types/security';
import { soundEffects } from '../utils/soundEffects';

interface ResultStepProps {
  analyzedPassword: string;
  result: PasswordAnalysisResult;
  onTestAnother: () => void;
  onExploreTips: () => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({
  analyzedPassword,
  result,
  onTestAnother,
  onExploreTips
}) => {
  // Helper for criterion badge colors
  const getStatusBadge = (status: CriterionStatus) => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          dot: 'bg-emerald-400'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400'
        };
      case 'danger':
      default:
        return {
          icon: XCircle,
          color: 'text-rose-400',
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
          dot: 'bg-rose-400'
        };
    }
  };

  // Padlock animation & status based on crack time
  const isWeak = result.level === 'muito_fraca' || result.level === 'fraca';
  const isModerate = result.level === 'razoavel';
  const isStrong = result.level === 'forte' || result.level === 'muito_forte';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-8">
      {/* Top Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono mb-3">
          <span>RELATÓRIO_DE_SEGURANÇA #CIÊNCIA-2026</span>
        </div>
        {/* Exact title requested */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Resultado da análise da sua senha
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl mx-auto">
          Veja a classificação geral, o tempo estimado para decodificação e a avaliação detalhada de cada critério.
        </p>
      </div>

      {/* Main Score & Classification Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Background accent glow */}
        <div 
          className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
            isStrong ? 'bg-cyan-500' : isModerate ? 'bg-amber-500' : 'bg-rose-500'
          }`}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Visual Gauge / Level Badge */}
          <div className="md:col-span-5 flex flex-col items-center text-center p-6 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Classificação Geral
            </span>

            {/* Level Title */}
            <div className={`px-4 py-2 rounded-xl text-lg sm:text-xl font-extrabold border ${result.levelColor} ${result.levelBg} mb-3 flex items-center gap-2`}>
              {isStrong ? (
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              ) : isModerate ? (
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              ) : (
                <ShieldX className="w-5 h-5 text-rose-400" />
              )}
              <span>{result.levelTitle}</span>
            </div>

            {/* 5-Level Progress Indicator */}
            <div className="w-full mt-2 mb-3">
              <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1">
                <span>Muito Fraca</span>
                <span>Muito Forte</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 h-2.5">
                {[
                  { lvl: 'muito_fraca', color: 'bg-rose-500' },
                  { lvl: 'fraca', color: 'bg-orange-500' },
                  { lvl: 'razoavel', color: 'bg-amber-500' },
                  { lvl: 'forte', color: 'bg-emerald-500' },
                  { lvl: 'muito_forte', color: 'bg-cyan-400' }
                ].map((step, idx) => {
                  const activeLevelMap = {
                    muito_fraca: 0,
                    fraca: 1,
                    razoavel: 2,
                    forte: 3,
                    muito_forte: 4
                  };
                  const isActive = idx <= activeLevelMap[result.level];
                  return (
                    <div 
                      key={step.lvl} 
                      className={`rounded-full transition-all duration-500 ${
                        isActive ? step.color : 'bg-slate-800'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              {result.levelDescription}
            </p>
          </div>

          {/* Tested password box & stats */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Senha fictícia analisada:</span>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm sm:text-base text-cyan-300 select-all">
                <span className="truncate mr-2 font-semibold">
                  {analyzedPassword}
                </span>
                <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded font-sans shrink-0">
                  {result.passwordLength} caracteres
                </span>
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Pontuação Técnica:</span>
                <span className="text-lg font-bold text-white flex items-center gap-1.5">
                  {result.score} / 100
                  <span className="text-[11px] font-normal text-slate-400">pontos</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">Entropia Estimada:</span>
                <span className="text-lg font-bold text-cyan-300 flex items-center gap-1.5">
                  ~{result.crackTime.entropyBits} bits
                  <span className="text-[11px] font-normal text-slate-400">de força</span>
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              {result.isPassphrase ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  Padrão detectado: Frase-senha (Passphrase) com múltiplas palavras.
                </span>
              ) : (
                <span className="text-slate-400">
                  Dica de ouro: frases-senha longas com palavras aleatórias são fáceis de memorizar e imunes a ataques rápidos.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: SIMULADOR DE TEMPO PARA DESCOBRIR A SENHA */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              Simulação de Quebra por Força Bruta
            </div>
            {/* Exact title requested */}
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Quanto tempo levaria para descobrir sua senha?
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Animated Padlock Visual */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="relative mb-4">
              {/* Outer pulsing ring */}
              <div 
                className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
                  isStrong 
                    ? 'border-cyan-500/50 bg-cyan-500/10 cyber-glow-cyan text-cyan-400' 
                    : isModerate 
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' 
                      : 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                }`}
              >
                {isStrong ? (
                  <Lock className="w-10 h-10 animate-pulse text-cyan-400" />
                ) : isModerate ? (
                  <Lock className="w-10 h-10 text-amber-400" />
                ) : (
                  <Unlock className="w-10 h-10 text-rose-400 animate-bounce" />
                )}
              </div>
            </div>

            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Status da Proteção
            </span>
            <span className={`text-sm font-bold mt-1 ${isStrong ? 'text-cyan-400' : isModerate ? 'text-amber-400' : 'text-rose-400'}`}>
              {isStrong ? 'Cofre Blindado' : isModerate ? 'Resistência Média' : 'Vulnerável / Aberto'}
            </span>
          </div>

          {/* Crack time values & context */}
          <div className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Offline attack (GPU cluster) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                  1. Ataque Off-line (Supercomputador)
                </span>
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  <span className={isStrong ? 'text-cyan-400' : isModerate ? 'text-amber-400' : 'text-rose-400'}>
                    {result.crackTime.display}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Testando 100 bilhões de combinações por segundo com placas de vídeo potentes.
                </p>
              </div>

              {/* Online attack (Web / App with lockout) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                  2. Ataque On-line (Sites e Redes Sociais)
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">
                  {result.crackTime.onlineDisplay}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Sites reais ativam bloqueio e verificação após 5 a 10 erros consecutivos.
                </p>
              </div>
            </div>

            {/* Alternation & Length Power Explanation */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Por que a alternância de letras, números e símbolos é tão importante?
              </div>
              <p className="leading-relaxed text-slate-300">
                Usar apenas letras minúsculas limita o sistema a <strong>26 opções</strong> por letra. Ao alternar <strong>maiúsculas, minúsculas, números e símbolos especiais</strong>, você expande o alfabeto para <strong>94 opções</strong> por caractere! Isso faz uma senha de 11 caracteres saltar para mais de <strong>5 sextilhões de combinações</strong> possíveis.
              </p>
              <div className="text-[11px] text-cyan-400 font-medium">
                ★ A recomendação máxima: combine <strong>alternância completa</strong> com <strong>frases longas</strong> (ex: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-white font-mono">Ponte-Girassol@26</code>) para ter o padrão mais seguro do planeta!
              </div>
            </div>

            {/* Crucial Mandatory Disclaimer from prompt */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Nota didática sobre a estimativa:
              </p>
              Esta estimativa é didática e baseada em hipóteses de força bruta. Não é uma garantia real de segurança absoluta, pois o tempo real depende de vazamentos anteriores, se a senha já vazou na internet e de outros fatores como autenticação em duas etapas (2FA).
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: CRITERIA CHECKLIST (VERDE, AMARELO, VERMELHO) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="pb-4 mb-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
              Diagnóstico Detalhado
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Lista de verificação dos critérios técnicos
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Adequado
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Atenção
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span> Vulnerável
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {result.criteria.map((crit) => {
            const badge = getStatusBadge(crit.status);
            const Icon = badge.icon;

            return (
              <div 
                key={crit.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                      {crit.label}
                    </span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1 ${badge.bg}`}>
                      <Icon className="w-3 h-3" />
                      {crit.statusLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {crit.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: FEEDBACK EDUCATIVO PERSONALIZADO (DUAS ÁREAS DISTINTAS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* O que você fez bem? */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col">
          <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-emerald-500/20 text-emerald-400">
            <div className="p-1.5 rounded-lg bg-emerald-500/10">
              <ThumbsUp className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">
              O que você fez bem?
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300 flex-1">
            {result.whatYouDidWell.map((well, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{well}</span>
              </div>
            ))}
          </div>
        </div>

        {/* O que pode melhorar? */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col">
          <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-amber-500/20 text-amber-400">
            <div className="p-1.5 rounded-lg bg-amber-500/10">
              <ArrowUpRight className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white">
              O que pode melhorar?
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300 flex-1">
            {result.whatToImprove.map((improve, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{improve}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation & Action Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => {
            soundEffects.playClick();
            onTestAnother();
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400" />
          <span>Testar Outra Senha Fictícia</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onExploreTips();
          }}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ver Sugestões de Criação de Senhas</span>
        </button>
      </div>
    </div>
  );
};
