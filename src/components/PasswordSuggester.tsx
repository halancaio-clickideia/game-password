import React, { useState, useMemo } from 'react';
import { 
  Key, 
  Sparkles, 
  Copy, 
  Check, 
  Shuffle, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Type, 
  Hash, 
  Sliders, 
  MessageSquare,
  Clock,
  Layers,
  HelpCircle
} from 'lucide-react';
import { PASSPHRASE_WORDS } from '../utils/educationalData';
import { soundEffects } from '../utils/soundEffects';

interface PasswordSuggesterProps {
  onTestPasswordInSimulator: (pwd: string) => void;
}

type GeneratorMode = 'passphrase' | 'alphanumeric' | 'mnemonic';

const MNEMONIC_PRESETS = [
  'Meu cachorro Thor nasceu no verao de 2021!',
  'Gosto de olhar as estrelas no ceu em noites de verao 2024!',
  'Viajar pelo Brasil com meus melhores amigos em 2026!',
  'Estudo ciencias e programacao todos os dias desde 2022!',
  'Ouvir musica boa e andar de bicicleta aos domingos 2025!',
  'Aprender a tocar violao com meu professor em 2023!',
  'Tomar cafe quente lendo um bom livro em 2026!',
  'Nadar no mar azul nas ferias de janeiro de 2025!',
  'Comi quatro fatias de pizza com queijo no sabado 2024!',
  'Acordo cedo para ver o nascer do sol na praia 2026!'
];

export const PasswordSuggester: React.FC<PasswordSuggesterProps> = ({
  onTestPasswordInSimulator
}) => {
  const [mode, setMode] = useState<GeneratorMode>('passphrase');
  const [copied, setCopied] = useState(false);

  // Configuration states for Passphrase mode
  const [passphraseWordsCount, setPassphraseWordsCount] = useState<number>(4);
  const [includeUppercasePassphrase, setIncludeUppercasePassphrase] = useState<boolean>(true);
  const [includeNumberPassphrase, setIncludeNumberPassphrase] = useState<boolean>(true);
  const [includeSymbolPassphrase, setIncludeSymbolPassphrase] = useState<boolean>(true);

  // Configuration states for Alphanumeric mode
  const [alphaLength, setAlphaLength] = useState<number>(16);
  const [includeUpperAlpha, setIncludeUpperAlpha] = useState<boolean>(true);
  const [includeLowerAlpha, setIncludeLowerAlpha] = useState<boolean>(true);
  const [includeNumbersAlpha, setIncludeNumbersAlpha] = useState<boolean>(true);
  const [includeSymbolsAlpha, setIncludeSymbolsAlpha] = useState<boolean>(true);

  // State for Mnemonic mode
  const [mnemonicPhrase, setMnemonicPhrase] = useState<string>(
    'Meu cachorro Thor nasceu no verao de 2021!'
  );

  // Seed trigger to re-roll random generation
  const [seed, setSeed] = useState<number>(1);

  const handleReroll = () => {
    soundEffects.playScanTick(1.2);
    setSeed(prev => prev + 1);
    setCopied(false);

    if (mode === 'mnemonic') {
      const available = MNEMONIC_PRESETS.filter(p => p !== mnemonicPhrase);
      const nextPhrase = available[Math.floor(Math.random() * available.length)] || MNEMONIC_PRESETS[0];
      setMnemonicPhrase(nextPhrase);
    }
  };

  // Generate password based on active mode
  const suggestedPassword = useMemo(() => {
    // Reference seed to trigger re-computation
    void seed;

    if (mode === 'passphrase') {
      const words: string[] = [];
      const pool = [...PASSPHRASE_WORDS];
      for (let i = 0; i < passphraseWordsCount; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        let w = pool.splice(idx, 1)[0] || 'segura';
        if (includeUppercasePassphrase && (i === 0 || i === Math.floor(passphraseWordsCount / 2))) {
          w = w.charAt(0).toUpperCase() + w.slice(1);
        }
        words.push(w);
      }

      let res = words.join('-');
      if (includeSymbolPassphrase) {
        const symbols = ['#', '@', '!', '$', '%', '&'];
        const sym = symbols[Math.floor(Math.random() * symbols.length)];
        res += sym;
      }
      if (includeNumberPassphrase) {
        const num = Math.floor(Math.random() * 90 + 10);
        res += num.toString();
      }
      return res;
    }

    if (mode === 'alphanumeric') {
      let chars = '';
      if (includeLowerAlpha) chars += 'abcdefghijkmnopqrstuvwxyz'; // without ambiguous 'l'
      if (includeUpperAlpha) chars += 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // without ambiguous 'I', 'O'
      if (includeNumbersAlpha) chars += '23456789'; // without '0', '1'
      if (includeSymbolsAlpha) chars += '!@#$%&*_-+=';

      if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

      let pwd = '';
      for (let i = 0; i < alphaLength; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return pwd;
    }

    if (mode === 'mnemonic') {
      if (!mnemonicPhrase.trim()) {
        return 'DigiteUmaFraseAcima123!';
      }
      const words = mnemonicPhrase.trim().split(/\s+/);
      let initials = '';
      const casingStyle = seed % 3;

      words.forEach((w, idx) => {
        const clean = w.replace(/[^a-zA-Z0-9]/g, '');
        if (clean.length > 0) {
          let letter = clean.charAt(0);
          if (casingStyle === 0) {
            letter = idx % 2 === 0 ? letter.toUpperCase() : letter.toLowerCase();
          } else if (casingStyle === 1) {
            letter = idx % 2 === 1 ? letter.toUpperCase() : letter.toLowerCase();
          } else {
            letter = idx === 0 ? letter.toUpperCase() : letter.toLowerCase();
          }
          initials += letter;
        }
      });

      // Extract number from phrase or generate one based on seed
      const numberMatch = mnemonicPhrase.match(/\d+/);
      const numPart = numberMatch ? numberMatch[0] : (2020 + (seed % 7)).toString();

      // Diverse symbol pool
      const symbolPool = ['#', '@', '!', '$', '%', '&', '*'];
      const sym1 = symbolPool[seed % symbolPool.length];
      const sym2 = symbolPool[(seed + 3) % symbolPool.length];

      // Format variations
      const formatStyle = seed % 4;
      if (formatStyle === 0) {
        return `${initials}${sym1}${numPart}`;
      } else if (formatStyle === 1) {
        return `${initials}${sym1}${numPart}${sym2}`;
      } else if (formatStyle === 2) {
        return `${sym1}${initials}${numPart}`;
      } else {
        const mid = Math.max(1, Math.floor(initials.length / 2));
        return `${initials.slice(0, mid)}${sym1}${initials.slice(mid)}${numPart}`;
      }
    }

    return 'SenhaSegura@2026';
  }, [
    mode, 
    seed, 
    passphraseWordsCount, 
    includeUppercasePassphrase, 
    includeNumberPassphrase, 
    includeSymbolPassphrase,
    alphaLength, 
    includeUpperAlpha, 
    includeLowerAlpha, 
    includeNumbersAlpha, 
    includeSymbolsAlpha,
    mnemonicPhrase
  ]);

  const handleCopy = () => {
    soundEffects.playClick();
    navigator.clipboard.writeText(suggestedPassword).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Real-time rules checklist
  const hasUpper = /[A-Z]/.test(suggestedPassword);
  const hasLower = /[a-z]/.test(suggestedPassword);
  const hasNumber = /[0-9]/.test(suggestedPassword);
  const hasSpecial = /[^a-zA-Z0-9]/.test(suggestedPassword);
  const isLengthGood = suggestedPassword.length >= 14;
  const isNoObviousSeq = !/(123|abc|qwerty)/i.test(suggestedPassword);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
          <Key className="w-3.5 h-3.5 text-cyan-400" />
          <span>GERADOR E CONSULTORIA DE SEGURANÇA DIGITAL</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Sugestão de Criação de Senhas Seguras
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl mx-auto">
          Gere combinações que cumprem 100% das normas internacionais de segurança e aprenda técnicas para nunca mais esquecê-las.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => {
            soundEffects.playClick();
            setMode('passphrase');
            setCopied(false);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            mode === 'passphrase'
              ? 'bg-cyan-950/40 border-cyan-500 cyber-glow-cyan text-white'
              : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              1. Frase-Senha Completa
            </span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-semibold border border-cyan-500/40">
              Recomendado
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Palavras fáceis de lembrar com iniciais maiúsculas, símbolos e números. Padrão ouro mundial.
          </p>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setMode('alphanumeric');
            setCopied(false);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            mode === 'alphanumeric'
              ? 'bg-purple-950/40 border-purple-500 cyber-glow-purple text-white'
              : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-purple-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              2. Senha Criptográfica
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Alta densidade de caracteres aleatórios, ideal para cofres digitais e gerenciadores de senhas.
          </p>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setMode('mnemonic');
            setCopied(false);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            mode === 'mnemonic'
              ? 'bg-emerald-950/40 border-emerald-500 cyber-glow-emerald text-white'
              : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              3. Método Mnemônico
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold border border-emerald-500/40">
              Didático
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Digite uma frase que você adora e converta automaticamente nas iniciais com pontuação.
          </p>
        </button>
      </div>

      {/* Main Password Showcase Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
              Sugestão Gerada Localmente
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Sua senha forte personalizada
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Proteção Máxima (100% Segura)
            </span>
          </div>
        </div>

        {/* Password Display Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 mb-6 text-center relative group">
          <div className="text-xl sm:text-3xl font-mono font-black text-cyan-300 tracking-wide select-all break-all drop-shadow">
            {suggestedPassword}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Comprimento: <strong className="text-white font-mono">{suggestedPassword.length} caracteres</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Tempo de quebra: <strong className="text-emerald-400 font-semibold">Bilhões de anos</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              Alternância: <strong className="text-purple-300 font-semibold">Completa (A-Z, a-z, 0-9, !@#)</strong>
            </span>
          </div>
        </div>

        {/* Action Controls for the Password */}
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReroll}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-700 hover:border-slate-600 transition-all"
            >
              <Shuffle className="w-4 h-4 text-cyan-400" />
              <span>Gerar Outra Sugestão</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-700 hover:border-slate-600 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copiar Senha</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => {
              soundEffects.playClick();
              onTestPasswordInSimulator(suggestedPassword);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            <span>Testar no Simulador de Cadastro</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mode-Specific Settings Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 mb-8">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
            Ajustar parâmetros de criação:
          </span>

          {/* Mode 1: Passphrase Settings */}
          {mode === 'passphrase' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-slate-300">Quantidade de palavras da frase:</span>
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                  {[3, 4, 5].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => {
                        soundEffects.playClick();
                        setPassphraseWordsCount(cnt);
                      }}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                        passphraseWordsCount === cnt
                          ? 'bg-cyan-500 text-slate-950 shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {cnt} palavras
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={includeUppercasePassphrase}
                    onChange={(e) => {
                      soundEffects.playClick();
                      setIncludeUppercasePassphrase(e.target.checked);
                    }}
                    className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700"
                  />
                  <span className="text-xs text-slate-200">Iniciais Maiúsculas (A-Z)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={includeSymbolPassphrase}
                    onChange={(e) => {
                      soundEffects.playClick();
                      setIncludeSymbolPassphrase(e.target.checked);
                    }}
                    className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700"
                  />
                  <span className="text-xs text-slate-200">Símbolos (@, #, !, $)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={includeNumberPassphrase}
                    onChange={(e) => {
                      soundEffects.playClick();
                      setIncludeNumberPassphrase(e.target.checked);
                    }}
                    className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700"
                  />
                  <span className="text-xs text-slate-200">Números (0-9)</span>
                </label>
              </div>
            </div>
          )}

          {/* Mode 2: Alphanumeric Settings */}
          {mode === 'alphanumeric' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <div className="flex justify-between items-center mb-1 text-slate-300">
                  <span>Comprimento da senha:</span>
                  <span className="font-mono text-cyan-400 font-bold">{alphaLength} caracteres</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={alphaLength}
                  onChange={(e) => {
                    setAlphaLength(Number(e.target.value));
                  }}
                  className="w-full accent-cyan-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUpperAlpha}
                    onChange={(e) => {
                      soundEffects.playClick();
                      setIncludeUpperAlpha(e.target.checked);
                    }}
                    className="rounded text-cyan-500"
                  />
                  <span className="text-xs text-slate-200">Maiúsculas</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLowerAlpha}
                    onChange={(e) => {
                      soundEffects.playClick();
                      setIncludeLowerAlpha(e.target.checked);
                    }}
                    className="rounded text-cyan-500"
                  />
                  <span className="text-xs text-slate-200">Minúsculas</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbersAlpha}
                    onChange={(e) => {
                      soundEffects.playClick();
                      setIncludeNumbersAlpha(e.target.checked);
                    }}
                    className="rounded text-cyan-500"
                  />
                  <span className="text-xs text-slate-200">Números</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbolsAlpha}
                    onChange={(e) => {
                      soundEffects.playClick();
                      setIncludeSymbolsAlpha(e.target.checked);
                    }}
                    className="rounded text-cyan-500"
                  />
                  <span className="text-xs text-slate-200">Símbolos</span>
                </label>
              </div>
            </div>
          )}

          {/* Mode 3: Mnemonic Phrase Input */}
          {mode === 'mnemonic' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="block text-xs text-slate-300 font-medium">
                  Digite sua frase ou clique em um dos exemplos abaixo:
                </label>
                <button
                  type="button"
                  onClick={handleReroll}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 self-start sm:self-auto font-medium"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Sortear outra frase de exemplo</span>
                </button>
              </div>

              <input
                type="text"
                value={mnemonicPhrase}
                onChange={(e) => {
                  setMnemonicPhrase(e.target.value);
                  setSeed(prev => prev + 1);
                }}
                placeholder="Exemplo: Gosto de tocar violao nas tardes de domingo em 2026!"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 font-sans"
              />

              {/* Clickable phrase presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 mr-1">Sugestões rápidas:</span>
                {MNEMONIC_PRESETS.slice(0, 4).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setMnemonicPhrase(preset);
                      setSeed(prev => prev + 1);
                      setCopied(false);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      mnemonicPhrase === preset
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    "{preset.slice(0, 25)}..."
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-slate-400">
                💡 O algoritmo pega a primeira letra de cada palavra da frase, alterna maiúsculas e minúsculas, e junta a pontuação e os números.
              </p>
            </div>
          )}
        </div>

        {/* Real-time Cybersecurity Rules Checklist */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Regras de Segurança Atendidas por Esta Sugestão:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-slate-200 block">Comprimento Ideal:</strong>
                <span className="text-slate-400 text-[11px]">14 a 24 caracteres de proteção</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-slate-200 block">Letras Maiúsculas e Minúsculas:</strong>
                <span className="text-slate-400 text-[11px]">Alternância ampla (A-Z e a-z)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-slate-200 block">Números Integrados:</strong>
                <span className="text-slate-400 text-[11px]">Dígitos bem distribuídos</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-slate-200 block">Símbolos Especiais:</strong>
                <span className="text-slate-400 text-[11px]">Uso de caracteres (@, #, !, $)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-slate-200 block">Sem Sequências Óbvias:</strong>
                <span className="text-slate-400 text-[11px]">Sem "123456", "abc" ou "qwerty"</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-slate-200 block">Sem Dados Pessoais Diretos:</strong>
                <span className="text-slate-400 text-[11px]">Imune a pesquisas em redes sociais</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Tips Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
            <Lock className="w-4 h-4" />
            Como lembrar de senhas tão fortes?
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Se for uma <strong>Frase-Senha</strong> (ex: <span className="font-mono text-cyan-300">Nuvem-Castelo#Farol26</span>), basta imaginar um castelo no meio das nuvens com um farol iluminando! Nosso cérebro guarda imagens mentais com facilidade impressionante.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
            <ShieldCheck className="w-4 h-4" />
            Dica do Especialista em Segurança:
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Para as dezenas de sites e apps que você usa no dia a dia, utilize um <strong>Gerenciador de Senhas</strong> confiável (como Bitwarden ou o do próprio navegador). Assim você só precisa lembrar de <strong>uma única frase-senha mestra</strong>!
          </p>
        </div>
      </div>
    </div>
  );
};
