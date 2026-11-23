<script setup lang="ts">
// Landing (/). Todo el texto sale de LANDING en src/content/copy.ts.
// Cada botón que abre el registro lleva data-cta="registro" (lo usa el e2e).
// Estructura corta: hero con video → qué te llevas de la consulta → para quién es → cierre.
// Recurso visual propio: el degradado del logo PHB (navy → aqua) como "línea de lectura" de biomarcadores.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandLogo from '@/components/BrandLogo.vue'
import CountdownTimer from '@/components/CountdownTimer.vue'
import RegistrationModal from '@/components/RegistrationModal.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import TestimonialsSection from '@/components/TestimonialsSection.vue'
import {
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

// ── Aparición al hacer scroll (una vez por elemento) ───────────────────────────
// Solo en elementos sin :class dinámico: Vue reescribe `class` al cambiar un binding y borraría `is-in`.
let io: IntersectionObserver | undefined
const onScroll = () => (showSticky.value = window.scrollY > 700)

onMounted(() => {
  captureFbParams()
  window.addEventListener('scroll', onScroll, { passive: true })
  // /?editar=1 (desde "Corregir mis datos") reabre el registro con lo guardado
  if (route.query.editar) modalOpen.value = true

  const reveals = document.querySelectorAll<HTMLElement>('.reveal')
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'))
    return
  }
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('is-in')
        io?.unobserve(e.target)
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  )
  reveals.forEach((el) => io!.observe(el))
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  io?.disconnect()
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
            <button type="button" class="btn btn--lg" data-cta="registro" @click="openModal">
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
          :class="{ 'vsl--photo': poster }"
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
          <span class="vsl__quote" aria-hidden="true">“{{ LANDING.videoQuote }}”</span>
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

    <!-- 2 · LA OFERTA: qué te llevas de la consulta -->
    <section class="offer" aria-labelledby="offer-title">
      <div class="wrap">
        <h2 id="offer-title" class="offer__title reveal">{{ LANDING.offer.title }}</h2>
        <ol class="offer__list" role="list">
          <li v-for="(item, i) in LANDING.offer.items" :key="item" class="reveal" :style="{ transitionDelay: `${i * 120}ms` }">
            <span class="offer__num" aria-hidden="true">{{ i + 1 }}</span>
            <span>{{ item }}</span>
          </li>
        </ol>
        <p class="offer__how reveal">{{ LANDING.offer.how.join(' → ') }}</p>
      </div>
    </section>

    <!-- 3 · PARA QUIÉN ES -->
    <section class="fit" aria-labelledby="fit-title">
      <div class="wrap">
        <h2 id="fit-title" class="fit__title reveal">{{ LANDING.fit.title }}</h2>
        <p class="fit__sub reveal">{{ LANDING.fit.sub }}</p>
        <div class="fit__cols">
          <ul class="fit__list reveal" role="list" aria-label="Es para ti si">
            <li v-for="y in LANDING.fit.yes" :key="y"><i class="fa-solid fa-check" aria-hidden="true"></i>{{ y }}</li>
          </ul>
          <ul class="fit__list fit__list--no reveal" role="list" aria-label="No es para ti si">
            <li v-for="n in LANDING.fit.no" :key="n"><i class="fa-solid fa-xmark" aria-hidden="true"></i>{{ n }}</li>
          </ul>
        </div>
      </div>
    </section>

    <TestimonialsSection />

    <!-- 4 · CIERRE -->
    <section class="closing" aria-labelledby="closing-title">
      <div class="closing__glow" aria-hidden="true"></div>
      <div class="wrap closing__inner">
        <h2 id="closing-title" class="closing__title reveal">{{ LANDING.closing.title }}</h2>
        <p class="closing__sign reveal">{{ LANDING.closing.sign }}</p>
        <button type="button" class="btn btn--lg btn--light reveal" data-cta="registro" @click="openModal">
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

  // Foto con fondo blanco: multiply la funde con el fondo celeste de la tarjeta
  &__poster {
    position: absolute;
    right: -4%;
    bottom: 0;
    height: 100%;
    width: auto;
    max-width: 62%;
    object-fit: cover;
    object-position: top;
    mix-blend-mode: multiply;
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

  // La cita arriba, el play debajo y el nombre abajo: nada se monta
  &__play {
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

  &__caption,
  &__play,
  &__quote {
    z-index: 1;
  }

  // Con foto: tarjeta celeste, texto índigo a la izquierda y Juan Román a la derecha
  &--photo {
    background: linear-gradient(160deg, #eaf3ff 0%, #cfe3fb 55%, #a9d3f7 100%);
    color: $ink;
    box-shadow:
      0 30px 60px -24px rgba($brand-navy, 0.35),
      0 0 0 1px rgba($primary, 0.08) inset;
  }
  &--photo &__quote {
    right: 46%;
    color: $brand-navy;
  }
  &--photo &__play {
    background: $primary;
    color: #fff;

    &::before {
      border-color: rgba($primary, 0.45);
    }
  }
  &--photo &__caption {
    max-width: 50%;
    color: $ink-muted;

    strong {
      color: $ink;
    }
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

// ── 2 · La oferta ─────────────────────────────────────────────────────────────
.offer {
  padding: 88px 0;
  background: $surface-dark;
  color: $ink-on-dark;

  &__title {
    font-size: clamp(1.8rem, 5vw, 2.8rem);
  }

  &__list {
    display: grid;
    gap: 0;
    margin: 36px 0 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 22px 0;
      border-bottom: 1px solid rgba($ink-on-dark, 0.12);
      font-family: $font-display;
      font-size: clamp(1.25rem, 3.2vw, 1.75rem);
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }
  }

  &__num {
    flex: none;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: $brand-gradient;
    color: $brand-navy;
    font-size: 1.1rem;
  }

  &__how {
    margin-top: 32px;
    color: $ink-on-dark-muted;
    font-size: 0.95rem;
  }
}

// ── 3 · Para quién es ─────────────────────────────────────────────────────────
.fit {
  padding: 88px 0;

  &__title {
    font-size: clamp(1.8rem, 5vw, 2.8rem);
  }

  &__sub {
    margin-top: 10px;
    color: $ink-muted;
    font-size: 1.05rem;
  }

  &__cols {
    display: grid;
    gap: 8px;
    margin-top: 32px;

    @media (min-width: 860px) {
      grid-template-columns: 1.3fr 1fr;
      gap: 48px;
    }
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 0;
      border-bottom: 1px solid $line;
    }

    i {
      flex: none;
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

    &--no {
      color: $ink-muted;

      i {
        background: $raised;
        color: $ink-muted;
      }
    }
  }
}

// ── 4 · Cierre ────────────────────────────────────────────────────────────────
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

  &__sign {
    margin: 16px 0 32px;
    color: $ink-on-dark-muted;
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
  .reveal {
    opacity: 1;
    transform: none;
  }
  .trace path {
    stroke-dashoffset: 0;
  }
  .cell,
  .vsl__play::before {
    animation: none;
  }
}
</style>
