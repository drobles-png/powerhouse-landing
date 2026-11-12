// Modelo de cualificación del funnel: UNA sola fuente de verdad.
// Para un cliente nuevo solo se editan QUESTIONS, OBJETIVO y la regla de qualifies().
// Salen del cierre del VSL / de lo que el cliente define como "sí es cliente" (no inventar).
//
// Cada respuesta viaja a GHL como `<key>` (valor interno) y `<key>_label` (texto legible:
// es el que se mapea en los campos personalizados). Ver references/contrato-ghl.md de la skill.
// Los `value` son estables: si GHL ya está mapeado, NO renombrarlos (solo agregar).

export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  key: string
  title: string
  /** Etiqueta corta para la nota del CRM */
  noteLabel: string
  options: readonly QuestionOption[]
}

export const QUESTIONS = [
  {
    key: 'edad',
    title: '¿Qué edad tiene la persona que busca la evaluación?',
    noteLabel: 'Edad del paciente',
    options: [
      { value: 'menos_40', label: 'Menos de 40 años' },
      { value: 'de_40_a_55', label: 'Entre 40 y 55 años' },
      { value: 'de_56_a_70', label: 'Entre 56 y 70 años' },
      { value: 'mas_70', label: 'Más de 70 años' },
    ],
  },
  {
    key: 'condicion',
    title: '¿Cuánto tiempo lleva la condición sin resolverse?',
    noteLabel: 'Tiempo con la condición',
    options: [
      { value: 'menos_1', label: 'Menos de 1 año' },
      { value: 'de_1_a_3', label: 'Entre 1 y 3 años' },
      { value: 'mas_3', label: 'Más de 3 años' },
      { value: 'solo_info', label: 'No tengo una condición, solo quiero informarme' },
    ],
  },
  {
    key: 'medico',
    title: '¿Cómo es tu relación con tu médico tratante?',
    noteLabel: 'Médico tratante',
    options: [
      { value: 'con_medico', label: 'Tengo médico y quiero que esto complemente su seguimiento' },
      { value: 'sin_medico', label: 'Hoy no tengo un médico que lleve mi caso' },
      { value: 'dejar_medico', label: 'Quiero dejar de lado a mi médico' },
    ],
  },
  {
    key: 'inversion',
    title: 'Si resultas candidato, un tratamiento regenerativo es una inversión importante. ¿Estás en posición de invertir en tu salud?',
    noteLabel: 'Inversión',
    options: [
      { value: 'puede_invertir', label: 'Sí, estoy en posición de invertir si tiene sentido en mi caso' },
      { value: 'con_familia', label: 'Sí, junto con mi familia' },
      { value: 'no_puede', label: 'Hoy no estoy en posición de invertir' },
    ],
  },
] as const satisfies readonly Question[]

/** Último paso: pregunta abierta (va a GHL como `objetivo`). */
export const OBJETIVO = {
  title: 'Cuéntanos tu caso: tu condición, qué tratamientos ya probaste y qué esperas lograr',
  placeholder: 'Ej.: Tengo dolor de rodilla hace 5 años, probé infiltraciones y fisioterapia sin cambio. Quiero saber si una terapia regenerativa tiene sentido para mí.',
  minWords: 10,
}

export type QuestionKey = (typeof QUESTIONS)[number]['key']
export type Answers = Record<QuestionKey, string>

export const emptyAnswers = (): Answers =>
  Object.fromEntries(QUESTIONS.map((q) => [q.key, ''])) as Answers

export function labelFor(key: QuestionKey, value: string): string {
  const q = QUESTIONS.find((x) => x.key === key)
  return q?.options.find((o) => o.value === value)?.label ?? value
}

// ── Regla de cualificación ────────────────────────────────────────────────────
// Sale del "no es para ti" del VSL: menores de 40, quien solo quiere informarse, quien quiere dejar
// de lado a su médico y quien hoy no está en posición de invertir. [CONFIRMAR con el cliente]
const DISQUALIFY: Partial<Record<QuestionKey, readonly string[]>> = {
  edad: ['menos_40'],
  condicion: ['solo_info'],
  medico: ['dejar_medico'],
  inversion: ['no_puede'],
}

export function qualifies(a: Answers): boolean {
  return (Object.keys(DISQUALIFY) as QuestionKey[]).every(
    (k) => !(DISQUALIFY[k] ?? []).includes(a[k]),
  )
}
