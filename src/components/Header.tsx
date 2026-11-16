import React from 'react';
import { Shield, Volume2, VolumeX, RotateCcw, Lock, Award, BookOpen, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface HeaderProps {
  currentTab: 'analyzer' | 'suggester' | 'challenges';
  onSelectTab: (tab: 'analyzer' | 'suggester' | 'challenges') => void;
  onResetAll: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onResetAll,
  isMuted,
  onToggleMute
}) => {
  return (
    <header className="border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Lab Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/30 border border-cyan-500/40 cyber-glow-cyan shadow-lg">
              <Shield className="w-6 h-6 text-cyan-400" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Laboratório de Senhas Seguras
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Feira de Ciências
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                Simulador Educativo de Cibersegurança • 100% Local e Privado
              </p>
            </div>
          </div>

          {/* Action buttons (Sound toggle, reset) */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                onToggleMute();
                soundEffects.playClick();
              }}
              title={isMuted ? 'Ativar efeitos sonoros' : 'Silenciar efeitos sonoros'}
              aria-label={isMuted ? 'Ativar efeitos sonoros' : 'Silenciar efeitos sonoros'}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/50 bg-slate-900/80 text-slate-300 hover:text-cyan-400 text-xs flex items-center gap-1.5 transition-all"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Mudo</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Som Ativo</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onResetAll();
              }}
              title="Limpar memória e reiniciar laboratório"
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-rose-500/50 bg-slate-900/80 text-slate-300 hover:text-rose-400 text-xs flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-3 pt-2 border-t border-slate-800/80 overflow-x-auto text-xs sm:text-sm">
          <button
            onClick={() => {
              soundEffects.playClick();
              onSelectTab('analyzer');
            }}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
              currentTab === 'analyzer'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Simulador de Cadastro</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onSelectTab('suggester');
            }}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
              currentTab === 'suggester'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Sugestão de Criação de Senhas</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onSelectTab('challenges');
            }}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
              currentTab === 'challenges'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Desafios Interativos</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
