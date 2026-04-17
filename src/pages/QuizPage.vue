<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter }     from 'vue-router'
import { useQuiz }       from '@/composables/useQuiz'
import type { QuizOption } from '@/types/question'

const router = useRouter()
const {
  currentIndex,
  currentQuestion,
  selectedOptions,
  totalQuestions,
  isLast,
  selectOption,
  next,
  prev,
} = useQuiz()

const visible = ref(true)

const currentSelected = computed(() => selectedOptions.value[currentIndex.value])
const progressPct      = computed(() => ((currentIndex.value + 1) / totalQuestions) * 100)

function handleSelect(option: QuizOption) {
  selectOption(option)
}

async function handleNext() {
  if (!currentSelected.value) return
  await transit(() => next())
}

async function handlePrev() {
  if (currentIndex.value === 0) { router.push('/intro'); return }
  await transit(() => prev())
}

function transit(action: () => void) {
  visible.value = false
  return new Promise<void>(resolve =>
    setTimeout(() => { action(); visible.value = true; resolve() }, 180)
  )
}
</script>

<template>
  <div class="root">

    <!-- ── Sticky Nav ─────────────────────────────────────────── -->
    <nav class="nav">
      <button class="nav-back" @click="handlePrev">← 返回</button>
      <span class="nav-counter">
        {{ String(currentIndex + 1).padStart(2, '0') }}
        <span class="nav-total"> / {{ totalQuestions }}</span>
      </span>
      <div style="width: 56px" />
    </nav>

    <!-- ── Progress bar ──────────────────────────────────────── -->
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: progressPct + '%' }" />
    </div>

    <!-- ── Question + Options ────────────────────────────────── -->
    <div class="content" :class="{ visible }">

      <div class="question-area">
        <p class="q-num display">{{ String(currentIndex + 1).padStart(2, '0') }}</p>
        <h2 class="q-title">{{ currentQuestion.title }}</h2>
      </div>

      <div class="options">
        <button
          v-for="(opt, i) in currentQuestion.options"
          :key="opt.id"
          class="option card"
          :class="{ selected: currentSelected?.id === opt.id }"
          :style="{ animationDelay: `${i * 0.05}s` }"
          @click="handleSelect(opt)"
        >
          <span class="opt-text">{{ opt.text }}</span>
          <span class="opt-dot" :class="{ filled: currentSelected?.id === opt.id }" />
        </button>
      </div>

    </div>

    <!-- ── Bottom nav ─────────────────────────────────────────── -->
    <div class="bottom">
      <button
        class="btn-ghost"
        :disabled="currentIndex === 0"
        @click="handlePrev"
      >← 上一题</button>

      <button
        class="btn-warm btn-next"
        :disabled="!currentSelected"
        @click="handleNext"
      >{{ isLast ? '查看结果 →' : '下一题 →' }}</button>
    </div>

  </div>
</template>

<style scoped>
.root {
  min-height: 100dvh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Nav ─────────────────────────────────────────────────────── */
.nav {
  width: 100%;
  max-width: 560px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 16px;
  position: sticky;
  top: 0;
  background: rgba(245, 245, 245, 0.88);
  backdrop-filter: blur(14px);
  z-index: 10;
}

.nav-back {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-3);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
  width: 56px;
  text-align: left;
}
.nav-back:hover { color: var(--text); }

.nav-counter {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: 22px;
  color: #000;
  letter-spacing: -0.02em;
}
.nav-total {
  font-size: 16px;
  color: var(--text-3);
}

/* ── Progress ────────────────────────────────────────────────── */
.progress-track {
  width: 100%;
  height: 2px;
  background: var(--border);
  position: sticky;
  top: 57px;
  z-index: 10;
}
.progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Content ─────────────────────────────────────────────────── */
.content {
  width: 100%;
  max-width: 560px;
  padding: 32px 20px 140px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.content.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Question ────────────────────────────────────────────────── */
.question-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.q-num {
  font-size: clamp(52px, 14vw, 80px);
  color: rgba(0, 0, 0, 0.055);
  margin: 0;
  line-height: 1;
  letter-spacing: -0.04em;
}

.q-title {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: clamp(18px, 4.5vw, 22px);
  font-weight: 500;
  color: #000;
  line-height: 1.55;
  letter-spacing: 0.01em;
  margin: 0;
}

/* ── Options ─────────────────────────────────────────────────── */
.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 16px;
  text-align: left;
  cursor: pointer;
  border: 1.5px solid transparent;
  background: #ffffff;
  box-shadow:
    rgba(0,0,0,0.055) 0px 0px 0px 0.5px inset,
    rgba(0,0,0,0.05) 0px 0px 0px 1px,
    rgba(0,0,0,0.03) 0px 4px 8px;
  transition: border-color 0.18s ease, background 0.18s ease, transform 0.15s ease, box-shadow 0.18s ease;
  animation: fade-up 0.35s ease both;
}
.option:hover {
  transform: translateY(-2px);
  box-shadow:
    rgba(0,0,0,0.055) 0px 0px 0px 0.5px inset,
    rgba(0,0,0,0.07) 0px 0px 0px 1px,
    rgba(0,0,0,0.05) 0px 8px 20px;
}
.option:active { transform: scale(0.99); }

.option.selected {
  border-color: var(--accent);
  background: rgba(0, 168, 130, 0.04);
  box-shadow:
    rgba(0, 168, 130, 0.15) 0px 0px 0px 1px,
    rgba(0,0,0,0.03) 0px 4px 12px;
}

.opt-text {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: var(--text-2);
  line-height: 1.65;
  letter-spacing: 0.01em;
  flex: 1;
  transition: color 0.18s;
}
.option.selected .opt-text { color: #000; }

.opt-dot {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: transparent;
  transition: border-color 0.18s, background 0.18s;
}
.opt-dot.filled {
  border-color: var(--accent);
  background: var(--accent);
}

/* ── Bottom nav ──────────────────────────────────────────────── */
.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px 32px;
  background: rgba(245, 245, 245, 0.92);
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--border-sub);
  z-index: 20;
}

.btn-ghost {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-3);
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px 0;
  transition: color 0.15s;
}
.btn-ghost:hover:not(:disabled) { color: var(--text); }
.btn-ghost:disabled { opacity: 0.3; cursor: default; }

.btn-next {
  font-size: 15px;
  padding: 13px 28px;
  border-radius: 30px;
  transition: opacity 0.2s ease, transform 0.15s ease;
}
.btn-next:disabled {
  opacity: 0.35;
  cursor: default;
  transform: none !important;
}
</style>
