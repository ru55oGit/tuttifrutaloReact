export interface Translation {
  // Menu / Layout
  home: string;
  playMenu: string;
  privacyPolicyLabel: string;
  appName: string;

  // Home
  tagline: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  daysWithoutPlayingMessage: (days: number) => string;
  readyToPlay: string;
  playButton: string;
  exampleRoundLabel: string;
  exampleRoundExplanation: string;
  removeAdsButton: string;
  removeAdsButtonBuying: string;
  whatIsTitle: string;
  whatIsBody: string;
  howToPlayTitle: string;
  howToPlayBody: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
  recordTitle: string;
  recordEmptyBody: string;
  recordBody: (score: number, letter: string) => string;
  recordWordsLabel: string;

  // Game — config phase
  letterInicialLabel: string;
  idleInstruction: string;
  chooseLetterLabel: string;
  durationTitle: string;
  durationLabel: string;
  scoringTitle: string;
  scoringExplanation: string;
  startButton: string;

  // Game — playing phase
  categoryLabels: Record<string, string>;
  bastaButton: string;

  // Game — results phase
  resultsTitle: string;
  totalScoreLabel: string;
  timeBonusLabel: (bonus: number) => string;
  alternativesLabel: (count: number) => string;
  sampleAlternativesLabel: (words: string[]) => string;
  playAgainButton: string;
  backToHomeButton: string;
  validLabel: string;
  invalidLabel: string;
  emptyLabel: string;

  // Privacy policy
  privacyTitle: string;
  privacyBody: string[];
}

export type SupportedLanguage = "es" | "en" | "pt";

export const translations: Record<SupportedLanguage, Translation> = {
  es: {
    home: "🏠 Inicio",
    playMenu: "🎲 Jugar",
    privacyPolicyLabel: "Privacidad",
    appName: "Tuttifrutalo",

    tagline: "una letra · siete categorías · contrarreloj",
    greetingMorning: "Buenos días ☀️",
    greetingAfternoon: "Buenas tardes 🌤️",
    greetingEvening: "Buenas noches 🌙",
    daysWithoutPlayingMessage: (days) => `hace ${days} días que no jugás`,
    readyToPlay: "¿Listo para jugar Tuttifrutalo?",
    playButton: "JUGAR",
    exampleRoundLabel: "Ejemplo de ronda",
    exampleRoundExplanation: "Te toca una letra al azar y completás las 7 categorías con esa inicial antes de que se acabe el tiempo.",
    removeAdsButton: "Sacar los anuncios",
    removeAdsButtonBuying: "Redirigiendo a MercadoPago...",
    whatIsTitle: "¿Qué es Tuttifrutalo?",
    whatIsBody: "Tuttifrutalo es el clásico juego de Basta/Stop. Sale una letra al azar y tenés que completar una palabra por categoría que empiece con esa letra, antes de que se acabe el tiempo.",
    howToPlayTitle: "¿Cómo jugar?",
    howToPlayBody: "Elegí la duración de la ronda y tocá Empezar. Te va a tocar una letra: completá País, Color, Fruta, Animal, Nombre, Profesión y Cosa con esa letra. Tocá ¡Basta! cuando termines o esperá a que se acabe el tiempo. Cada respuesta válida suma 10 puntos más 1 punto extra por cada letra de la palabra.",
    faqTitle: "Preguntas frecuentes",
    faq: [
      { q: "¿Tuttifrutalo es gratis?", a: "Sí, jugar a Tuttifrutalo es completamente gratis. La app se sostiene con publicidad, nunca vas a tener que pagar para jugar." },
      { q: "¿Necesito crear una cuenta?", a: "No. Tu récord y las palabras que usaste se guardan en este dispositivo automáticamente, no hace falta registrarse ni iniciar sesión." },
      { q: "¿Cómo se puntúa cada categoría?", a: "Cada respuesta válida suma 10 puntos más 1 punto extra por cada letra de la palabra. Las respuestas vacías o inválidas no suman nada." },
      { q: "¿Qué pasa si aprieto BASTA antes de que se acabe el tiempo?", a: "Si completaste las 7 categorías y ninguna es inválida, apretar BASTA con tiempo de sobra suma hasta 30 puntos extra de bonus, proporcional al tiempo que te quedaba. Si dejaste alguna vacía, no hay bonus." },
      { q: "¿Cuáles son las 7 categorías?", a: "País, Color, Frutas y Verduras, Animal, Nombre, Profesión y Cosa, todas con la misma letra inicial." },
      { q: "¿Puedo elegir la letra para jugar con amigos?", a: "Sí, si querés armar un desafío con amigos podés elegir manualmente la letra en vez de que salga al azar, así todos completan las categorías con la misma inicial." },
    ],
    recordTitle: "Récord",
    recordEmptyBody: "Todavía no jugaste ninguna partida.",
    recordBody: (score, letter) => `${score} puntos con la letra ${letter}`,
    recordWordsLabel: "Palabras usadas",

    letterInicialLabel: "Letra de inicio",
    idleInstruction: "Completá las 7 categorías con esta letra antes de que se acabe el tiempo",
    chooseLetterLabel: "Elegí tu letra para un desafío con amigos con la misma letra",
    durationTitle: "Duración de la ronda",
    durationLabel: "segundos",
    scoringTitle: "¿Cómo se puntúa?",
    scoringExplanation: "10 puntos por cada categoría con respuesta válida, más 1 punto extra por cada letra de la palabra. Vacías o inválidas no suman. Además, si completaste las 7 categorías y ninguna es inválida, apretar BASTA con tiempo de sobra suma hasta 30 puntos extra, proporcional al tiempo restante.",
    startButton: "¡Empezar!",

    categoryLabels: {
      pais: "País",
      color: "Color",
      fruta: "Frutas y Verduras",
      animal: "Animal",
      nombre: "Nombre",
      profesion: "Profesión",
      cosa: "Cosa",
    },
    bastaButton: "¡BASTA!",

    resultsTitle: "Resultados",
    totalScoreLabel: "Puntaje total",
    timeBonusLabel: (bonus) => `incluye +${bonus} de bonus por tiempo`,
    alternativesLabel: (count) => (count === 1 ? "había 1 alternativa válida" : `había ${count} alternativas válidas`),
    sampleAlternativesLabel: (words) => `por ejemplo: ${words.join(", ")}`,
    playAgainButton: "Jugar de nuevo",
    backToHomeButton: "Volver al inicio",
    validLabel: "Válida",
    invalidLabel: "Inválida",
    emptyLabel: "Vacía",

    privacyTitle: "Política de privacidad",
    privacyBody: [
      "Tuttifrutalo no recopila datos personales. El progreso y los récords se guardan únicamente en el almacenamiento local de tu navegador (localStorage) y nunca se envían a ningún servidor.",
      "Este sitio puede mostrar anuncios de Google AdSense, que puede usar cookies para personalizar la publicidad según tu actividad de navegación.",
      "Además de Google AdSense, mostramos avisos propios de otros juegos de Boludeando y anuncios \"rewarded\" (a cambio de recompensas en el juego). Para esto enviamos a nuestro propio servidor (ads-api.boludeando.com) datos anónimos: un identificador de sesión generado en tu dispositivo (sin relación con tu identidad), tu país aproximado (por IP), tipo de dispositivo e idioma. No incluye nombre, email ni ningún dato que te identifique. Si elegís comprar la opción de sacarte los anuncios, el pago se procesa a través de MercadoPago; nosotros no recibimos ni guardamos los datos de tu tarjeta — eso queda entre vos y MercadoPago.",
      "Si tenés preguntas sobre esta política, podés contactarnos a boludeando.app@gmail.com.",
    ],
  },

  en: {
    home: "🏠 Home",
    playMenu: "🎲 Play",
    privacyPolicyLabel: "Privacy",
    appName: "Tuttifrutalo",

    tagline: "one letter · seven categories · against the clock",
    greetingMorning: "Good morning ☀️",
    greetingAfternoon: "Good afternoon 🌤️",
    greetingEvening: "Good evening 🌙",
    daysWithoutPlayingMessage: (days) => `it's been ${days} days since you last played`,
    readyToPlay: "Ready to play Tuttifrutalo?",
    playButton: "PLAY",
    exampleRoundLabel: "Example round",
    exampleRoundExplanation: "You get a random letter and complete all 7 categories starting with it before time runs out.",
    removeAdsButton: "Remove ads",
    removeAdsButtonBuying: "Redirecting to MercadoPago...",
    whatIsTitle: "What is Tuttifrutalo?",
    whatIsBody: "Tuttifrutalo is the classic Scattergories/Stop game. A random letter comes up and you have to complete one word per category starting with that letter before time runs out.",
    howToPlayTitle: "How to play",
    howToPlayBody: "Pick the round duration and tap Start. You'll get a letter: fill in Country, Color, Fruit, Animal, Name, Profession and Thing starting with that letter. Tap Stop! when you're done or wait for time to run out. Each valid answer scores 10 points plus 1 extra point per letter of the word.",
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "Is Tuttifrutalo free?", a: "Yes, playing Tuttifrutalo is completely free. The app runs on ads, you'll never have to pay to play." },
      { q: "Do I need to create an account?", a: "No. Your record and the words you used are saved automatically on this device — no sign-up or login needed." },
      { q: "How is each category scored?", a: "Each valid answer scores 10 points plus 1 extra point per letter of the word. Empty or invalid answers score nothing." },
      { q: "What happens if I tap STOP before time runs out?", a: "If you've completed all 7 categories and none are invalid, tapping STOP with time to spare adds up to 30 bonus points, proportional to the time you had left. If you left any category empty, there's no bonus." },
      { q: "What are the 7 categories?", a: "Country, Color, Fruits and Vegetables, Animal, Name, Profession and Thing, all starting with the same letter." },
      { q: "Can I pick the letter to play with friends?", a: "Yes, if you want to set up a challenge with friends you can manually pick the letter instead of drawing it at random, so everyone fills in the categories with the same starting letter." },
    ],
    recordTitle: "Record",
    recordEmptyBody: "You haven't played any rounds yet.",
    recordBody: (score, letter) => `${score} points with the letter ${letter}`,
    recordWordsLabel: "Words used",

    letterInicialLabel: "Starting letter",
    idleInstruction: "Complete the 7 categories with this letter before time runs out",
    chooseLetterLabel: "Pick your letter for a challenge with friends using the same letter",
    durationTitle: "Round duration",
    durationLabel: "seconds",
    scoringTitle: "How is it scored?",
    scoringExplanation: "10 points for each category with a valid answer, plus 1 extra point per letter of the word. Empty or invalid answers score nothing. Also, if you've completed all 7 categories and none are invalid, tapping STOP with time to spare adds up to 30 bonus points, proportional to the time left.",
    startButton: "Start!",

    categoryLabels: {
      pais: "Country",
      color: "Color",
      fruta: "Fruits and Vegetables",
      animal: "Animal",
      nombre: "Name",
      profesion: "Profession",
      cosa: "Thing",
    },
    bastaButton: "STOP!",

    resultsTitle: "Results",
    totalScoreLabel: "Total score",
    timeBonusLabel: (bonus) => `includes +${bonus} time bonus`,
    alternativesLabel: (count) => (count === 1 ? "there was 1 valid alternative" : `there were ${count} valid alternatives`),
    sampleAlternativesLabel: (words) => `for example: ${words.join(", ")}`,
    playAgainButton: "Play again",
    backToHomeButton: "Back to home",
    validLabel: "Valid",
    invalidLabel: "Invalid",
    emptyLabel: "Empty",

    privacyTitle: "Privacy policy",
    privacyBody: [
      "Tuttifrutalo does not collect personal data. Your progress and records are stored only in your browser's local storage (localStorage) and are never sent to any server.",
      "This site may show Google AdSense ads, which may use cookies to personalize advertising based on your browsing activity.",
      "Besides Google AdSense, we show our own ads for other Boludeando games and \"rewarded\" ads (in exchange for in-game rewards). For this we send anonymous data to our own server (ads-api.boludeando.com): a session identifier generated on your device (not linked to your identity), your approximate country (by IP), device type, and language. It does not include your name, email, or any identifying data. If you choose to buy the ad-removal option, the payment is processed through MercadoPago; we do not receive or store your card details — that stays between you and MercadoPago.",
      "If you have questions about this policy, you can contact us at boludeando.app@gmail.com.",
    ],
  },

  pt: {
    home: "🏠 Início",
    playMenu: "🎲 Jogar",
    privacyPolicyLabel: "Privacidade",
    appName: "Tuttifrutalo",

    tagline: "uma letra · sete categorias · contra o tempo",
    greetingMorning: "Bom dia ☀️",
    greetingAfternoon: "Boa tarde 🌤️",
    greetingEvening: "Boa noite 🌙",
    daysWithoutPlayingMessage: (days) => `faz ${days} dias que você não joga`,
    readyToPlay: "Pronto para jogar Tuttifrutalo?",
    playButton: "JOGAR",
    exampleRoundLabel: "Rodada de exemplo",
    exampleRoundExplanation: "Você recebe uma letra aleatória e completa as 7 categorias que começam com ela antes que o tempo acabe.",
    removeAdsButton: "Tirar os anúncios",
    removeAdsButtonBuying: "Redirecionando para o MercadoPago...",
    whatIsTitle: "O que é o Tuttifrutalo?",
    whatIsBody: "Tuttifrutalo é o clássico jogo de Adedonha/Stop. Sai uma letra aleatória e você precisa completar uma palavra por categoria que comece com essa letra, antes que o tempo acabe.",
    howToPlayTitle: "Como jogar?",
    howToPlayBody: "Escolha a duração da rodada e toque em Começar. Você vai receber uma letra: complete País, Cor, Fruta, Animal, Nome, Profissão e Coisa com essa letra. Toque em Já! quando terminar ou espere o tempo acabar. Cada resposta válida soma 10 pontos mais 1 ponto extra por cada letra da palavra.",
    faqTitle: "Perguntas frequentes",
    faq: [
      { q: "O Tuttifrutalo é grátis?", a: "Sim, jogar Tuttifrutalo é totalmente grátis. O app se sustenta com publicidade, você nunca vai precisar pagar para jogar." },
      { q: "Preciso criar uma conta?", a: "Não. Seu recorde e as palavras que você usou são salvos automaticamente neste dispositivo, não precisa se cadastrar nem fazer login." },
      { q: "Como cada categoria é pontuada?", a: "Cada resposta válida soma 10 pontos mais 1 ponto extra por cada letra da palavra. Respostas vazias ou inválidas não somam nada." },
      { q: "O que acontece se eu tocar em JÁ! antes do tempo acabar?", a: "Se você completou as 7 categorias e nenhuma é inválida, tocar em JÁ! com tempo sobrando soma até 30 pontos extras de bônus, proporcional ao tempo que restava. Se você deixou alguma vazia, não há bônus." },
      { q: "Quais são as 7 categorias?", a: "País, Cor, Frutas e Verduras, Animal, Nome, Profissão e Coisa, todas com a mesma letra inicial." },
      { q: "Posso escolher a letra para jogar com amigos?", a: "Sim, se você quiser montar um desafio com amigos pode escolher manualmente a letra em vez de sortear, assim todos completam as categorias com a mesma inicial." },
    ],
    recordTitle: "Recorde",
    recordEmptyBody: "Você ainda não jogou nenhuma partida.",
    recordBody: (score, letter) => `${score} pontos com a letra ${letter}`,
    recordWordsLabel: "Palavras usadas",

    letterInicialLabel: "Letra inicial",
    idleInstruction: "Complete as 7 categorias com essa letra antes que o tempo acabe",
    chooseLetterLabel: "Escolha sua letra para um desafio com amigos com a mesma letra",
    durationTitle: "Duração da rodada",
    durationLabel: "segundos",
    scoringTitle: "Como pontua?",
    scoringExplanation: "10 pontos por cada categoria com resposta válida, mais 1 ponto extra por cada letra da palavra. Vazias ou inválidas não somam. Além disso, se você completou as 7 categorias e nenhuma é inválida, tocar em JÁ! com tempo sobrando soma até 30 pontos extras de bônus, proporcional ao tempo restante.",
    startButton: "Começar!",

    categoryLabels: {
      pais: "País",
      color: "Cor",
      fruta: "Frutas e Verduras",
      animal: "Animal",
      nombre: "Nome",
      profesion: "Profissão",
      cosa: "Coisa",
    },
    bastaButton: "JÁ!",

    resultsTitle: "Resultados",
    totalScoreLabel: "Pontuação total",
    timeBonusLabel: (bonus) => `inclui +${bonus} de bônus por tempo`,
    alternativesLabel: (count) => (count === 1 ? "havia 1 alternativa válida" : `havia ${count} alternativas válidas`),
    sampleAlternativesLabel: (words) => `por exemplo: ${words.join(", ")}`,
    playAgainButton: "Jogar de novo",
    backToHomeButton: "Voltar ao início",
    validLabel: "Válida",
    invalidLabel: "Inválida",
    emptyLabel: "Vazia",

    privacyTitle: "Política de privacidade",
    privacyBody: [
      "O Tuttifrutalo não coleta dados pessoais. O progresso e os recordes são salvos apenas no armazenamento local do seu navegador (localStorage) e nunca são enviados a nenhum servidor.",
      "Este site pode mostrar anúncios do Google AdSense, que pode usar cookies para personalizar a publicidade de acordo com sua atividade de navegação.",
      "Além do Google AdSense, mostramos nossos próprios anúncios de outros jogos do Boludeando e anúncios \"rewarded\" (em troca de recompensas no jogo). Para isso enviamos ao nosso próprio servidor (ads-api.boludeando.com) dados anônimos: um identificador de sessão gerado no seu dispositivo (sem relação com sua identidade), seu país aproximado (por IP), tipo de dispositivo e idioma. Não inclui nome, email nem nenhum dado que te identifique. Se você escolher comprar a opção de remover os anúncios, o pagamento é processado através do MercadoPago; nós não recebemos nem guardamos os dados do seu cartão — isso fica entre você e o MercadoPago.",
      "Se você tiver dúvidas sobre esta política, pode nos contatar em boludeando.app@gmail.com.",
    ],
  },
};
