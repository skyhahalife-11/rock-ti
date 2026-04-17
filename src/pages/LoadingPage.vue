<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter }      from 'vue-router'
import { useStorage }     from '@/composables/useStorage'

const router  = useRouter()
const storage = useStorage()

const phaseIndex = ref(0)
const visible    = ref(false)

const phases = [
  '正在感应你的精灵波长…',
  '比对 22 位精灵的灵魂频率…',
  '你的灵魂精灵正在靠近…',
]

onMounted(() => {
  if (!storage.loadResult()) { router.replace('/'); return }

  setTimeout(() => { visible.value = true }, 60)

  const timer = setInterval(() => {
    phaseIndex.value = (phaseIndex.value + 1) % phases.length
  }, 900)

  setTimeout(() => {
    clearInterval(timer)
    router.replace('/result')
  }, 2800)
})
</script>

<template>
  <div class="root">
    <div class="inner" :class="{ visible }">

      <!-- Orb -->
      <div class="orb-wrap">
        <div class="ring r1" />
        <div class="ring r2" />
        <div class="ring r3" />
        <div class="core" />
      </div>

      <!-- Text -->
      <div class="text-wrap">
        <Transition name="phase" mode="out-in">
          <p :key="phaseIndex" class="phase-text">{{ phases[phaseIndex] }}</p>
        </Transition>
      </div>

    </div>
  </div>
</template>

<style scoped>
.root {
  min-height: 100dvh;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.inner.visible { opacity: 1; transform: translateY(0); }

/* ── Orb ──────────────────────────────────────────────────────── */
.orb-wrap {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
  animation: breathe-ring 3s ease-in-out infinite;
}
.r1 {
  inset: 0;
  border-color: rgba(0, 0, 0, 0.08);
  animation-delay: 0s;
}
.r2 {
  inset: -16px;
  border-color: rgba(0, 0, 0, 0.05);
  animation-delay: 0.5s;
  animation-duration: 4s;
}
.r3 {
  inset: -32px;
  border-color: rgba(0, 0, 0, 0.03);
  animation-delay: 1s;
  animation-duration: 5s;
}

.core {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #000;
  animation: pulse-core 2s ease-in-out infinite;
}

/* ── Text ─────────────────────────────────────────────────────── */
.text-wrap {
  height: 24px;
  display: flex;
  align-items: center;
}

.phase-text {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--text-3);
  letter-spacing: 0.06em;
  margin: 0;
  white-space: nowrap;
}

/* ── Transitions ─────────────────────────────────────────────── */
.phase-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.phase-leave-active { transition: opacity 0.2s ease; }
.phase-enter-from   { opacity: 0; transform: translateY(6px); }
.phase-leave-to     { opacity: 0; }

/* ── Keyframes ───────────────────────────────────────────────── */
@keyframes breathe-ring {
  0%, 100% { transform: scale(1);    opacity: 0.6; }
  50%       { transform: scale(1.06); opacity: 1;   }
}
@keyframes pulse-core {
  0%, 100% { transform: scale(1);    opacity: 0.8; }
  50%       { transform: scale(1.1);  opacity: 1;   }
}
</style>
