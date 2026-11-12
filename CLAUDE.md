# Power House Biotech · Funnel VSL

Cliente: Power House Biotech (PHB). Quien habla: Juan Román Garza (fundador). Estrategia (ficha Bakano):
ticket alto (~5,000 USD), objetivo **citas agendadas**.

Flujo: `/` → registro → `/ver-video` → cualificación → `/agendar` (calendario GHL) → `/cita-confirmada`.
Sin pago. Oferta: Consulta Informativa de Evaluación de Viabilidad Regenerativa (videollamada).

## Diseño
Estructura corta: hero (portada del video) → regla "Primero entendemos, luego medimos…" (banda oscura)
→ método DECIDE (letras que se activan con el scroll + riel de progreso) → quién habla + cifras +
"Esto no es para todos" → cierre "Primero entender. Después decidir.".
Recurso propio: el degradado del logo PHB (navy → aqua) como línea de lectura de biomarcadores.
Títulos Helvetica, textos Poppins (ficha). Colores en `src/styles/tokens.scss`.

## Cualificación (`src/utils/qualification.ts`)
edad · condicion · medico · inversion + abierta (caso, tratamientos probados, qué espera lograr).
No califica: `edad=menos_40`, `condicion=solo_info`, `medico=dejar_medico`, `inversion=no_puede`
(sale del "no es para ti" del VSL). **Confirmar con el cliente.**

## Pendientes
- Webhooks GHL de contacto y cualificación → `src/config/funnel.ts`
- Calendario GHL (`src` + `id` del iframe)
- Media ID de Wistia
- Meta Pixel ID + token CAPI (lo tiene David)
- Foto de Juan Román para la portada del video (`VSL_POSTER`) y otra para "quién habla" (`FOUNDER_PHOTO`)
- Logo en PNG/SVG con fondo transparente (el actual es recorte del JPG)
- País por defecto del teléfono: puse MX, confirmar
- Legales: razón social, RUC/RFC, ciudad, correo (`LEGAL`)
- Dominio final y `og:image` 1200×630
- Confirmar la regla de cualificación
