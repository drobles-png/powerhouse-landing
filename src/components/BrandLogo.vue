<script setup lang="ts">
import logo from '@/assets/logos/phb-logo.webp'
import { BRAND_NAME } from '@/config/funnel'

defineProps<{ light?: boolean }>()
</script>

<template>
  <span class="logo" :class="{ 'logo--light': light }">
    <img :src="logo" :alt="BRAND_NAME" width="600" height="450" />
  </span>
</template>

<style scoped lang="scss">
.logo {
  display: inline-flex;
  align-items: center;

  img {
    width: auto;
    height: 46px;
  }

  // Sobre fondo oscuro el logo va en una placa blanca (el PNG tiene letras índigo)
  &--light {
    padding: 8px 12px;
    border-radius: $radius-md;
    background: $raised;
  }
}
</style>
