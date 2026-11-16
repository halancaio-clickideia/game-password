import { ComparisonScenario, QuizChallenge } from '../types/security';

// Word list for generating safe random Portuguese passphrases
export const PASSPHRASE_WORDS = [
  'farol', 'nuvem', 'caderno', 'rio', 'lua', 'trem', 'azul', 'vento',
  'floresta', 'castelo', 'girassol', 'cafe', 'ponte', 'bussola', 'horizonte',
  'montanha', 'viagem', 'espelho', 'musica', 'jardim', 'planeta', 'estrela',
  'oceano', 'diamante', 'cristal', 'passaro', 'relogio', 'pintura', 'navio',
  'galaxia', 'abacaxi', 'livro', 'valente', 'tucano', 'aurora', 'tempestade'
];

/**
 * Generates random passphrases, with optional alternation (uppercase, symbols, numbers)
 */
export function generateRandomPassphrase(wordCount = 4, withAlternation = true): string {
  const chosen: string[] = [];
  const pool = [...PASSPHRASE_WORDS];
  for (let i = 0; i < wordCount; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    let word = pool.splice(idx, 1)[0];
    if (withAlternation && i === 0) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    chosen.push(word);
  }
  
  if (withAlternation) {
    const randomNum = Math.floor(Math.random() * 90 + 10);
    const symbols = ['!', '@', '#', '$', '%', '&'];
    const sym = symbols[Math.floor(Math.random() * symbols.length)];
    return `${chosen.join('-')}${sym}${randomNum}`;
  }

  return chosen.join('-');
}

// Scenarios for "Qual senha é mais segura?"
export const COMPARISON_SCENARIOS: ComparisonScenario[] = [
  {
    id: 'scenario-1-classic',
    title: 'Rodada 1: O Clássico Dilema dos Símbolos vs. Comprimento',
    subtitle: 'Alternar maiúsculas, números e símbolos é excelente. Mas o que acontece quando comparamos com uma senha longa?',
    options: [
      {
        id: 'opt-1',
        password: 'senha123',
        label: 'Opção A: senha123',
        type: 'Palavra comum + sequência numérica',
        entropyBits: 18,
        crackTime: 'Menos de 0,001 segundo',
        isBest: false,
        explanation: 'Esta é uma das senhas mais vulneráveis do mundo. É muito curta (8 caracteres) e junta uma palavra óbvia de dicionário com a sequência "123". Qualquer robô testa essa senha em frações de segundo.',
        points: [
          '8 caracteres (muito curta)',
          'Palavra de dicionário batida ("senha")',
          'Sequência numérica "123" que todo invasor testa primeiro'
        ]
      },
      {
        id: 'opt-2',
        password: 'Escola@2026',
        label: 'Opção B: Escola@2026',
        type: 'Alternância completa (Maiúscula + Minúscula + Símbolo + Ano)',
        entropyBits: 65,
        crackTime: 'Cerca de 2 a 5 anos (força bruta geral)',
        isBest: false,
        explanation: 'Muito boa senha! A alternância de maiúscula (E), minúsculas (scola), símbolo especial (@) e números (2026) é excelente e levaria anos para quebrar em um teste cego de força bruta. Porém, como segue o formato previsível [Palavra]@[Ano], dicionários direcionados tentam essa fórmula com prioridade.',
        points: [
          '11 caracteres com boa alternância (maiúscula, minúsculas, @ e ano)',
          'Excelente resistência a ataques de força bruta comuns (anos)',
          'Ponto de atenção: o padrão [Palavra]@[AnoAtual] é muito visado em ataques direcionados'
        ]
      },
      {
        id: 'opt-3',
        password: 'rio-caderno-lua-trem-azul',
        label: 'Opção C: rio-caderno-lua-trem-azul',
        type: 'Frase longa de 5 palavras (24 caracteres)',
        entropyBits: 78,
        crackTime: 'Mais de 15 milhões de anos',
        isBest: true,
        explanation: 'A MAIS SEGURA! Possui 24 caracteres. Mesmo sem números complexos, o comprimento astronômico cria tantas combinações matemáticas que supera até supercomputadores. E se você adicionar números e símbolos a essa frase (ex.: Rio-Caderno-Lua#2026), ela se torna invencível!',
        points: [
          '24 caracteres (enorme proteção matemática)',
          'Fácil de memorizar criando uma cena mental',
          'Imune a ataques de força bruta'
        ]
      }
    ],
    educationalTakeaway: 'Alternar maiúsculas, números e símbolos é fundamental! Mas quando a senha é muito longa (como frases de 20+ caracteres), a quantidade de combinações se multiplica de forma astronômica. A combinação perfeita é unir os dois: Frase Longa + Alternância de Símbolos!'
  },
  {
    id: 'scenario-2-leetspeak',
    title: 'Rodada 2: Substituições Leetspeak vs. Frase Completa com Alternância',
    subtitle: 'Trocar letras por números (como "@" por "a" e "1" por "i") realmente protege a senha?',
    options: [
      {
        id: 'opt-1',
        password: 'Br@s1l2024!',
        label: 'Opção A: Br@s1l2024!',
        type: 'Nome próprio + Leetspeak + Alternância completa',
        entropyBits: 68,
        crackTime: 'Centenas de anos (força bruta geral)',
        isBest: false,
        explanation: 'Boa senha! Possui 11 caracteres e ótima alternância (maiúscula B, minúsculas, números 1 e 2024, símbolos @ e !), resistindo por centenas de anos a ataques genéricos. O único ponto é que a palavra "Brasil" com @ e 1 está no topo dos dicionários brasileiros de ataque.',
        points: [
          '11 caracteres e 4 tipos de caracteres (maiúscula, minúscula, números e símbolos)',
          'Resiste por centenas de anos a tentativas de força bruta aleatória',
          'Atenção: Softwares de ataque no Brasil já incluem regras que testam "Br@s1l" automaticamente'
        ]
      },
      {
        id: 'opt-2',
        password: 'p@$$w0rd!#',
        label: 'Opção B: p@$$w0rd!#',
        type: 'Palavra padrão com símbolos forçados',
        entropyBits: 42,
        crackTime: 'Poucos minutos em dicionário',
        isBest: false,
        explanation: 'Uma armadilha clássica. Tem vários símbolos (@, $$, !, #), mas a palavra-base é "password", a senha mais atacada do mundo. Softwares de invasão testam todas as variações dessa palavra nos primeiros instantes.',
        points: [
          '10 caracteres com símbolos difíceis de memorizar',
          'Palavra-base é a mais visada do planeta ("password")',
          'Quebrada rapidamente por dicionários focados em termos padrão'
        ]
      },
      {
        id: 'opt-3',
        password: 'Ponte-Girassol@Vento-99',
        label: 'Opção C: Ponte-Girassol@Vento-99',
        type: 'Frase com Alternância Completa (Maiúsculas + Símbolos + Números)',
        entropyBits: 96,
        crackTime: 'Bilhões de anos',
        isBest: true,
        explanation: 'A MAIS SEGURA! Une o melhor de dois mundos: a alternância completa exigida pelos sistemas (maiúsculas P, G, V, símbolos - e @, números 99) e o comprimento gigante de 23 caracteres. É impossível de decifrar e fácil de lembrar!',
        points: [
          '23 caracteres (comprimento superior)',
          'Alternância completa: Maiúsculas, Minúsculas, Símbolos (- e @) e Números (99)',
          'Cumpre 100% das exigências de qualquer sistema e resiste por bilhões de anos'
        ]
      }
    ],
    educationalTakeaway: 'A alternância entre letras, números e símbolos é uma das maiores armas da cibersegurança! Quando você une essa alternância a palavras aleatórias, sua senha atinge o nível máximo de proteção.'
  },
  {
    id: 'scenario-3-random-vs-phrase',
    title: 'Rodada 3: Código Aleatório Curto vs. Senha Longa com Alternância',
    subtitle: 'Uma senha aleatória curta e difícil de lembrar é melhor do que uma senha longa e estruturada?',
    options: [
      {
        id: 'opt-1',
        password: 'qW7#mZ!2',
        label: 'Opção A: qW7#mZ!2',
        type: '8 caracteres totalmente aleatórios com alternância',
        entropyBits: 52,
        crackTime: 'Cerca de 2 a 5 dias (em supercomputador)',
        isBest: false,
        explanation: 'Tem excelente variedade (maiúsculas, minúsculas, números e símbolos), mas peca no comprimento (apenas 8 caracteres). Além de ser quase impossível de memorizar sem anotar, um cluster de placas de vídeo testa todas as 8 posições em poucos dias.',
        points: [
          'Apenas 8 caracteres de extensão',
          'Quase impossível de memorizar sem errar',
          'Espaço total de 8 caracteres é percorrido em poucos dias por supercomputadores'
        ]
      },
      {
        id: 'opt-2',
        password: 'MinhaSenhaForte100%',
        label: 'Opção B: MinhaSenhaForte100%',
        type: 'Frase com alternância e porcentagem',
        entropyBits: 74,
        crackTime: 'Milhares de anos',
        isBest: false,
        explanation: 'Boa senha! 19 caracteres e boa variedade. O único cuidado é que o termo "MinhaSenha" é um bloco de texto previsível, mas o tamanho de 19 caracteres já garante uma excelente proteção.',
        points: [
          '19 caracteres com boa resistência',
          'Alternância de maiúsculas, minúsculas, números e porcentagem',
          'Termo "MinhaSenha" é comum, mas o comprimento compensa'
        ]
      },
      {
        id: 'opt-3',
        password: 'Cafe-Valente#Bussola24',
        label: 'Opção C: Cafe-Valente#Bussola24',
        type: 'Frase-senha com Alternância Inteligente (22 caracteres)',
        entropyBits: 92,
        crackTime: 'Centenas de milhões de anos',
        isBest: true,
        explanation: 'A MAIS SEGURA! Combina palavras não relacionadas, iniciais maiúsculas (C, V, B), o símbolo (#) e números (24). Fácil de digitar no celular ou computador e computacionalmente invencível.',
        points: [
          '22 caracteres',
          'Alternância completa de tipos de caracteres',
          'Fácil de memorizar como uma história e inquebrável'
        ]
      }
    ],
    educationalTakeaway: 'Você não precisa criar senhas que pareçam códigos incompreensíveis que você vai esquecer amanhã. Usar palavras unidas com alternância de maiúsculas, números e símbolos é a recomendação máxima dos maiores institutos de segurança do mundo.'
  }
];

// Interactive Quiz & Challenges
export const QUIZ_CHALLENGES: QuizChallenge[] = [
  {
    id: 'quiz-1',
    question: 'Qual é a combinação mais recomendada por especialistas para criar senhas invencíveis e fáceis de lembrar?',
    type: 'choice',
    options: [
      { id: 'q1-a', text: 'Uma palavra curta cheia de números no final (ex: senha2026)', isCorrect: false },
      { id: 'q1-b', text: 'Unir várias palavras em uma frase-senha longa e adicionar alternância com números e símbolos (ex: Sol-Azul#2026)', isCorrect: true },
      { id: 'q1-c', text: 'Usar apenas 6 caracteres aleatórios difíceis de memorizar', isCorrect: false },
      { id: 'q1-d', text: 'Usar seu nome ao contrário', isCorrect: false }
    ],
    explanation: 'Correto! Unir várias palavras (garantindo comprimento acima de 16 caracteres) e acrescentar alternância com maiúsculas, números e símbolos cria uma barreira matemática que nenhum supercomputador consegue quebrar, além de ser fácil de lembrar!',
    tips: 'Lembre-se: Comprimento longo + Alternância de caracteres = Proteção Máxima!'
  },
  {
    id: 'quiz-2',
    question: 'Por que a alternância entre maiúsculas, minúsculas, números e símbolos é tão importante?',
    type: 'choice',
    options: [
      { id: 'q2-a', text: 'Porque o teclado do computador digita mais rápido assim', isCorrect: false },
      { id: 'q2-b', text: 'Porque ela expande o número de opções por caractere de 26 letras para mais de 94 símbolos, multiplicando o esforço do invasor', isCorrect: true },
      { id: 'q2-c', text: 'Porque os navegadores não aceitam senhas apenas com letras', isCorrect: false },
      { id: 'q2-d', text: 'Apenas para fins visuais, não afeta a segurança matemática', isCorrect: false }
    ],
    explanation: 'Exato! Com apenas letras minúsculas, cada posição tem 26 possibilidades. Ao alternar maiúsculas, números e símbolos, cada posição tem até 94 possibilidades. Isso multiplica o total de combinações possíveis por trilhões!',
    tips: 'A alternância é a parceira perfeita do comprimento.'
  },
  {
    id: 'quiz-3',
    question: 'Qual é a melhor maneira de ter senhas diferentes e ultrafortes para dezenas de sites e aplicativos?',
    type: 'choice',
    options: [
      { id: 'q3-a', text: 'Usar a mesma senha boa em tudo para não esquecer', isCorrect: false },
      { id: 'q3-b', text: 'Anotar todas as senhas em um papel colado no monitor', isCorrect: false },
      { id: 'q3-c', text: 'Usar um Gerenciador de Senhas confiável protegido por uma única Frase-Senha mestre', isCorrect: true },
      { id: 'q3-d', text: 'Mudar apenas a última letra da mesma senha para cada site', isCorrect: false }
    ],
    explanation: 'Perfeito! Nenhum ser humano consegue memorizar 50 senhas únicas de 20 caracteres. Um gerenciador de senhas (como Bitwarden, 1Password ou o próprio navegador) gera e guarda tudo em um cofre criptografado.',
    tips: 'Com um gerenciador, você só precisa memorizar UMA frase-senha mestre forte!'
  },
  {
    id: 'quiz-4',
    question: 'O que acontece quando você reutiliza a mesma senha no jogo online e no seu e-mail principal?',
    type: 'choice',
    options: [
      { id: 'q4-a', text: 'O computador fica mais rápido', isCorrect: false },
      { id: 'q4-b', text: 'Se o jogo sofrer um vazamento de dados, os invasores terão acesso imediato ao seu e-mail', isCorrect: true },
      { id: 'q4-c', text: 'O sistema bloqueia as duas contas por segurança', isCorrect: false },
      { id: 'q4-d', text: 'Nada, pois cada site tem criptografia independente', isCorrect: false }
    ],
    explanation: 'Isso se chama ataque de "Credential Stuffing". Quando um site menor ou jogo tem o banco de dados vazado, cibercriminosos pegam o e-mail e senha da lista e testam automaticamente no Gmail, Instagram, bancos e lojas.',
    tips: 'Uma senha vazada nunca deve comprometer suas outras contas!'
  },
  {
    id: 'quiz-5',
    question: 'Além de uma senha forte com boa alternância, qual recurso de segurança é fundamental ativar em todas as contas importantes?',
    type: 'choice',
    options: [
      { id: 'q5-a', text: 'Autenticação em Duas Etapas / Dois Fatores (2FA)', isCorrect: true },
      { id: 'q5-b', text: 'Modo anônimo constante', isCorrect: false },
      { id: 'q5-c', text: 'Desligar o Wi-Fi toda noite', isCorrect: false },
      { id: 'q5-d', text: 'Digitar a senha com o teclado virtual sempre', isCorrect: false }
    ],
    explanation: 'Excelente! A autenticação de 2 fatores (2FA) exige uma segunda confirmação (no aplicativo do celular ou chave de segurança). Mesmo que alguém descubra sua senha, não conseguirá entrar sem o segundo fator!',
    tips: 'Ative 2FA especialmente no seu e-mail principal, WhatsApp e redes sociais.'
  }
];

// 6 Golden Rules for the conclusion screen
export const GOLDEN_RULES = [
  {
    title: 'Comprimento + Alternância de Caracteres',
    desc: 'O ápice da segurança: misture maiúsculas, minúsculas, números e símbolos em uma extensão de 14 a 20+ caracteres.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Adote o método Frase-Senha',
    desc: 'Junte 3 ou 4 palavras e adicione símbolos (ex: "Vento-Abacaxi#Farol26"). É hiperseguro e muito fácil de lembrar.',
    icon: 'Key'
  },
  {
    title: 'Nunca reutilize senhas',
    desc: 'Se um site sofrer vazamento, suas outras contas continuarão totalmente protegidas.',
    icon: 'Lock'
  },
  {
    title: 'Elimine dados pessoais óbvios',
    desc: 'Nunca coloque aniversários puros, nomes de parentes, animais de estimação ou seu time de coração.',
    icon: 'UserX'
  },
  {
    title: 'Ative a Autenticação em Duas Etapas (2FA)',
    desc: 'Uma camada extra impede invasões mesmo se sua senha for descoberta acidentalmente.',
    icon: 'Smartphone'
  },
  {
    title: 'Utilize um Gerenciador de Senhas',
    desc: 'Você só precisa lembrar de uma frase mestre. O gerenciador cuida de criar e guardar senhas únicas para o resto.',
    icon: 'Vault'
  }
];
