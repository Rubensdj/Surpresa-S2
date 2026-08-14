/* =====================================================================
   data.js — PERSONALIZE AQUI 💖
   Tudo o que aparece na surpresa pode ser editado neste único arquivo.
   Não precisa mexer no resto do código.
   ===================================================================== */

const SURPRISE_DATA = {
  // Nomes
  nomeRecipiente: "Nome da Pessoa",      // Nome dela
  nomeRemetente: "Seu Nome",              // Seu nome

  // Data de início do relacionamento (para o contador de dias)
  dataInicio: "2024-01-01",               // Formato: AAAA-MM-DD

  // Capítulo 1 — Carta
  carta: `Desde o momento em que você chegou na minha vida, tudo ganhou mais cor,
mais brilho e mais sentido.
Cada risada sua, cada mensagem, cada instante ao seu lado é um presente
que eu guardo no coração.

Esta página é um pedacinho de tudo o que você significa para mim.
Que ela te faça sorrir, do mesmo jeito que você me faz sorrir todos os dias.

Obrigado por ser você. 💖`,

  // Capítulo 2 — Datas especiais (adicione ou remova linhas)
  // formato: { data: "dia", evento: "o que aconteceu" }
  datas: [
    { data: "01/01", evento: "O dia em que nossos caminhos se cruzaram" },
    { data: "14/02", evento: "Nosso primeiro cafuné" },
    { data: "15/06", evento: "A risada mais bonita que já ouvi" },
  ],

  // Capítulo 3 — Fotos
  // Nomes de arquivos dentro da pasta "photos/" (ex: foto1.jpg, foto2.png)
  fotos: [],

  // Capítulo 4 — Vídeos do YouTube (cole o ID do vídeo aqui)
  // Como achar o ID: na URL https://youtu.be/XXXX ou /watch?v=XXXX
  // Exemplo: "dQw4w9WgXcQ"
  videos: ["9QWa5QMWPJo"],

  // Capítulo Final — Contrato
  contratoTexto: `Eu, {RECIPIENTE}, livre e espontaneamente, aceito assinar este
contrato eterno de amor e cumplicidade com quem preparou esta surpresa.
Prometo rir com você, cuidar de você, e caminhar ao seu lado em todos
os capítulos da nossa história.`,
};