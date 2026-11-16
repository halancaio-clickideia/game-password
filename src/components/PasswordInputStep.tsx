import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ShieldAlert, Sparkles, KeyRound, Info } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface PasswordInputStepProps {
  onContinue: (fictitiousPassword: string) => void;
}

export const PasswordInputStep: React.FC<PasswordInputStepProps> = ({ onContinue }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emptyError, setEmptyError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setEmptyError(true);
      soundEffects.playAlert();
      return;
    }
    setEmptyError(false);
    soundEffects.playClick();
    onContinue(password);
  };

  const handleApplyExample = (example: string) => {
    setPassword(example);
    setEmptyError(false);
    soundEffects.playClick();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Hero Badge */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-medium mb-4 cyber-glow-cyan">
          <KeyRound className="w-4 h-4 text-cyan-400" />
          <span>Experimento Interativo de Cibersegurança</span>
        </div>

        {/* Title & Subtitle - EXACTLY AS REQUESTED */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Sua senha é realmente segura?
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
          Crie uma senha fictícia e descubra se ela está preparada para proteger suas informações.
        </p>
      </div>

      {/* Registration-like Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Subtle decorative glow line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"></div>

        {/* Mock Registration Header */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-800/80">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Passo 1 de 2 • Simulação de Acesso
            </span>
            <h3 className="text-base font-semibold text-white">Criar credencial de demonstração</h3>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 text-slate-400 text-xs font-mono">
            <span>MODO_FEIRA_DE_CIENCIAS</span>
          </div>
        </div>

        {/* Mandatory Educational Notice */}
        <div className="mb-6 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5 sm:p-4 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
            <span className="font-semibold text-amber-300 block mb-0.5">Aviso importante de segurança:</span>
            Utilize apenas uma senha fictícia. Nunca digite suas senhas pessoais ou reais nesta demonstração.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Neutral Password Field */}
          <div>
            <label 
              htmlFor="fictitious-password" 
              className="block text-sm font-medium text-slate-200 mb-2"
            >
              Digite uma senha fictícia para o teste:
            </label>

            <div className="relative">
              <input
                id="fictitious-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (emptyError) setEmptyError(false);
                }}
                placeholder="Exemplo: digite qualquer senha fictícia..."
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-slate-500 font-mono text-base focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />

              <button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword);
                  soundEffects.playClick();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                title={showPassword ? 'Ocultar senha' : 'Ver senha digitada'}
                aria-label={showPassword ? 'Ocultar senha' : 'Ver senha digitada'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* CRITICAL NOTE RESPECTED: No real-time strength bar, no colored feedback during typing */}
            <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400/80" />
              O campo é mantido neutro durante a digitação. A análise completa será calculada ao clicar em Continuar.
            </p>

            {emptyError && (
              <p className="mt-2 text-xs text-rose-400 flex items-center gap-1.5 font-medium animate-bounce">
                Por favor, digite uma senha fictícia ou clique em um dos exemplos rápidos abaixo.
              </p>
            )}
          </div>

          {/* Quick Fictitious Inspiration buttons for school fair visitors */}
          <div className="pt-2">
            <span className="text-xs text-slate-400 block mb-2 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Ou clique em uma senha fictícia de teste comum na feira:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'senha123', tag: 'Muito comum' },
                { label: 'Escola@2026', tag: 'Padrão com ano' },
                { label: 'flamengo10', tag: 'Futebol + número' },
                { label: '12345678', tag: 'Sequência numérica' },
                { label: 'rio-caderno-lua-trem-azul', tag: 'Frase de palavras' }
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleApplyExample(item.label)}
                  className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-500/40 text-slate-300 font-mono transition-all flex items-center gap-1.5"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-slate-400 font-sans opacity-75">({item.tag})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action button "Continuar" */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Nenhuma informação é salva ou enviada para a internet.
            </span>
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/25 transition-all transform active:scale-95"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </form>
      </div>

      {/* Didactic cards at bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5 text-left">
          <div className="text-cyan-400 font-semibold text-xs sm:text-sm mb-1">
            1. Análise Heurística
          </div>
          <p className="text-xs text-slate-400">
            Avaliamos tamanho, entropia, sequências e semelhança com bancos de senhas vazadas.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5 text-left">
          <div className="text-purple-400 font-semibold text-xs sm:text-sm mb-1">
            2. Tempo de Quebra
          </div>
          <p className="text-xs text-slate-400">
            Simulamos quanto tempo um supercomputador levaria para testar as combinações.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5 text-left">
          <div className="text-emerald-400 font-semibold text-xs sm:text-sm mb-1">
            3. Dicas Práticas
          </div>
          <p className="text-xs text-slate-400">
            Aprenda a transformar senhas fracas em frases-senha seguras e fáceis de lembrar.
          </p>
        </div>
      </div>
    </div>
  );
};
