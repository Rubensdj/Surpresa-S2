/* data.js — PERSONALIZE TUDO AQUI 💖 */
const SURPRISE_DATA = {
  // Nomes
  nomeRecipiente: "Nome da Pessoa",
  nomeRemetente: "Seu Nome",

  // Data de início do relacionamento (AAAA-MM-DD)
  dataInicio: "2024-01-01",

  // Minha localização (para o mapa de distância)
  minhaLat: -8.0476,           // Latitude (Recife-PE = -8.0476)
  minhaLon: -34.8770,          // Longitude (Recife-PE = -34.8770)
  minhaLocal: "Recife-PE",     // Nome da cidade

  // Capítulo 1 — Carta
  carta: `Meu amor,

Desde o momento em que você chegou na minha vida, tudo ganhou mais cor, mais brilho e mais sentido. Cada risada sua, cada mensagem, cada instante ao seu lado é um presente que eu guardo no coração.

Esta página é um pedacinho de tudo o que você significa para mim. Que ela te faça sorrir, do mesmo jeito que você me faz sorrir todos os dias.

Obrigado por ser você. 💖`,

  // Capítulo 2 — Datas especiais (timeline visual)
  datas: [
    { data: "01/01/2024", evento: "O dia em que nossos caminhos se cruzaram" },
    { data: "14/02/2024", evento: "Nosso primeiro Dia dos Namorados juntos" },
    { data: "15/06/2024", evento: "A risada mais bonita que já ouvi" },
    { data: "25/12/2024", evento: "Nosso primeiro Natal juntos" },
  ],

  // Capítulo 3 — Fotos (nomes de arquivos na pasta photos/)
  fotos: [],

  // Capítulo 4 — Vídeos do YouTube (IDs)
  videos: ["9QWa5QMWPJo"],

  // Capítulo Final — Contrato
  contratoTexto: `Eu, {RECIPIENTE}, livre e espontaneamente, aceito assinar este contrato eterno de amor e cumplicidade com {REMETENTE}.

Prometo rir com você, cuidar de você, e caminhar ao seu lado em todos os capítulos da nossa história.`,

  // Playlist de músicas de fundo (IDs do YouTube, tocados via YouTube IFrame API)
  playlistMusicas: ["9QWa5QMWPJo"],

  // Mensagem secreta (botão Surpresa)
  mensagemSecreta: "Você é a melhor coisa que já aconteceu na minha vida. Eu te escolho, hoje e sempre. 🌹",

  // Habilita Realidade Aumentada
  arCoracoes: true,

  // Habilita reconhecimento de voz
  vozAtivada: true,

  // Tema (cores personalizáveis)
  tema: {
    primaria: "#ec4899",
    secundaria: "#a855f7",
    destaque: "#67e8f9",
    dourado: "#FFD700",
  },
};