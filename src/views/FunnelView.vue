<script setup lang="ts">
// Landing (/). Todo el texto sale de LANDING en src/content/copy.ts.
// Cada botón que abre el registro lleva data-cta="registro" (lo usa el e2e).
// Estructura corta: hero → regla (banda oscura) → método DECIDE → quién habla + ¿es para ti? → cierre.
// Recurso visual propio: el degradado del logo PHB (navy → aqua) como "línea de lectura" de biomarcadores.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandLogo from '@/components/BrandLogo.vue'
import CountdownTimer from '@/components/CountdownTimer.vue'
import RegistrationModal from '@/components/RegistrationModal.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import TestimonialsSection from '@/components/TestimonialsSection.vue'
import {
  FOUNDER_PHOTO,
  IS_LOCAL,
  PERSON_NAME,
  STORAGE_PREFIX,
  VSL_POSTER,
  VSL_POSTER_FALLBACK,
} from '@/config/funnel'
import { LANDING } from '@/content/copy'
import { captureFbParams } from '@/utils/fbclid'

const route = useRoute()
const router = useRouter()
const modalOpen = ref(false)
const showSticky = ref(false)

// Portada del video: Cloudinary → archivo local → portada tipográfica de marca
const poster = ref(VSL_POSTER || VSL_POSTER_FALLBACK)
function onPosterError() {
  poster.value = poster.value !== VSL_POSTER_FALLBACK ? VSL_POSTER_FALLBACK : ''
}

function openModal() {
  // Quien no calificó hace menos de 24 h vuelve a /sin-espacio
  if (!IS_LOCAL) {
    const disqAt = Number(localStorage.getItem(`${STORAGE_PREFIX}_disq_at`))
    if (disqAt && Date.now() - disqAt < 24 * 60 * 60 * 1000) {
      router.push('/sin-espacio')
      return
    }
  }
  modalOpen.value = true
}

// ── Movimiento ────────────────────────────────────────────────────────────────
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const methodList = ref<HTMLElement | null>(null)
const activeStep = ref(0)
// Cifras que cuentan al aparecer: solo las que empiezan con un número entero simple ("20%", "6")
const factShown = ref(LANDING.founder.facts.map((f) => f.value))
let observers: IntersectionObserver[] = []
let raf = 0

function countUp(i: number) {
  const m = /^(\d+)(\D*)$/.exec(LANDING.founder.facts[i].value)
  if (!m || reduceMotion) return
  const target = Number(m[1])
  const t0 = performance.now()
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / 1100)
    const eased = 1 - Math.pow(1 - p, 3)
    factShown.value[i] = `${Math.round(target * eased)}${m[2]}`
    if (p < 1) requestAnimationFrame(step)
  }
  factShown.value[i] = `0${m[2]}`
  requestAnimationFrame(step)
}

function updateProgress() {
  raf = 0
  const el = methodList.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const mid = window.innerHeight * 0.55
  const p = Math.min(1, Math.max(0, (mid - r.top) / r.height))
  el.style.setProperty('--progress', p.toFixed(3))
}

const onScroll = () => {
  showSticky.value = window.scrollY > 700
  if (!raf && !reduceMotion) raf = requestAnimationFrame(updateProgress)
}

onMounted(() => {
  captureFbParams()
  window.addEventListener('scroll', onScroll, { passive: true })
  // /?editar=1 (desde "Corregir mis datos") reabre el registro con lo guardado
  if (route.query.editar) modalOpen.value = true

  const reveals = document.querySelectorAll<HTMLElement>('.reveal')
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'))
    methodList.value?.style.setProperty('--progress', '1')
    return
  }

  const revealIo = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const el = e.target as HTMLElement
        el.classList.add('is-in')
        if (el.dataset.fact !== undefined) countUp(Number(el.dataset.fact))
        revealIo.unobserve(el)
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
  )
  reveals.forEach((el) => revealIo.observe(el))

  // Paso activo del método: el que cruza el centro de la pantalla
  const stepIo = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) activeStep.value = Number((e.target as HTMLElement).dataset.step)
    },
    { rootMargin: '-45% 0px -45% 0px' },
  )
  methodList.value?.querySelectorAll('[data-step]').forEach((el) => stepIo.observe(el))

  observers = [revealIo, stepIo]
  updateProgress()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  observers.forEach((o) => o.disconnect())
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="landing">
    <header class="topbar">
      <div class="wrap topbar__inner">
        <BrandLogo />
        <CountdownTimer />
      </div>
    </header>

    <!-- 1 · HERO -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__bg" aria-hidden="true">
        <span class="cell cell--a"></span>
        <span class="cell cell--b"></span>
        <span class="cell cell--c"></span>
      </div>

      <div class="wrap hero__inner">
        <div class="hero__copy">
          <h1 id="hero-title" class="hero__title enter" style="--d: 0ms">
            {{ LANDING.headline }}
            <span class="accent">{{ LANDING.headlineAccent }}</span>
          </h1>
          <p class="hero__sub enter" style="--d: 120ms">{{ LANDING.sub }}</p>

          <div class="hero__cta enter" style="--d: 240ms">
            <button type="button" class="btn btn--lg btn--arrow" data-cta="registro" @click="openModal">
              <i class="fa-solid fa-play" aria-hidden="true"></i> {{ LANDING.cta }}
            </button>
            <p class="hero__note">
              <i class="fa-solid fa-lock" aria-hidden="true"></i> {{ LANDING.ctaNote }}
            </p>
          </div>
        </div>

        <button
          type="button"
          class="vsl enter"
          style="--d: 180ms"
          data-cta="registro"
          aria-label="Ver el video completo"
          @click="openModal"
        >
          <img
            v-if="poster"
            class="vsl__poster"
            :src="poster"
            alt=""
            fetchpriority="high"
            decoding="async"
            @error="onPosterError"
          />
          <span v-else class="vsl__quote" aria-hidden="true">“{{ LANDING.videoQuote }}”</span>
          <span class="vsl__play" aria-hidden="true"><i class="fa-solid fa-play"></i></span>
          <span class="vsl__caption">
            <strong>{{ PERSON_NAME }}</strong>
            <span>{{ LANDING.videoCaption }}</span>
          </span>
        </button>
      </div>

      <!-- Línea de lectura: el degradado del logo dibujándose como un trazo de biomarcador -->
      <svg class="trace" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="phb-grad" x1="0" x2="1">
            <stop offset="0" stop-color="#1e1b45" />
            <stop offset=".38" stop-color="#4a6fa5" />
            <stop offset=".68" stop-color="#6bb8f5" />
            <stop offset="1" stop-color="#8eedf2" />
          </linearGradient>
        </defs>
        <path
          pathLength="1"
          d="M0 78 C 140 78 180 78 240 70 S 330 24 380 60 S 470 96 540 74 S 640 40 720 64 S 820 104 900 70 S 1010 30 1080 58 S 1200 86 1290 62 S 1400 50 1440 54"
        />
      </svg>
    </section>

    <!-- 2 · LA REGLA (banda oscura) -->
    <section class="rule" aria-labelledby="rule-title">
      <div class="wrap">
        <h2 id="rule-title" class="rule__title reveal">{{ LANDING.rule.title }}</h2>
        <ol class="rule__line reveal" role="list">
          <li v-for="(r, i) in LANDING.rule.items" :key="r" :style="{ '--i': i }" :class="{ last: i === LANDING.rule.items.length - 1 }">
            <span class="rule__node" aria-hidden="true"></span>
            <span class="rule__text">{{ r }}</span>
          </li>
        </ol>
        <p class="rule__metaphor reveal">{{ LANDING.rule.metaphor }}</p>
      </div>
    </section>

    <!-- 3 · MÉTODO DECIDE -->
    <section class="method" aria-labelledby="method-title">
      <div class="wrap method__inner">
        <div class="method__head">
          <h2 id="method-title" class="method__title reveal">
            El método <span class="grad-text">DECIDE</span>
          </h2>
          <p class="method__sub reveal">{{ LANDING.method.sub }}</p>
          <button type="button" class="btn btn--arrow method__cta reveal" data-cta="registro" @click="openModal">
            {{ LANDING.method.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>

        <ol ref="methodList" class="steps" role="list">
          <li
            v-for="(s, i) in LANDING.method.items"
            :key="s.title"
            class="step reveal"
            :class="{ 'is-active': activeStep === i, 'is-past': activeStep > i }"
            :data-step="i"
          >
            <span class="step__letter" aria-hidden="true">{{ s.letter }}</span>
            <div class="step__body">
              <h3 class="step__title">{{ s.title }}</h3>
              <p class="step__text">{{ s.text }}</p>
              <ul v-if="'markers' in s && s.markers" class="markers" role="list" aria-label="Biomarcadores que se leen juntos">
                <li v-for="(m, j) in s.markers" :key="m" :style="{ '--j': j }">{{ m }}</li>
              </ul>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- 4 · QUIÉN HABLA -->
    <section class="founder" aria-labelledby="founder-title">
      <div class="wrap founder__inner">
        <div class="founder__story">
          <img v-if="FOUNDER_PHOTO" class="founder__photo reveal" :src="FOUNDER_PHOTO" :alt="PERSON_NAME" loading="lazy" />
          <h2 id="founder-title" class="founder__title reveal">{{ LANDING.founder.title }}</h2>
          <p v-for="b in LANDING.founder.bio" :key="b" class="founder__bio reveal">{{ b }}</p>
          <p class="founder__sign reveal">
            <strong>{{ LANDING.founder.name }}</strong>
            <span>{{ LANDING.founder.role }}</span>
          </p>
          <p class="founder__forbes reveal">
            <i class="fa-solid fa-award" aria-hidden="true"></i> {{ LANDING.founder.recognition }}
          </p>
        </div>

        <div class="founder__side">
          <blockquote class="founder__quote reveal">“{{ LANDING.founder.quote }}”</blockquote>
          <dl class="facts">
            <div v-for="(f, i) in LANDING.founder.facts" :key="f.label" class="fact reveal" :data-fact="i">
              <dt class="fact__value">{{ factShown[i] }}</dt>
              <dd class="fact__label">{{ f.label }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- ¿Es para ti? -->
      <div class="wrap fit" aria-labelledby="fit-title">
        <h2 id="fit-title" class="fit__title reveal">{{ LANDING.fit.title }}</h2>
        <div class="fit__cols">
          <div class="fit__col reveal">
            <h3 class="fit__head">{{ LANDING.fit.yesTitle }}</h3>
            <ul role="list">
              <li v-for="y in LANDING.fit.yes" :key="y">
                <i class="fa-solid fa-check" aria-hidden="true"></i><span>{{ y }}</span>
              </li>
            </ul>
          </div>
          <div class="fit__col fit__col--no reveal">
            <h3 class="fit__head">{{ LANDING.fit.noTitle }}</h3>
            <ul role="list">
              <li v-for="n in LANDING.fit.no" :key="n">
                <i class="fa-solid fa-xmark" aria-hidden="true"></i><span>{{ n }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <TestimonialsSection />

    <!-- CIERRE -->
    <section class="closing" aria-labelledby="closing-title">
      <div class="closing__glow" aria-hidden="true"></div>
      <div class="wrap closing__inner">
        <h2 id="closing-title" class="closing__title reveal">{{ LANDING.closing.title }}</h2>
        <p class="closing__sub reveal">{{ LANDING.closing.sub }}</p>
        <button type="button" class="btn btn--lg btn--light btn--arrow reveal" data-cta="registro" @click="openModal">
          <i class="fa-solid fa-play" aria-hidden="true"></i> {{ LANDING.closing.cta }}
        </button>
      </div>
    </section>

    <SiteFooter :disclaimer="LANDING.disclaimer" />

    <!-- CTA fijo -->
    <Transition name="sticky">
      <div v-if="showSticky && !modalOpen" class="sticky" role="region" aria-label="Ver el video">
        <div class="sticky__copy">
          <strong>{{ LANDING.sticky.title }}</strong>
          <span>{{ LANDING.sticky.sub }}</span>
        </div>
        <button type="button" class="btn" data-cta="registro" @click="openModal">
          {{ LANDING.sticky.cta }} <i class="fa-solid fa-play" aria-hidden="true"></i>
        </button>
      </div>
    </Transition>

    <RegistrationModal :open="modalOpen" @close="modalOpen = false" />
  </div>
</template>

<style scoped lang="scss">
$ease-out: cubic-bezier(0.22, 1, 0.36, 1);
// Degradado para texto sobre fondo claro: el del logo, oscurecido para que el tramo aqua se lea
$grad-text: linear-gradient(95deg, $brand-navy 0%, $primary 55%, #1f7fd0 100%);

.grad-text {
  background: $grad-text;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

// ── Entrada del hero (una vez, al cargar) ─────────────────────────────────────
.enter {
  animation: enter 0.8s $ease-out both;
  animation-delay: var(--d, 0ms);
}
@keyframes enter {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
}

// ── Aparición al hacer scroll ─────────────────────────────────────────────────
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.7s $ease-out,
    transform 0.7s $ease-out;

  &.is-in {
    opacity: 1;
    transform: none;
  }
}

// ── Encabezado ────────────────────────────────────────────────────────────────
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid rgba($line, 0.7);
  background: rgba($surface, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 68px;
  }

  :deep(.logo img) {
    height: 42px;
  }
}

// ── 1 · Hero ──────────────────────────────────────────────────────────────────
.hero {
  position: relative;
  padding: 40px 0 120px;
  overflow: hidden;
  background:
    radial-gradient(120% 80% at 100% 0%, rgba($brand-sky, 0.22), transparent 60%),
    linear-gradient(180deg, #eaf2fd 0%, $surface 100%);

  @media (min-width: 960px) {
    padding: 72px 0 150px;
  }

  &__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  &__inner {
    position: relative;
    display: grid;
    gap: 28px;

    // celular: titular → texto → video → botón
    @media (max-width: 959px) {
      gap: 0;
      .hero__copy {
        display: contents;
      }
      .hero__title {
        order: 1;
      }
      .hero__sub {
        order: 2;
        margin-bottom: 28px;
      }
      .vsl {
        order: 3;
      }
      .hero__cta {
        order: 4;
        align-items: stretch;
        text-align: center;
      }
    }

    @media (min-width: 960px) {
      grid-template-columns: 1.05fr 1fr;
      align-items: center;
      gap: 56px;
    }
  }

  &__title {
    font-size: clamp(2.1rem, 6.4vw, 3.6rem);
    letter-spacing: -0.035em;
    color: $ink;

    .accent {
      color: $primary;
    }
  }

  &__sub {
    max-width: 540px;
    margin: 20px 0 0;
    color: $ink-muted;
    font-size: 1.05rem;
  }

  &__cta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-top: 28px;

  }

  &__note {
    color: $ink-muted;
    font-size: 0.85rem;
  }
}

// Células flotando (decorativo, solo transform)
.cell {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, rgba(#fff, 0.9), rgba($brand-sky, 0.25) 45%, rgba($brand-aqua, 0.08) 70%);
  border: 1px solid rgba(#fff, 0.7);
  box-shadow: inset 0 0 40px rgba($brand-sky, 0.25);
  animation: drift 18s ease-in-out infinite alternate;

  &--a {
    width: 220px;
    height: 220px;
    top: -60px;
    right: 6%;
  }
  &--b {
    width: 90px;
    height: 90px;
    top: 52%;
    left: -24px;
    animation-duration: 22s;
    animation-delay: -6s;
  }
  &--c {
    width: 46px;
    height: 46px;
    top: 18%;
    left: 46%;
    animation-duration: 15s;
    animation-delay: -3s;
  }
}
@keyframes drift {
  to {
    transform: translate3d(-18px, 26px, 0) scale(1.04);
  }
}

.vsl {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 4 / 3.6;
  padding: 0;
  border: 0;
  border-radius: 28px;
  background:
    radial-gradient(90% 70% at 85% 10%, rgba($brand-aqua, 0.35), transparent 60%),
    radial-gradient(80% 80% at 0% 100%, rgba($brand-steel, 0.55), transparent 60%),
    $surface-dark;
  color: $ink-on-dark;
  cursor: pointer;
  font: inherit;
  text-align: left;
  overflow: hidden;
  box-shadow:
    0 30px 60px -20px rgba($brand-navy, 0.45),
    0 0 0 1px rgba(#fff, 0.08) inset;
  transition: transform 0.4s $ease-out, box-shadow 0.4s $ease-out;

  @media (min-width: 600px) {
    aspect-ratio: 16 / 11;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-4px);
      box-shadow:
        0 40px 70px -24px rgba($brand-navy, 0.55),
        0 0 0 1px rgba(#fff, 0.12) inset;
    }
  }

  &__poster {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__quote {
    position: absolute;
    top: 24px;
    left: 24px;
    right: 24px;
    font-family: $font-display;
    font-weight: 700;
    font-size: clamp(1.25rem, 4.4vw, 1.75rem);
    line-height: 1.15;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }

  &__play {
    position: relative;
    display: grid;
    place-items: center;
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background: #fff;
    color: $brand-indigo;
    font-size: 1.6rem;
    padding-left: 5px;
    transition: transform 0.3s $ease-out;

    // Anillo que respira: indica que es un video sin moverse de lugar
    &::before {
      content: '';
      position: absolute;
      inset: -10px;
      border-radius: 50%;
      border: 2px solid rgba($brand-aqua, 0.7);
      animation: ring 2.4s $ease-out infinite;
    }
  }

  // Sin foto: la cita arriba y el play abajo a la derecha, para que no se monten
  &:not(:has(.vsl__poster)) &__play {
    position: absolute;
    left: 24px;
    bottom: 96px;
    width: 72px;
    height: 72px;
    font-size: 1.35rem;
  }

  &:hover &__play {
    transform: scale(1.06);
  }
  &:active &__play {
    transform: scale(0.96);
  }

  &__caption {
    position: absolute;
    left: 24px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    font-size: 0.85rem;
    color: $ink-on-dark-muted;

    strong {
      color: $ink-on-dark;
      font-size: 1rem;
      font-weight: 600;
    }
  }

  // Con foto: degradado abajo para que el nombre se lea
  &:has(&__poster)::after {
    content: '';
    position: absolute;
    inset: 50% 0 0;
    background: linear-gradient(transparent, rgba($surface-dark, 0.85));
  }
  &__caption,
  &__play {
    z-index: 1;
  }
}
@keyframes ring {
  0% {
    transform: scale(0.9);
    opacity: 1;
  }
  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

.trace {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 18px;
  width: 100%;
  height: 90px;
  pointer-events: none;

  path {
    fill: none;
    stroke: url(#phb-grad);
    stroke-width: 3;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: draw 2.2s 0.5s $ease-out forwards;
  }
}
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

// ── 2 · La regla ──────────────────────────────────────────────────────────────
.rule {
  position: relative;
  padding: 88px 0 96px;
  background:
    radial-gradient(60% 90% at 100% 0%, rgba($brand-steel, 0.35), transparent 60%),
    $surface-dark;
  color: $ink-on-dark;

  &__title {
    font-size: clamp(1.9rem, 5vw, 3rem);
  }

  &__line {
    position: relative;
    display: grid;
    gap: 22px;
    margin: 44px 0 0;
    padding: 0 0 0 30px;
    list-style: none;

    // la línea que une los cuatro pasos y se dibuja al aparecer
    &::before {
      content: '';
      position: absolute;
      top: 10px;
      bottom: 10px;
      left: 7px;
      width: 2px;
      background: linear-gradient(180deg, $brand-steel, $brand-sky, $brand-aqua);
      transform: scaleY(0);
      transform-origin: top;
      transition: transform 1.4s $ease-out;
    }

    @media (min-width: 860px) {
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      padding: 34px 0 0;

      &::before {
        top: 7px;
        bottom: auto;
        left: 0;
        right: 0;
        width: auto;
        height: 2px;
        background: $brand-gradient;
        transform: scaleX(0);
        transform-origin: left;
      }
    }

    &.is-in::before {
      transform: none;
    }

    // la banda entera ya hace su propia entrada: los pasos aparecen en cascada siguiendo la línea
    &.reveal {
      transform: none;
    }

    li {
      position: relative;
      opacity: 0;
      transform: translateY(10px);
      transition:
        opacity 0.6s $ease-out,
        transform 0.6s $ease-out;
      transition-delay: calc(var(--i) * 260ms + 200ms);
    }
    &.is-in li {
      opacity: 1;
      transform: none;
    }
  }

  &__node {
    position: absolute;
    top: 6px;
    left: -30px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: $surface-dark;
    border: 2px solid $brand-sky;

    @media (min-width: 860px) {
      top: -34px;
      left: 0;
    }
  }

  &__text {
    display: block;
    font-family: $font-display;
    font-size: clamp(1.25rem, 2.6vw, 1.6rem);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: $ink-on-dark-muted;
  }

  .last &__text {
    color: $ink-on-dark;
  }
  .last &__node {
    background: $brand-aqua;
    border-color: $brand-aqua;
    box-shadow: 0 0 0 6px rgba($brand-aqua, 0.18);
  }

  &__metaphor {
    max-width: 640px;
    margin-top: 56px;
    padding-left: 18px;
    border-left: 2px solid rgba($brand-aqua, 0.5);
    color: $ink-on-dark-muted;
    font-size: 1.05rem;
    font-style: italic;
  }
}

// ── 3 · Método DECIDE ─────────────────────────────────────────────────────────
.method {
  padding: 96px 0;

  &__inner {
    display: grid;
    gap: 40px;

    @media (min-width: 960px) {
      grid-template-columns: 0.85fr 1.15fr;
      gap: 72px;
      align-items: start;
    }
  }

  &__head {
    @media (min-width: 960px) {
      position: sticky;
      top: 120px;
    }
  }

  &__title {
    font-size: clamp(2.2rem, 6vw, 3.6rem);
    letter-spacing: -0.04em;
  }

  &__sub {
    max-width: 440px;
    margin-top: 16px;
    color: $ink-muted;
    font-size: 1.05rem;
  }

  &__cta {
    margin-top: 28px;

    @media (max-width: 959px) {
      display: none; // en celular el botón va después de los pasos (sticky CTA cubre)
    }
  }
}

.steps {
  --progress: 0;
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;

  // riel de progreso detrás de las letras
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 36px;
    bottom: 36px;
    left: 35px;
    width: 2px;
    border-radius: 2px;
  }
  &::before {
    background: $line;
  }
  &::after {
    background: linear-gradient(180deg, $brand-navy, $primary 50%, $brand-sky);
    transform: scaleY(var(--progress));
    transform-origin: top;
  }
}

.step {
  position: relative;
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 20px;
  padding: 22px 0;

  &__letter {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    border-radius: 22px;
    background: $raised;
    border: 1px solid $line;
    font-family: $font-display;
    font-size: 2.4rem;
    font-weight: 700;
    color: rgba($ink, 0.25);
    transition:
      color 0.4s $ease-out,
      background 0.4s $ease-out,
      border-color 0.4s $ease-out,
      transform 0.4s $ease-out,
      box-shadow 0.4s $ease-out;
  }

  &.is-past &__letter {
    color: $primary;
    border-color: rgba($primary, 0.3);
  }

  &.is-active &__letter {
    color: #fff;
    background: linear-gradient(135deg, $brand-navy, $primary 60%, $brand-sky);
    border-color: transparent;
    transform: scale(1.06);
    box-shadow: 0 16px 30px -12px rgba($primary, 0.6);
  }

  &__body {
    padding-top: 10px;
  }

  &__title {
    font-size: 1.45rem;
    letter-spacing: -0.02em;
  }

  &__text {
    margin-top: 6px;
    max-width: 520px;
    color: $ink-muted;
  }
}

// Biomarcadores "leídos juntos": píldoras unidas por una línea que se dibuja
.markers {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding: 8px 14px;
    border: 1px solid rgba($primary, 0.25);
    border-radius: 999px;
    background: $primary-soft;
    color: $brand-indigo;
    font-size: 0.85rem;
    font-weight: 500;
    opacity: 0;
    transform: scale(0.92);
    transition:
      opacity 0.45s $ease-out,
      transform 0.45s $ease-out;
    transition-delay: calc(var(--j) * 140ms + 250ms);
  }

  .step.is-in & li {
    opacity: 1;
    transform: none;
  }
}

// ── 4 · Quién habla ───────────────────────────────────────────────────────────
.founder {
  padding: 96px 0 88px;
  background: $raised;
  border-top: 1px solid $line;

  &__inner {
    display: grid;
    gap: 48px;

    @media (min-width: 960px) {
      grid-template-columns: 1.15fr 0.85fr;
      gap: 80px;
    }
  }

  &__photo {
    width: 100%;
    max-width: 420px;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    border-radius: 24px;
    margin-bottom: 28px;
  }

  &__title {
    font-size: clamp(1.9rem, 4.6vw, 2.9rem);
    letter-spacing: -0.035em;
  }

  &__bio {
    max-width: 560px;
    margin-top: 18px;
    color: $ink-muted;
    font-size: 1.02rem;
  }

  &__sign {
    display: flex;
    flex-direction: column;
    margin-top: 28px;
    padding-top: 18px;
    border-top: 2px solid transparent;
    border-image: $brand-gradient 1;
    max-width: 260px;

    strong {
      font-weight: 600;
      font-size: 1.05rem;
    }
    span {
      color: $ink-muted;
      font-size: 0.9rem;
    }
  }

  &__forbes {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    padding: 8px 14px;
    border-radius: 999px;
    background: $surface;
    border: 1px solid $line;
    font-size: 0.85rem;
    color: $ink;

    i {
      color: $primary;
    }
  }

  &__quote {
    margin: 0 0 32px;
    font-family: $font-display;
    font-size: clamp(1.4rem, 3vw, 1.8rem);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }
}

.facts {
  display: grid;
  margin: 0;
}

.fact {
  display: grid;
  grid-template-columns: minmax(118px, auto) 1fr;
  align-items: baseline;
  gap: 18px;
  padding: 20px 0;
  border-top: 1px solid $line;

  &__value {
    font-family: $font-display;
    font-size: clamp(2.2rem, 5vw, 2.8rem);
    font-weight: 700;
    letter-spacing: -0.04em;
    font-variant-numeric: tabular-nums;
    color: $primary;
    white-space: nowrap;
  }

  &__label {
    margin: 0;
    color: $ink-muted;
    font-size: 0.95rem;
  }
}

.fit {
  margin-top: 96px;

  &__title {
    font-size: clamp(1.9rem, 4.6vw, 2.9rem);
    letter-spacing: -0.035em;
  }

  &__cols {
    display: grid;
    gap: 40px;
    margin-top: 36px;

    @media (min-width: 860px) {
      grid-template-columns: 1.2fr 1fr;
      gap: 64px;
    }
  }

  &__head {
    font-size: 1.2rem;
    padding-bottom: 14px;
    border-bottom: 2px solid $primary;
  }
  &__col--no &__head {
    color: $ink-muted;
    border-bottom-color: $line;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 10px;
    padding: 16px 0;
    border-bottom: 1px solid $line;

    i {
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      margin-top: 2px;
      border-radius: 50%;
      background: $primary-soft;
      color: $primary;
      font-size: 0.75rem;
    }
  }

  &__col--no li {
    color: $ink-muted;

    i {
      background: $surface;
      color: $ink-muted;
    }
  }
}

// ── Cierre ────────────────────────────────────────────────────────────────────
.closing {
  position: relative;
  padding: 104px 0;
  overflow: hidden;
  background: $surface-dark;
  color: $ink-on-dark;

  &__glow {
    position: absolute;
    left: 50%;
    top: 100%;
    width: 1100px;
    height: 600px;
    translate: -50% -55%;
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba($brand-sky, 0.45), rgba($brand-steel, 0.2) 55%, transparent);
    filter: blur(10px);
    pointer-events: none;
  }

  &__inner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__title {
    max-width: 760px;
    font-size: clamp(2.2rem, 6vw, 3.8rem);
    letter-spacing: -0.04em;
  }

  &__sub {
    max-width: 560px;
    margin: 18px 0 34px;
    color: $ink-on-dark-muted;
    font-size: 1.05rem;
  }
}

// ── Botones de esta página ────────────────────────────────────────────────────
.btn {
  box-shadow: 0 12px 24px -12px rgba($primary, 0.7);
}

.btn--light {
  background: #fff;
  color: $brand-indigo;
  box-shadow: 0 16px 40px -14px rgba($brand-aqua, 0.6);

  &:hover:not(:disabled) {
    background: #eaf6ff;
  }
}

.btn--arrow i.fa-arrow-right {
  transition: transform 0.25s $ease-out;
}
.btn--arrow:hover i.fa-arrow-right {
  transform: translateX(3px);
}

// ── CTA fijo ──────────────────────────────────────────────────────────────────
.sticky {
  position: fixed;
  right: 12px;
  bottom: calc(12px + env(safe-area-inset-bottom));
  left: 12px;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 10px 10px 16px;
  border: 1px solid $line;
  border-radius: 16px;
  background: rgba($raised, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: $shadow-modal;

  &__copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
    font-size: 0.8rem;
    color: $ink-muted;

    strong {
      overflow: hidden;
      color: $ink;
      font-size: 0.9rem;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .btn {
    flex: none;
  }

  @media (min-width: 900px) {
    right: auto;
    left: 50%;
    width: 560px;
    transform: translateX(-50%);
  }
}

.sticky-enter-active,
.sticky-leave-active {
  transition:
    opacity 0.25s ease,
    translate 0.25s $ease-out;
}
.sticky-enter-from,
.sticky-leave-to {
  opacity: 0;
  translate: 0 14px;
}

// ── Movimiento reducido: todo visible y quieto ────────────────────────────────
@media (prefers-reduced-motion: reduce) {
  .reveal,
  .rule__line li,
  .markers li {
    opacity: 1;
    transform: none;
  }
  .rule__line::before {
    transform: none;
  }
  .trace path {
    stroke-dashoffset: 0;
  }
  .cell,
  .vsl__play::before {
    animation: none;
  }
  .steps::after {
    transform: none;
  }
}
</style>
