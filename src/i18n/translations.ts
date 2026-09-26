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
  whatIsTitle: string;
  whatIsBody: string;
  howToPlayTitle: string;
  howToPlayBody: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
  recordTitle: string;
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

export type SupportedLanguage = "es";

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
    whatIsTitle: "¿Qué es Tuttifrutalo?",
    whatIsBody: "Tuttifrutalo es el clásico juego de Basta/Stop. Sale una letra al azar y tenés que completar una palabra por categoría que empiece con esa letra, antes de que se acabe el tiempo.",
    howToPlayTitle: "¿Cómo jugar?",
    howToPlayBody: "Elegí la duración de la ronda y tocá Empezar. Te va a tocar una letra: completá País, Color, Fruta, Animal, Nombre, Profesión y Cosa con esa letra. Tocá ¡Basta! cuando termines o esperá a que se acabe el tiempo. Cada respuesta válida suma 10 puntos más 1 punto extra por cada letra de la palabra.",
    faqTitle: "Preguntas frecuentes",
    faq: [
      { q: "¿Tuttifrutalo es gratis?", a: "Sí, jugar a Tuttifrutalo es completamente gratis. La app se sostiene con publicidad, nunca vas a tener que pagar para jugar." },
      { q: "¿Necesito crear una cuenta?", a: "No. Tu récord y las palabras que usaste se guardan en este dispositivo automáticamente, no hace falta registrarse ni iniciar sesión." },
      { q: "¿Cómo se puntúa cada categoría?", a: "Cada respuesta válida suma 10 puntos más 1 punto extra por cada letra de la palabra. Las respuestas vacías o inválidas no suman nada." },
      { q: "¿Qué pasa si aprieto BASTA antes de que se acabe el tiempo?", a: "Si no tenés ninguna respuesta inválida, apretar BASTA con tiempo de sobra suma hasta 30 puntos extra de bonus, proporcional al tiempo que te quedaba." },
      { q: "¿Cuáles son las 7 categorías?", a: "País, Color, Frutas y Verduras, Animal, Nombre, Profesión y Cosa, todas con la misma letra inicial." },
      { q: "¿Puedo elegir la letra para jugar con amigos?", a: "Sí, si querés armar un desafío con amigos podés elegir manualmente la letra en vez de que salga al azar, así todos completan las categorías con la misma inicial." },
    ],
    recordTitle: "Récord",
    recordBody: (score, letter) => `${score} puntos con la letra ${letter}`,
    recordWordsLabel: "Palabras usadas",

    letterInicialLabel: "Letra de inicio",
    idleInstruction: "Completá las 7 categorías con esta letra antes de que se acabe el tiempo",
    chooseLetterLabel: "Elegí tu letra para un desafío con amigos con la misma letra",
    durationTitle: "Duración de la ronda",
    durationLabel: "segundos",
    scoringTitle: "¿Cómo se puntúa?",
    scoringExplanation: "10 puntos por cada categoría con respuesta válida, más 1 punto extra por cada letra de la palabra. Vacías o inválidas no suman. Además, si no tenés ninguna respuesta inválida, apretar BASTA con tiempo de sobra suma hasta 30 puntos extra, proporcional al tiempo restante.",
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
      "Si tenés preguntas sobre esta política, podés contactarnos a boludeando.app@gmail.com.",
    ],
  },
};
