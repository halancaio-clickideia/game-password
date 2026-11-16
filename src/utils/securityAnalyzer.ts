import { 
  PasswordAnalysisResult, 
  SecurityCriterion, 
  SecurityLevel, 
  CrackTimeEstimate 
} from '../types/security';

// Common weak words in Portuguese and English
const COMMON_DICTIONARY_WORDS = [
  'senha', 'admin', 'password', 'login', 'brasil', 'futebol', 'amor', 'deus', 
  'familia', 'flamengo', 'corinthians', 'palmeiras', 'escola', 'mudar123', 
  'teste', 'root', 'master', 'super', 'usuario', 'secreta', 'bemvindo', 
  'iloveyou', 'sol', 'lua', 'casa', 'computador', 'internet', 'seguranca',
  'musica', 'chocolate', 'princesa', 'campeao', 'natureza', 'amizade',
  'estudante', 'professor', 'ciencias', 'lab', 'laboratorio', 'aluno', 'colegio'
];

// Common keyboard sequences
const KEYBOARD_SEQUENCES = [
  'qwerty', 'asdfgh', 'zxcvbn', 'qwertz', 'azerty',
  'poiuyt', 'lkjhgf', 'mnbvcx', '1qaz', '2wsx', '3edc',
  '4rfv', '5tgb', '6yhn', '7ujm', '8ik,', '9ol.', '0p;/'
];

// Common personal names often used in passwords
const COMMON_NAMES = [
  'pedro', 'maria', 'lucas', 'joao', 'ana', 'gabriel', 'felipe', 'julia',
  'matheus', 'beatriz', 'rodrigo', 'larissa', 'rafael', 'bruno', 'camila',
  'thiago', 'fernanda', 'diego', 'leticia', 'vitor'
];

/**
 * Normalizes leetspeak replacements to uncover hidden common words
 * e.g., "s3nh@" -> "senha"
 */
function normalizeLeetspeak(text: string): string {
  return text
    .toLowerCase()
    .replace(/@/g, 'a')
    .replace(/4/g, 'a')
    .replace(/3/g, 'e')
    .replace(/[1!|]/g, 'i')
    .replace(/0/g, 'o')
    .replace(/[$5]/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b');
}

/**
 * Finds sequential digits like 1234, 4321, 5678, etc.
 */
function findNumericSequences(pwd: string): boolean {
  if (pwd.length < 3) return false;
  for (let i = 0; i < pwd.length - 2; i++) {
    const c1 = pwd.charCodeAt(i);
    const c2 = pwd.charCodeAt(i + 1);
    const c3 = pwd.charCodeAt(i + 2);
    // Ascending numbers (e.g. 123, 789)
    if (c1 >= 48 && c1 <= 57 && c2 === c1 + 1 && c3 === c2 + 1) return true;
    // Descending numbers (e.g. 321, 987)
    if (c1 >= 48 && c1 <= 57 && c2 === c1 - 1 && c3 === c2 - 1) return true;
  }
  return false;
}

/**
 * Finds sequential letters like abc, def, cba, etc.
 */
function findAlphaSequences(pwd: string): boolean {
  const lower = pwd.toLowerCase();
  if (lower.length < 3) return false;
  for (let i = 0; i < lower.length - 2; i++) {
    const c1 = lower.charCodeAt(i);
    const c2 = lower.charCodeAt(i + 1);
    const c3 = lower.charCodeAt(i + 2);
    // Ascending letters (e.g. abc)
    if (c1 >= 97 && c1 <= 122 && c2 === c1 + 1 && c3 === c2 + 1) return true;
    // Descending letters (e.g. cba)
    if (c1 >= 97 && c1 <= 122 && c2 === c1 - 1 && c3 === c2 - 1) return true;
  }
  return false;
}

/**
 * Detects keyboard walks like qwerty, asdfgh
 */
function findKeyboardWalks(pwd: string): string | null {
  const lower = pwd.toLowerCase();
  for (const seq of KEYBOARD_SEQUENCES) {
    if (lower.includes(seq) || lower.includes(seq.slice(0, 4))) {
      return seq;
    }
  }
  return null;
}

/**
 * Detects character repetitions (e.g. 'aaa', '1111')
 */
function findRepetitions(pwd: string): boolean {
  return /(.)\1{2,}/.test(pwd);
}

/**
 * Checks for dates or years (e.g. 1950-2030 or DDMMYYYY)
 */
function findDatesOrYears(pwd: string): { found: boolean; detail?: string; year?: string } {
  // 4-digit years 1950 - 2030
  const yearMatch = pwd.match(/(19[5-9]\d|20[0-3]\d)/);
  if (yearMatch) {
    return { found: true, detail: `ano comum (${yearMatch[0]})`, year: yearMatch[0] };
  }
  // Date patterns: 8 digits DDMMYYYY or DDMMYY
  const datePattern = /(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])(19|20)?\d{2}/;
  if (datePattern.test(pwd)) {
    return { found: true, detail: 'padrão de data aparente (aniversário ou dia/mês/ano)' };
  }
  return { found: false };
}

/**
 * Checks if the password looks like a passphrase (multiple distinct words separated by hyphen, space or period)
 */
function checkIfPassphrase(pwd: string): boolean {
  const parts = pwd.split(/[-_. ]/);
  return parts.length >= 3 && parts.every(p => p.length >= 2) && pwd.length >= 14;
}

/**
 * Calculates estimated crack time for both online (rate-limited websites) and offline (GPU clusters)
 */
function calculateCrackTime(
  pwd: string, 
  hasSequences: boolean, 
  hasCommonWord: boolean,
  typeCount: number
): CrackTimeEstimate {
  if (!pwd || pwd.length === 0) {
    return {
      display: 'Instantaneamente',
      onlineDisplay: 'Instantaneamente',
      category: 'Instantaneamente',
      entropyBits: 0,
      guessesPerSecond: '100 bilhões/seg',
      details: 'Nenhuma senha fornecida.',
      relativeScore: 0
    };
  }

  let poolSize = 0;
  if (/[a-z]/.test(pwd)) poolSize += 26;
  if (/[A-Z]/.test(pwd)) poolSize += 26;
  if (/[0-9]/.test(pwd)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 33;

  if (poolSize === 0) poolSize = 10;

  // Base Shannon entropy
  let entropy = pwd.length * Math.log2(poolSize);

  // Proportional penalties
  if (hasCommonWord) {
    // If the password has 4 types and 10+ chars, the word is just a fragment, not the entire password
    if (typeCount >= 3 && pwd.length >= 10) {
      entropy = Math.max(25, entropy - 6);
    } else {
      entropy = Math.max(8, entropy - 18);
    }
  }

  if (hasSequences) {
    if (typeCount >= 3 && pwd.length >= 10) {
      entropy = Math.max(25, entropy - 5);
    } else {
      entropy = Math.max(8, entropy - 14);
    }
  }

  if (findRepetitions(pwd)) {
    entropy = Math.max(10, entropy - 8);
  }

  // Passphrase bonus (high length, word combinations)
  if (checkIfPassphrase(pwd)) {
    entropy += 12;
  }

  // Combinations against a high-end offline GPU rig (~100 billion fast hashes/sec)
  const log2GuessesPerSec = Math.log2(1e11); // ~36.5 bits
  const effectiveBits = entropy - log2GuessesPerSec;

  let display = '';
  let onlineDisplay = '';
  let category: CrackTimeEstimate['category'] = 'Instantaneamente';
  let relativeScore = 0;

  if (pwd.length < 6 || (/^(123456|password|senha|qwerty|admin)$/i.test(pwd.trim()))) {
    display = 'Instantaneamente (< 0,001 segundo)';
    onlineDisplay = 'Instantaneamente (testada em listas padrão)';
    category = 'Instantaneamente';
    relativeScore = 5;
  } else if (effectiveBits < 5) { // up to 32 seconds offline
    const seconds = Math.max(1, Math.round(Math.pow(2, effectiveBits)));
    display = `${seconds} segundo${seconds > 1 ? 's' : ''}`;
    onlineDisplay = 'Alguns minutos (contas sem proteção)';
    category = 'Segundos';
    relativeScore = 20;
  } else if (effectiveBits < 11) { // up to ~34 minutes offline
    const mins = Math.max(1, Math.round(Math.pow(2, effectiveBits) / 60));
    display = `${mins} minuto${mins > 1 ? 's' : ''}`;
    onlineDisplay = 'Vários dias (com bloqueio padrão de site)';
    category = 'Minutos';
    relativeScore = 38;
  } else if (effectiveBits < 16) { // up to ~18 hours offline
    const hours = Math.max(1, Math.round(Math.pow(2, effectiveBits) / 3600));
    display = `${hours} hora${hours > 1 ? 's' : ''}`;
    onlineDisplay = 'Vários meses (bloqueio por tentativas)';
    category = 'Horas';
    relativeScore = 52;
  } else if (effectiveBits < 22) { // up to ~48 days offline
    const days = Math.max(1, Math.round(Math.pow(2, effectiveBits) / 86400));
    display = `${days} dia${days > 1 ? 's' : ''}`;
    onlineDisplay = 'Dezenas de anos (bloqueio após 5 tentativas)';
    category = 'Dias';
    relativeScore = 65;
  } else if (effectiveBits < 26) { // up to ~2 years offline
    const months = Math.max(1, Math.round(Math.pow(2, effectiveBits) / (86400 * 30)));
    display = `${months} mês${months > 1 ? 'es' : ''}`;
    onlineDisplay = 'Centenas de anos (inviável para invasores)';
    category = 'Meses';
    relativeScore = 75;
  } else if (effectiveBits < 35) { // up to ~1000 years offline
    const years = Math.max(2, Math.round(Math.pow(2, effectiveBits) / (86400 * 365)));
    display = `${years.toLocaleString('pt-BR')} anos`;
    onlineDisplay = 'Completamente Impossível (inviável online)';
    category = 'Anos';
    relativeScore = 85;
  } else if (effectiveBits < 45) {
    const thousands = Math.round(Math.pow(2, effectiveBits) / (86400 * 365 * 1000));
    display = `${thousands.toLocaleString('pt-BR')} mil anos`;
    onlineDisplay = 'Completamente Impossível (inviável online)';
    category = 'Milhares de anos';
    relativeScore = 94;
  } else if (effectiveBits < 55) {
    const millions = Math.round(Math.pow(2, effectiveBits) / (86400 * 365 * 1e6));
    display = `${millions.toLocaleString('pt-BR')} milhões de anos`;
    onlineDisplay = 'Completamente Impossível (inviável online)';
    category = 'Milhões de anos';
    relativeScore = 98;
  } else {
    display = 'Bilhões de anos';
    onlineDisplay = 'Completamente Impossível (inviável online)';
    category = 'Bilhões de anos';
    relativeScore = 100;
  }

  return {
    display,
    onlineDisplay,
    category,
    entropyBits: Math.round(entropy),
    guessesPerSecond: '100 bilhões de tentativas/s',
    details: 'Baseado em supercomputador de ataque dedicado com GPUs modernas.',
    relativeScore
  };
}

/**
 * Main Analysis Engine - Scientifically Balanced & Educational
 */
export function analyzePassword(pwd: string): PasswordAnalysisResult {
  const criteria: SecurityCriterion[] = [];
  const whatYouDidWell: string[] = [];
  const whatToImprove: string[] = [];
  const detectedFlaws: string[] = [];

  const length = pwd.length;
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
  const isPassphrase = checkIfPassphrase(pwd);

  // Count character types present (0 to 4)
  const typeCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  // Check unique character diversity
  const uniqueChars = new Set(pwd.split('')).size;
  const uniqueRatio = length > 0 ? uniqueChars / length : 0;

  // Pattern tests
  const numSeq = findNumericSequences(pwd);
  const alphaSeq = findAlphaSequences(pwd);
  const kbWalk = findKeyboardWalks(pwd);
  const repetitions = findRepetitions(pwd);
  const dateInfo = findDatesOrYears(pwd);

  // Dictionary word and leetspeak checks
  const normalized = normalizeLeetspeak(pwd);
  let detectedWord: string | null = null;
  for (const word of COMMON_DICTIONARY_WORDS) {
    if (normalized.includes(word)) {
      detectedWord = word;
      break;
    }
  }

  // Name check
  let detectedName: string | null = null;
  for (const name of COMMON_NAMES) {
    if (normalized.includes(name)) {
      detectedName = name;
      break;
    }
  }

  // 1. COMPRIMENTO
  if (length >= 16) {
    criteria.push({
      id: 'length',
      label: 'Comprimento da senha',
      status: 'success',
      statusLabel: 'Excelente (16+ caracteres)',
      details: `${length} caracteres. Excelente barreira física contra supercomputadores e ataques de força bruta.`,
      category: 'length'
    });
    whatYouDidWell.push(`Sua senha possui um excelente comprimento (${length} caracteres), garantindo proteção de alto nível.`);
  } else if (length >= 12) {
    criteria.push({
      id: 'length',
      label: 'Comprimento da senha',
      status: 'success',
      statusLabel: 'Muito bom (12 a 15 caracteres)',
      details: `${length} caracteres. Cumpre os requisitos modernos recomendados por órgãos internacionais de cibersegurança.`,
      category: 'length'
    });
    whatYouDidWell.push(`Sua senha tem um comprimento sólido (${length} caracteres), ideal para contas do dia a dia.`);
  } else if (length >= 10) {
    // 10-11 chars is GOOD if it has high character variety, or warning if monotone
    const status = typeCount >= 3 ? 'success' : 'warning';
    criteria.push({
      id: 'length',
      label: 'Comprimento da senha',
      status,
      statusLabel: typeCount >= 3 ? 'Bom (10 a 11 caracteres)' : 'Atenção (10 a 11 caracteres)',
      details: `${length} caracteres. Comprimento adequado para uso comum${typeCount >= 3 ? ', potencializado pela boa mistura de caracteres' : ', mas poderia ter mais caracteres para maior segurança'}.`,
      category: 'length'
    });
    if (typeCount >= 3) {
      whatYouDidWell.push(`Comprimento adequado (${length} caracteres) com boa densidade de símbolos.`);
    } else {
      whatToImprove.push('Sua senha tem 10-11 caracteres. Aumentar para 14 ou mais caracteres tornará sua conta ainda mais protegida.');
    }
  } else if (length >= 8) {
    criteria.push({
      id: 'length',
      label: 'Comprimento da senha',
      status: 'warning',
      statusLabel: 'Mínimo comum (8 a 9 caracteres)',
      details: `${length} caracteres. Atende ao mínimo aceito por muitos sistemas antigos, mas computadores modernos conseguem testá-la com mais facilidade.`,
      category: 'length'
    });
    whatToImprove.push('Sua senha possui o tamanho mínimo tradicional (8-9 caracteres). Tente expandi-la para pelo menos 12 a 16 caracteres.');
  } else {
    criteria.push({
      id: 'length',
      label: 'Comprimento da senha',
      status: 'danger',
      statusLabel: 'Muito curta (< 8 caracteres)',
      details: `Apenas ${length} caractere${length === 1 ? '' : 's'}. Senhas curtas podem ser quebradas em segundos por robôs automatizados.`,
      category: 'length'
    });
    whatToImprove.push('Sua senha é muito curta! Tente utilizar pelo menos 12 caracteres, preferencialmente 16 ou mais.');
    detectedFlaws.push('Comprimento insuficiente para conter ataques de força bruta.');
  }

  // 2. LETRAS MAIÚSCULAS E MINÚSCULAS
  if (hasLower && hasUpper) {
    criteria.push({
      id: 'case_variety',
      label: 'Letras maiúsculas e minúsculas',
      status: 'success',
      statusLabel: 'Variedade presente',
      details: 'Contém combinação de letras maiúsculas e minúsculas.',
      category: 'variety'
    });
    whatYouDidWell.push('Você combinou letras maiúsculas e minúsculas, ampliando o conjunto de busca do alfabeto.');
  } else if (hasLower || hasUpper) {
    criteria.push({
      id: 'case_variety',
      label: 'Letras maiúsculas e minúsculas',
      status: isPassphrase ? 'success' : 'warning',
      statusLabel: hasLower ? 'Apenas minúsculas' : 'Apenas maiúsculas',
      details: isPassphrase 
        ? 'Em frases longas, a extensão das palavras compensa o uso apenas de minúsculas.' 
        : 'Alternar maiúsculas e minúsculas multiplica as possibilidades matemáticas da chave.',
      category: 'variety'
    });
    if (!isPassphrase) {
      whatToImprove.push('Sua senha usa apenas um tipo de letra. Misturar maiúsculas e minúsculas fortalece a proteção.');
    }
  } else {
    criteria.push({
      id: 'case_variety',
      label: 'Letras maiúsculas e minúsculas',
      status: 'danger',
      statusLabel: 'Nenhuma letra',
      details: 'A senha não contém letras, reduzindo drasticamente o número de combinações.',
      category: 'variety'
    });
    whatToImprove.push('Inclua letras em sua combinação para aumentar a imprevisibilidade.');
  }

  // 3. NÚMEROS
  if (hasNumber) {
    const endsWithSingleNumber = /[a-zA-Z]+[0-9]{1,3}$/.test(pwd);
    if (endsWithSingleNumber && length < 12 && typeCount < 4) {
      criteria.push({
        id: 'numbers',
        label: 'Presença de números',
        status: 'warning',
        statusLabel: 'Número no final (padrão comum)',
        details: 'Adicionar números apenas no final da senha é um dos padrões mais comuns previstos por softwares de ataque.',
        category: 'variety'
      });
      whatToImprove.push('Tente não colocar números apenas no final. Espalhá-los ou usá-los entre letras torna a quebra mais difícil.');
    } else {
      criteria.push({
        id: 'numbers',
        label: 'Presença de números',
        status: 'success',
        statusLabel: 'Números integrados',
        details: 'Contém dígitos numéricos bem distribuídos na composição.',
        category: 'variety'
      });
      whatYouDidWell.push('A presença de números acrescenta valor e variedade à sua senha.');
    }
  } else {
    criteria.push({
      id: 'numbers',
      label: 'Presença de números',
      status: isPassphrase ? 'success' : 'warning',
      statusLabel: isPassphrase ? 'Dispensável em frases longas' : 'Nenhum número',
      details: isPassphrase 
        ? 'Frases longas com palavras aleatórias dispensam a necessidade de números.'
        : 'Adicionar números expande o espaço de combinações possíveis.',
      category: 'variety'
    });
    if (!isPassphrase) {
      whatToImprove.push('Adicionar números pode dificultar ataques automatizados por dicionário de palavras.');
    }
  }

  // 4. CARACTERES ESPECIAIS
  if (hasSpecial) {
    criteria.push({
      id: 'special_chars',
      label: 'Caracteres especiais (!@#$)',
      status: 'success',
      statusLabel: 'Símbolos presentes',
      details: 'Contém símbolos e caracteres especiais, expandindo o alfabeto para mais de 90 possibilidades por caractere.',
      category: 'variety'
    });
    whatYouDidWell.push('A utilização de caracteres especiais (@, #, !, %, etc.) dificulta muito o trabalho de robôs de força bruta.');
  } else {
    criteria.push({
      id: 'special_chars',
      label: 'Caracteres especiais (!@#$)',
      status: isPassphrase ? 'success' : 'warning',
      statusLabel: isPassphrase ? 'Opcional em frases' : 'Sem símbolos especiais',
      details: isPassphrase 
        ? 'Separadores como hífens em frases-senha já cumprem papel de proteção com excelência.'
        : 'Símbolos especiais ampliam as combinações que o invasor precisa testar.',
      category: 'variety'
    });
    if (!isPassphrase) {
      whatToImprove.push('Experimente incluir ao menos um caractere especial (como @, !, #, - ou _) para reforçar sua chave.');
    }
  }

  // 5. PREVISIBILIDADE E SEQUÊNCIAS
  if (numSeq || alphaSeq || kbWalk) {
    const seqDesc = numSeq ? 'numérica (ex.: 123 ou 987)' : alphaSeq ? 'alfabética (ex.: abc)' : `de teclado (${kbWalk})`;
    criteria.push({
      id: 'predictability',
      label: 'Previsibilidade e sequências',
      status: 'danger',
      statusLabel: 'Sequência identificada',
      details: `Identificada sequência ${seqDesc}. Softwares de ataque testam essas sequências nos primeiros milissegundos.`,
      category: 'predictability'
    });
    whatToImprove.push(`Sua senha contém uma sequência previsível (${seqDesc}). Evite combinações como 123456 ou qwerty.`);
    detectedFlaws.push(`Sequência previsível detectada (${seqDesc}).`);
  } else {
    criteria.push({
      id: 'predictability',
      label: 'Previsibilidade e sequências',
      status: 'success',
      statusLabel: 'Sem sequências óbvias',
      details: 'Não foram encontradas sequências lineares simples ou atalhos de teclado.',
      category: 'predictability'
    });
    whatYouDidWell.push('Você não utilizou sequências previsíveis óbvias como "123456" ou "qwerty".');
  }

  // 6. REPETIÇÃO EXCESSIVA DE CARACTERES
  if (repetitions || (length > 6 && uniqueRatio < 0.45)) {
    criteria.push({
      id: 'repetition',
      label: 'Repetição de caracteres',
      status: 'danger',
      statusLabel: 'Repetições excessivas',
      details: 'Caracteres repetidos seguidos (ex.: "aaa", "111") diminuem a força real da senha.',
      category: 'patterns'
    });
    whatToImprove.push('Existem muitos caracteres repetidos seguidos. Procure variar mais os símbolos ao longo da senha.');
    detectedFlaws.push('Repetição excessiva de caracteres.');
  } else {
    criteria.push({
      id: 'repetition',
      label: 'Repetição de caracteres',
      status: 'success',
      statusLabel: 'Boa distribuição',
      details: 'Boa distribuição e variedade de caracteres sem repetições contínuas artificiais.',
      category: 'patterns'
    });
    whatYouDidWell.push('Boa distribuição de caracteres, sem repetições artificiais contínuas.');
  }

  // 7. PALAVRAS E COMBINAÇÕES MUITO COMUNS
  if (detectedWord) {
    const isIsolated = pwd.toLowerCase().trim() === detectedWord || length <= detectedWord.length + 3;
    criteria.push({
      id: 'common_words',
      label: 'Palavras de dicionário comum',
      status: isIsolated ? 'danger' : 'warning',
      statusLabel: `Termo comum detectado ("${detectedWord}")`,
      details: isIsolated 
        ? `A raiz "${detectedWord}" está nas listas mais vazadas do mundo. O ataque encontra quase de imediato.`
        : `A raiz "${detectedWord}" foi encontrada, porém misturada com outros caracteres que aumentam a proteção.`,
      category: 'patterns'
    });
    if (isIsolated) {
      whatToImprove.push(`Evite utilizar palavras muito comuns como "${detectedWord}". Invasores usam dicionários que testam essas palavras instantaneamente.`);
      detectedFlaws.push(`Palavra comum de dicionário identificada: "${detectedWord}".`);
    } else {
      whatToImprove.push(`Você incluiu o termo "${detectedWord}". Tente palavras menos óbvias para evitar ataques de dicionário.`);
    }
  } else {
    criteria.push({
      id: 'common_words',
      label: 'Palavras de dicionário comum',
      status: 'success',
      statusLabel: 'Sem termos batidos',
      details: 'Não foram encontrados termos clichês como "senha", "admin", "brasil" ou "futebol".',
      category: 'patterns'
    });
    whatYouDidWell.push('Você evitou palavras clichês de dicionário como "admin" ou "senha".');
  }

  // 8. PADRÕES DE TECLADO
  if (kbWalk) {
    criteria.push({
      id: 'keyboard_patterns',
      label: 'Padrões de teclado físico',
      status: 'danger',
      statusLabel: 'Caminho no teclado detectado',
      details: `Identificado movimento contíguo no teclado físico ("${kbWalk}"). Padrões de dedos vizinhos são fáceis de adivinhar.`,
      category: 'patterns'
    });
  } else {
    criteria.push({
      id: 'keyboard_patterns',
      label: 'Padrões de teclado físico',
      status: 'success',
      statusLabel: 'Sem trajetos contíguos',
      details: 'Não foram detectados atalhos ou trajetos lineares nas fileiras do teclado.',
      category: 'patterns'
    });
  }

  // 9. INFORMAÇÕES PESSOAIS OU DATAS (AVALIAÇÃO CONTEXTUAL)
  if (dateInfo.found || detectedName) {
    const isOnlyDate = length <= 8 && !hasSpecial && !hasLower;
    const isComplexWithYear = typeCount >= 3 && length >= 10;

    // If it's a rich password with 4 types and 10+ chars (e.g. Frm@2026FRM), this is just an ADVISORY WARNING (Yellow), not a DANGER (Red)
    const status: 'warning' | 'danger' = (isComplexWithYear && !detectedName) ? 'warning' : 'danger';

    const detailMsg = dateInfo.found && detectedName 
      ? `nome próprio ("${detectedName}") e ${dateInfo.detail}` 
      : dateInfo.found 
        ? `${dateInfo.detail}` 
        : `nome próprio ("${detectedName}")`;

    criteria.push({
      id: 'personal_info',
      label: 'Dados pessoais ou datas',
      status,
      statusLabel: status === 'warning' ? 'Ano identificado (Atenção)' : 'Dado previsível identificado',
      details: status === 'warning'
        ? `Identificado ${detailMsg}. Como sua senha possui outros caracteres variados e bom tamanho, ela continua forte, mas prefira números aleatórios no lugar de anos recentes.`
        : `Identificado ${detailMsg}. Golpistas costumam pesquisar perfis em redes sociais para testar aniversários e nomes de familiares.`,
      category: 'personal'
    });

    if (status === 'warning') {
      whatToImprove.push('Como recomendação adicional: substitua anos recentes (como 2026) por outros números ou caracteres aleatórios.');
    } else {
      whatToImprove.push('Evite incluir datas de nascimento, anos recentes ou nomes próprios. Essas são as primeiras informações testadas em ataques direcionados.');
      detectedFlaws.push(`Dado pessoal ou temporal detectado (${detailMsg}).`);
    }
  } else {
    criteria.push({
      id: 'personal_info',
      label: 'Dados pessoais ou datas',
      status: 'success',
      statusLabel: 'Sem datas óbvias ou nomes',
      details: 'Não foram detectados anos óbvios, datas de calendário ou nomes próprios populares.',
      category: 'personal'
    });
    whatYouDidWell.push('A senha parece livre de datas comemorativas ou nomes óbvios associados a redes sociais.');
  }

  // Extra positive recognition for 4-type variety
  if (typeCount === 4) {
    whatYouDidWell.push('Parabéns pela excelente diversidade: você combinou os 4 tipos de caracteres (maiúsculas, minúsculas, números e caracteres especiais)!');
  }

  // Extra positive recognition if passphrase
  if (isPassphrase) {
    whatYouDidWell.push('Excelente formato de frase-senha (passphrase)! O uso de várias palavras unidas é considerado padrão ouro por especialistas em segurança digital.');
  }

  // Fallback defaults if list is empty
  if (whatYouDidWell.length === 0) {
    whatYouDidWell.push('Você tomou a iniciativa de testar e verificar a segurança antes de colocar informações reais em risco.');
  }
  if (whatToImprove.length === 0) {
    whatToImprove.push('Mantenha o bom hábito de nunca reutilizar esta senha em outras plataformas e utilize sempre autenticação de dois fatores (2FA).');
  }

  // =========================================================================
  // CALCULATE OVERALL SCORE (0 - 100) - BALANCED CYBERSECURITY SCORING
  // =========================================================================
  let score = 0;

  // 1. Length contribution (up to 40 pts)
  if (length >= 16) score += 40;
  else if (length >= 14) score += 36;
  else if (length >= 12) score += 32;
  else if (length >= 10) score += 26;
  else if (length >= 8) score += 18;
  else if (length >= 6) score += 8;
  else score += Math.max(0, length * 1.5);

  // 2. Character Variety contribution (up to 35 pts)
  // Rewarding the user for following cybersecurity guidelines!
  if (typeCount === 4) score += 35; // Upper + Lower + Number + Special
  else if (typeCount === 3) score += 26;
  else if (typeCount === 2) score += 16;
  else score += 6;

  // 3. Uniqueness and Entropy bonus (up to 25 pts)
  if (uniqueChars >= 10) score += 20;
  else if (uniqueChars >= 7) score += 15;
  else if (uniqueChars >= 5) score += 10;
  else score += 4;

  if (uniqueRatio > 0.7 && length >= 8) score += 5;

  // 4. Passphrase bonus
  if (isPassphrase) score += 15;

  // 5. Penalties (Proportional & Fair)
  // Only severe if the password is built solely on the flaw
  if (detectedWord) {
    const isPureWord = pwd.toLowerCase().trim() === detectedWord;
    score -= isPureWord ? 35 : 12;
  }
  if (numSeq || alphaSeq) {
    const isEntirelySeq = (numSeq && /^\d+$/.test(pwd)) || (alphaSeq && /^[a-zA-Z]+$/.test(pwd));
    score -= isEntirelySeq ? 40 : 15;
  }
  if (kbWalk) score -= 18;
  if (repetitions) score -= 14;

  if (dateInfo.found) {
    // If the password has 4 character types and 10+ chars (e.g., Frm@2026FRM), the year penalty is mild (-5)
    // because the overall key space is already massive!
    if (typeCount >= 3 && length >= 10) {
      score -= 5;
    } else {
      score -= 15;
    }
  }

  if (detectedName) {
    score -= (length > 12 ? 10 : 20);
  }

  // Hard caps for truly trivial passwords
  if (length < 6) score = Math.min(score, 25);
  if (length < 8 && typeCount <= 2) score = Math.min(score, 35);
  if (/^(123456|password|senha|qwerty|12345678|123456789|admin)$/i.test(pwd.trim())) {
    score = 10;
  }

  // Final clamped score
  const finalScore = Math.min(100, Math.max(5, Math.round(score)));

  // =========================================================================
  // 5 SECURITY LEVELS MAPPING (BALANCED)
  // 1. Muito Fraca (5 - 30)
  // 2. Fraca (31 - 50)
  // 3. Razoável (51 - 68)
  // 4. Forte (69 - 86) -> Frm@2026FRM now sits comfortably around 77 pts!
  // 5. Muito Forte (87 - 100)
  // =========================================================================
  let level: SecurityLevel;
  let levelTitle: string;
  let levelColor: string;
  let levelBg: string;
  let levelDescription: string;

  if (finalScore <= 30) {
    level = 'muito_fraca';
    levelTitle = '1. Muito Fraca';
    levelColor = 'text-rose-400 border-rose-500/40';
    levelBg = 'bg-rose-500/10 text-rose-300';
    levelDescription = 'Vulnerabilidade alta. Comprimento curto ou padrão óbvio, quebrado em milissegundos por ferramentas básicas de invasão.';
  } else if (finalScore <= 50) {
    level = 'fraca';
    levelTitle = '2. Fraca';
    levelColor = 'text-orange-400 border-orange-500/40';
    levelBg = 'bg-orange-500/10 text-orange-300';
    levelDescription = 'Proteção limitada. Apresenta pouca variedade de caracteres ou comprimento insuficiente para resistir a ataques automatizados.';
  } else if (finalScore <= 68) {
    level = 'razoavel';
    levelTitle = '3. Razoável';
    levelColor = 'text-amber-400 border-amber-500/40';
    levelBg = 'bg-amber-500/10 text-amber-300';
    levelDescription = 'Boa base de segurança para contas casuais. Resiste a testes comuns, mas pode ser fortalecida com mais caracteres.';
  } else if (finalScore <= 86) {
    level = 'forte';
    levelTitle = '4. Forte';
    levelColor = 'text-emerald-400 border-emerald-500/40';
    levelBg = 'bg-emerald-500/10 text-emerald-300';
    levelDescription = 'Excelente nível de segurança! Combina boa extensão e diversidade de caracteres, exigindo décadas ou séculos para quebra por força bruta.';
  } else {
    level = 'muito_forte';
    levelTitle = '5. Muito Forte';
    levelColor = 'text-cyan-400 border-cyan-500/40';
    levelBg = 'bg-cyan-500/10 text-cyan-300';
    levelDescription = 'Nível de proteção de padrão militar. Alta entropia e extensão superior, tornando qualquer tentativa de quebra computacionalmente inviável.';
  }

  const crackTime = calculateCrackTime(pwd, !!(numSeq || alphaSeq || kbWalk), !!detectedWord, typeCount);

  return {
    passwordLength: length,
    score: finalScore,
    level,
    levelTitle,
    levelColor,
    levelBg,
    levelDescription,
    criteria,
    whatYouDidWell,
    whatToImprove,
    crackTime,
    detectedFlaws,
    isPassphrase
  };
}
