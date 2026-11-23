# Power House Biotech · Funnel VSL

Cliente: Power House Biotech (PHB). Quien habla: Juan Román Garza (fundador). Estrategia (ficha Bakano):
ticket alto (~5,000 USD), objetivo **citas agendadas**.

Flujo: `/` → registro → `/ver-video` → cualificación → `/agendar` (calendario GHL) → `/cita-confirmada`.
Sin pago. Oferta: Consulta Informativa de Evaluación de Viabilidad Regenerativa (videollamada).

## Diseño
Corta y con poco texto (pedido de David): hero con video → qué te llevas de la consulta (3 puntos +
cómo se agenda) → para quién es / no es → cierre "Primero entender. Después decidir.".
Recurso propio: el degradado del logo PHB (navy → aqua) como trazo bajo el hero y en los números.
Títulos Helvetica, textos Poppins (ficha). Colores en `src/styles/tokens.scss`.
`.reveal` solo en elementos sin `:class` dinámico (Vue borra `is-in` al reescribir la clase).

## Cualificación (`src/utils/qualification.ts`)
edad · condicion · medico · inversion + abierta (caso, tratamientos probados, qué espera lograr).
No califica: `edad=menos_40`, `condicion=solo_info`, `medico=dejar_medico`, `inversion=no_puede`
(sale del "no es para ti" del VSL). **Confirmar con el cliente.**

## Pendientes
- Media ID de Wistia
- Meta Pixel ID + token CAPI (lo tiene David)
- Foto de Juan Román: lista en `public/vsl-poster.webp`
- Logo en PNG/SVG con fondo transparente (el actual es recorte del JPG)
- País por defecto del teléfono: puse MX, confirmar
- Legales: razón social, RUC/RFC, ciudad, correo (`LEGAL`)
- Dominio final y `og:image` 1200×630
- Confirmar la regla de cualificación

## Auditoría 22-nov-2026
- El calendario `Pt4IJuFRDFG2EsbVaZsR` (round robin del grupo `ccQ5gzARdfxHFoGrza5E`, por eso el frame id empieza distinto) **no tiene usuarios asignados**: GHL responde "No users found in the calendar" → no muestra horarios. Asignar quién atiende en GHL antes de publicar.
