import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PasswordInputStep } from './components/PasswordInputStep';
import { ScanningStep } from './components/ScanningStep';
import { ResultStep } from './components/ResultStep';
import { PasswordSuggester } from './components/PasswordSuggester';
import { ChallengeMode } from './components/ChallengeMode';
import { ConclusionStep } from './components/ConclusionStep';
import { analyzePassword } from './utils/securityAnalyzer';
import { PasswordAnalysisResult } from './types/security';
import { soundEffects } from './utils/soundEffects';
import { Shield } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'suggester' | 'challenges'>('analyzer');
  const [analyzerPhase, setAnalyzerPhase] = useState<'input' | 'scanning' | 'result' | 'conclusion'>('input');
  const [testedPassword, setTestedPassword] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<PasswordAnalysisResult | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Sync mute state with soundEffects
  useEffect(() => {
    soundEffects.isMuted = isMuted;
  }, [isMuted]);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  // 1. User clicked "Continuar" in password creation
  const handlePasswordSubmit = (fictitiousPassword: string) => {
    setTestedPassword(fictitiousPassword);
    setAnalyzerPhase('scanning');
  };

  // 2. Scanning animation completed -> compute result
  const handleScanComplete = () => {
    const result = analyzePassword(testedPassword);
    setAnalysisResult(result);
    setAnalyzerPhase('result');
  };

  // Reset/Clear memory
  const handleResetAll = () => {
    setTestedPassword('');
    setAnalysisResult(null);
    setAnalyzerPhase('input');
    setActiveTab('analyzer');
  };

  // Direct test from Passphrase Generator or Suggester
  const handleDirectTestPassword = (pwd: string) => {
    setTestedPassword(pwd);
    setActiveTab('analyzer');
    setAnalyzerPhase('scanning');
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-100 flex flex-col bg-cyber-grid bg-radial-gradient relative selection:bg-cyan-500 selection:text-slate-950">
      {/* Background ambient glowing nodes */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Header */}
      <Header
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'analyzer' && analyzerPhase === 'conclusion') {
            setAnalyzerPhase('input');
          }
        }}
        onResetAll={handleResetAll}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col justify-start">
        {/* TAB 1: ANALYZER FLOW */}
        {activeTab === 'analyzer' && (
          <div className="w-full">
            {analyzerPhase === 'input' && (
              <PasswordInputStep onContinue={handlePasswordSubmit} />
            )}

            {analyzerPhase === 'scanning' && (
              <ScanningStep onScanComplete={handleScanComplete} />
            )}

            {analyzerPhase === 'result' && analysisResult && (
              <ResultStep
                analyzedPassword={testedPassword}
                result={analysisResult}
                onTestAnother={() => {
                  setTestedPassword('');
                  setAnalyzerPhase('input');
                }}
                onExploreTips={() => {
                  setActiveTab('suggester');
                }}
              />
            )}

            {analyzerPhase === 'conclusion' && (
              <ConclusionStep
                onCreateAnother={() => {
                  setTestedPassword('');
                  setAnalysisResult(null);
                  setAnalyzerPhase('input');
                }}
                onRetryChallenges={() => {
                  setActiveTab('challenges');
                }}
                onGoHome={() => {
                  handleResetAll();
                }}
                onClearSession={handleResetAll}
              />
            )}
          </div>
        )}

        {/* TAB 2: SUGGESTION OF SECURE PASSWORDS */}
        {activeTab === 'suggester' && (
          <PasswordSuggester
            onTestPasswordInSimulator={handleDirectTestPassword}
          />
        )}

        {/* TAB 3: CHALLENGE MODE */}
        {activeTab === 'challenges' && (
          <ChallengeMode
            onCompleteChallenges={() => {
              setActiveTab('analyzer');
              setAnalyzerPhase('conclusion');
            }}
          />
        )}
      </main>

      {/* Science Fair Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-6 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">
              Laboratório de Senhas Seguras
            </span>
            <span className="text-slate-500">•</span>
            <span>Projeto Didático para Feira de Ciências</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Execução 100% no navegador (Client-side)
            </span>
            <span>•</span>
            <span>Nenhuma senha é armazenada ou enviada</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
