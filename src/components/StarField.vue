<script setup lang="ts">
import Particles               from '@tsparticles/vue3'
import { loadSlim }            from '@tsparticles/slim'
import type { Engine }         from '@tsparticles/engine'
import type { ISourceOptions } from '@tsparticles/engine'

async function particlesInit(engine: Engine) {
  await loadSlim(engine)
}

const options: ISourceOptions = {
  fullScreen: { enable: false },
  fpsLimit: 60,
  particles: {
    number: {
      value: 120,
      density: { enable: true },
    },
    color: {
      value: ['#ffffff', '#c8b8ff', '#ffd6fa', '#b8d8ff', '#ffe8b8'],
    },
    opacity: {
      value: { min: 0.2, max: 0.9 },
      animation: {
        enable: true,
        speed: 0.6,
        sync: false,
      },
    },
    size: {
      value: { min: 0.5, max: 2.5 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    move: {
      enable: true,
      speed: 0.3,
      direction: 'none',
      random: true,
      straight: false,
      outModes: 'out',
    },
    twinkle: {
      particles: {
        enable: true,
        frequency: 0.05,
        opacity: 1,
      },
    },
  },
  // Occasional shooting star lines
  emitters: {
    direction: 'bottom-right',
    rate: { quantity: 1, delay: 7 },
    size: { width: 0, height: 0 },
    position: { x: 0, y: 0 },
    particles: {
      color: { value: '#ffffff' },
      opacity: { value: 0.8 },
      size: { value: { min: 1, max: 2 } },
      move: {
        enable: true,
        speed: 15,
        direction: 'bottom-right',
        straight: true,
        outModes: 'destroy',
        trail: {
          enable: true,
          length: 20,
          fill: { color: '#ffffff' },
        },
      },
      life: { duration: { value: 1 }, count: 1 },
    },
  },
  detectRetina: true,
}
</script>

<template>
  <div class="star-field" aria-hidden="true">
    <Particles
      id="star-particles"
      :options="options"
      :particles-init="particlesInit"
      style="width: 100%; height: 100%;"
    />
  </div>
</template>

<style scoped>
.star-field {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>
