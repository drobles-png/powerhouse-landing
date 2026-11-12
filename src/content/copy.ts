// Textos de la página. Un cliente nuevo edita SOLO este archivo (y config/funnel.ts).
// Todo lo que está entre [corchetes] es un marcador: reemplazar con lo que dice el VSL del cliente.
// No inventar cifras, testimonios, garantías ni bonos.
import { BRAND_NAME, PERSON_NAME } from '@/config/funnel'

export interface Testimonial {
  name: string
  role: string
  quote: string
  /** Resultado concreto que dijo el testimonio (opcional): "+30% en ventas" */
  result?: string
  photo?: string
}

export interface TeamMember {
  name: string
  role: string
  bio?: string
  photo?: string
}

export const SEO = {
  landing: {
    title: `${BRAND_NAME} | Primero entender. Después decidir.`,
    description:
      'Antes de invertir en células madre, exosomas u otra terapia regenerativa, entiende si tu organismo está listo para responder. Evaluación de Viabilidad Regenerativa.',
  },
  video: {
    title: `Mira el video | ${BRAND_NAME}`,
    description: `${PERSON_NAME} explica por qué un tratamiento puede no funcionar y cómo evaluamos tu caso antes de invertir.`,
  },
  booking: { title: `Agenda tu consulta | ${BRAND_NAME}`, description: 'Elige el día y la hora de tu videollamada.' },
  booked: { title: `Consulta confirmada | ${BRAND_NAME}`, description: 'Tu consulta está confirmada.' },
  noSpace: { title: `Todavía no es el momento | ${BRAND_NAME}`, description: 'Gracias por contarnos tu caso.' },
  pago: { title: `Confirma tu lugar | ${BRAND_NAME}`, description: 'Completa tu inscripción.' },
  confirmada: { title: `Inscripción confirmada | ${BRAND_NAME}`, description: 'Tu lugar está confirmado.' },
  privacy: { title: `Política de privacidad | ${BRAND_NAME}`, description: `Política de privacidad de ${BRAND_NAME}.` },
  legal: { title: `Aviso legal | ${BRAND_NAME}`, description: `Aviso legal de ${BRAND_NAME}.` },
}

// ── Landing (/) ───────────────────────────────────────────────────────────────
// Estructura corta: hero → banda (la regla) → método DECIDE → quién habla + ¿es para ti?
export const LANDING = {
  // Temporizador del encabezado (components/CountdownTimer.vue). short = versión de celular.
  timer: { label: 'Agenda de evaluaciones', short: 'Agenda', prefix: 'Cierra en' },
  headline: 'Antes de invertir un solo dólar,',
  headlineAccent: 'entiende por qué tu cuerpo no está respondiendo.',
  sub: 'Una persona puede recibir el mejor tratamiento del mundo y seguir igual. No porque el tratamiento sea malo, sino porque su organismo no estaba listo para aprovecharlo.',
  videoCaption: 'Fundador de Power House Biotech',
  videoQuote: 'El problema casi nunca empieza en el tratamiento. Empieza antes.',
  cta: 'Ver el video completo',
  ctaNote: 'Sin costo · Solo te pedimos tus datos para mostrártelo',

  // Banda: la regla de PHB en 4 verbos (VSL: "Primero entendemos, luego medimos…")
  rule: {
    title: 'Nuestra regla es simple.',
    items: ['Primero entendemos', 'luego medimos', 'después preparamos', 'y solo entonces se habla de tratamiento.'],
    metaphor:
      'Es como sembrar en una tierra que no está preparada. Puedes tener la mejor semilla del mundo, pero si el terreno no está listo, no va a crecer.',
  },

  method: {
    title: 'El método DECIDE',
    sub: 'Seis pasos, y van en orden. Lo hace un equipo médico de medicina regenerativa, investigación en biomarcadores y optimización celular.',
    items: [
      {
        letter: 'D',
        title: 'Detectar',
        text: 'Revisamos la historia completa: el diagnóstico, cuánto tiempo lleva la condición, qué medicamentos se toman, qué tratamientos ya se probaron y cómo afecta el día a día.',
      },
      {
        letter: 'E',
        title: 'Evaluar',
        text: 'El equipo médico analiza tus estudios de laboratorio y biomarcadores. No uno por uno, sino juntos, porque juntos cuentan una historia.',
        markers: ['Glucosa', 'Colesterol', 'Marcadores de inflamación'],
      },
      {
        letter: 'C',
        title: 'Clarificar',
        text: 'Te explicamos con palabras simples qué dicen esos resultados y qué tan serio es lo que muestran. Sin tecnicismos y sin asustarte.',
      },
      {
        letter: 'I',
        title: 'Identificar',
        text: 'Buscamos por qué el organismo no está respondiendo, aunque se estén siguiendo las indicaciones del médico.',
      },
      {
        letter: 'D',
        title: 'Diseñar',
        text: 'Con todo eso se arma una ruta. A veces es un tratamiento regenerativo. A veces, primero un plan de preparación de unos 90 días. Y a veces la ruta es no tratar.',
      },
      {
        letter: 'E',
        title: 'Encaminar',
        text: 'Te acompañamos en el siguiente paso, coordinado con tu médico tratante, para que la decisión no quede en el aire.',
      },
    ],
    cta: 'Quiero ver cómo funciona',
  },

  founder: {
    name: PERSON_NAME,
    role: 'Fundador de Power House Biotech',
    title: 'No te vamos a vender un tratamiento. Te vamos a dar claridad.',
    bio: [
      'No soy médico. Soy investigador y emprendedor en el sector salud, y llevo años trabajando junto a equipos médicos en medicina regenerativa.',
      'Mi padre, el doctor Juan Antonio Garza Quintanilla, dedicó su vida a la medicina regenerativa. Crecí viendo lo que pasa cuando se decide bien, y también lo que pasa cuando se decide a ciegas.',
    ],
    quote: 'Preferimos tu confianza antes que tu dinero.',
    facts: [
      { value: '20%', label: 'de los perfiles que nos escriben pasa a la evaluación' },
      { value: '6', label: 'pasos del método DECIDE, siempre en orden' },
      { value: '48–72 h', label: 'para la lectura personalizada de tus estudios' },
    ],
    recognition: 'Reconocido por Forbes entre los emprendedores a seguir',
  },

  fit: {
    title: 'Esto no es para todos.',
    yesTitle: 'Es para ti si…',
    noTitle: 'No es para ti si…',
    yes: [
      'Tienes más de 40 años y llevas tiempo con una condición que no termina de resolverse.',
      'Ya probaste otras opciones y estás pensando en células madre, exosomas u otra terapia regenerativa.',
      'Quieres saber si tiene sentido en tu caso antes de invertir, y estás dispuesto a escuchar un "todavía no".',
      'Acompañas a tu papá, a tu mamá o a tu pareja y quieres ayudarle a decidir bien.',
    ],
    no: [
      'Buscas una solución mágica o rápida.',
      'Quieres dejar de lado a tu médico. Esta evaluación no reemplaza la consulta médica, la complementa.',
      'Hoy no estás en posición de invertir en tu salud.',
    ],
  },

  closing: {
    title: 'Primero entender. Después decidir.',
    sub: 'No estás contratando un tratamiento. Estás contratando la claridad para saber si un tratamiento vale la pena antes de pagarlo.',
    cta: 'Ver el video completo',
  },

  // Testimonios y equipo: solo datos reales. Vacío = la sección no se muestra.
  testimonials: {
    eyebrow: 'Resultados',
    title: 'Lo que dicen quienes ya lo hicieron',
    items: [] as Testimonial[],
  },
  team: {
    eyebrow: 'Quién te acompaña',
    title: 'El equipo detrás de la evaluación',
    items: [] as TeamMember[],
  },

  sticky: { title: 'Evaluación de Viabilidad Regenerativa', sub: `Video de ${PERSON_NAME}`, cta: 'Ver video' },
  disclaimer:
    'Esta evaluación no reemplaza la consulta médica, la complementa. Los resultados dependen de cada caso. Este sitio no está respaldado por Meta Platforms, Inc. ni forma parte de Facebook.',
}

// ── Modal de registro ─────────────────────────────────────────────────────────
export const REGISTRO = {
  eyebrow: 'Evaluación de Viabilidad Regenerativa',
  title: 'Mira el video completo',
  sub: `${PERSON_NAME} te explica por qué pasa esto, cómo lo evaluamos y cuál es el primer paso para decidir con claridad.`,
  submit: 'Ver el video completo',
  submitPago: 'Continuar',
  legal: 'Tus datos están seguros · No spam',
}

// ── /ver-video ────────────────────────────────────────────────────────────────
export const VIDEO = {
  step: 'Paso 1 de 2',
  eyebrow: `${PERSON_NAME} · ${BRAND_NAME}`,
  title: 'Por qué tu cuerpo no responde al tratamiento, y qué hacer antes de invertir',
  sub: 'Mira el video completo. Al final puedes responder unas preguntas y agendar tu consulta.',
  lockText: 'El botón se habilita en',
  cta: 'Agendar mi consulta',
  trust: 'Videollamada informativa · Solo alrededor del 20% de los perfiles pasa a la evaluación',
}

// ── Cualificación (las preguntas están en utils/qualification.ts) ─────────────
export const CUALIFICACION = {
  eyebrow: 'Consulta Informativa',
  title: 'Cuéntanos de tu caso',
  sub: 'Unas preguntas, una a la vez. Nos ayudan a saber si tu perfil es para nosotros.',
  consent: `Acepto que ${BRAND_NAME} me contacte por WhatsApp y correo, y acepto su`,
  submit: 'Ver horarios disponibles',
}

// ── /agendar ──────────────────────────────────────────────────────────────────
export const BOOKING = {
  step: 'Paso 2 de 2',
  title: 'Elige el día y la hora de tu consulta',
  sub: 'Es una videollamada, desde donde estés. Vas a entender qué podría estar frenando tu recuperación y si vale la pena considerar un tratamiento regenerativo en tu caso.',
  pending:
    'Estamos terminando de configurar el calendario. Te escribiremos por WhatsApp para coordinar tu consulta.',
}

// ── /cita-confirmada ──────────────────────────────────────────────────────────
export const BOOKED = {
  title: 'Tu consulta está confirmada',
  sub: 'Te enviamos los detalles a tu correo.',
  steps: [
    { icon: 'fa-solid fa-envelope', title: 'Revisa tu correo', text: 'Ahí tienes la fecha, la hora y el enlace de la videollamada.' },
    { icon: 'fa-brands fa-whatsapp', title: 'Te escribimos por WhatsApp', text: 'Para confirmar y resolver dudas antes.' },
    { icon: 'fa-solid fa-flask-vial', title: 'Ten a la mano tus estudios', text: 'Tus estudios de laboratorio más recientes. Es lo único que te pedimos.' },
  ],
}

// ── /sin-espacio ──────────────────────────────────────────────────────────────
export const NO_SPACE = {
  title: 'Todavía no es el momento, y está bien',
  text: 'Por lo que nos contaste, hoy no vemos una consulta que te aporte lo que buscas. Si no vemos una posibilidad real, preferimos ser los primeros en decírtelo. Cuando estés listo, aquí estamos.',
  cooldown: 'Ya enviaste una solicitud. Podrás intentarlo de nuevo en',
  resourcesTitle: `Sigue aprendiendo con ${BRAND_NAME}`,
  resourcesText: 'En redes explicamos biomarcadores, análisis de laboratorio y medicina regenerativa con palabras simples.',
}

// ── Pago (opcional) ───────────────────────────────────────────────────────────
export const PAGO = {
  step: 'Paso 2 de 2 · Confirma tu lugar',
  title: 'falta un paso para confirmar tu lugar',
  sub: 'Tu lugar queda reservado cuando completas el pago.',
  bullets: ['[Formato: en vivo, en línea]', '[Qué se lleva el asistente]'],
  noLink: 'Recibimos tus datos. Te enviaremos el enlace de pago a tu WhatsApp y a tu correo.',
  whatsappMsg: (nombre: string) => `Hola, soy ${nombre}. Me registré y quiero completar mi pago.`,
  expired: 'El formulario de pago venció por seguridad. Ábrelo de nuevo para pagar.',
  loadError: 'No pudimos cargar el pago. Inténtalo de nuevo o escríbenos.',
}

export const CONFIRMADA = {
  title: 'Tu lugar está confirmado',
  steps: [
    { icon: 'fa-solid fa-envelope-open-text', text: 'Revisa tu correo: ahí te llega la confirmación y el acceso.' },
    { icon: 'fa-brands fa-whatsapp', text: 'Te escribiremos por WhatsApp antes de empezar.' },
    { icon: 'fa-solid fa-list-check', text: '[Qué preparar antes del evento]' },
  ],
  calendarTitle: '¿Prefieres que veamos tu caso? Agenda una reunión',
  calendarButton: 'Agendar una reunión',
  // Solo con Payphone: estados mientras se confirma el pago o si no se aprobó
  checking: 'Confirmando tu pago…',
  checkingSub: 'No cierres esta página, toma unos segundos.',
  failedTitle: 'Tu pago no se completó',
  failedSub: 'Payphone no aprobó el cobro. Puedes intentarlo de nuevo con otra tarjeta.',
  nodataTitle: 'No encontramos un pago en este enlace',
  nodataSub: 'Si ya pagaste, te llega la confirmación a tu correo. Si no, completa tu pago aquí.',
  errorTitle: 'No pudimos confirmar tu pago',
  errorSub: 'Si se te descontó el dinero, escríbenos con este número de transacción y lo revisamos.',
  helpMsg: (nombre: string, tx: string) =>
    `Hola, soy ${nombre}. Pagué y no me aparece confirmado${tx ? ` (transacción ${tx})` : ''}.`,
}
