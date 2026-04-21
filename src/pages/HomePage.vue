<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter }      from 'vue-router'
import { useStorage }     from '@/composables/useStorage'

const router  = useRouter()
const storage = useStorage()
const visible = ref(true)

const hasProgress = !!storage.loadProgress()?.selectedOptions?.length
const hasResult   = !!storage.loadResult()

function startQuiz() {
  storage.clearAll()
  router.push('/intro')
}

const base = import.meta.env.BASE_URL
const spirits = [
  { name: '提莫',    element: '光系', img: `${base}spirits/timo.webp`,       color: '#f0b820', delay: '0.15s' },
  { name: '水蓝蓝',  element: '水系', img: `${base}spirits/shuilanlan.webp`, color: '#4a9eff', delay: '0.3s'  },
  { name: '独角兽',  element: '翼系', img: `${base}spirits/dujiaoshou.webp`, color: '#9b70d8', delay: '0.45s' },
  { name: '帕尔萨斯', element: '恶魔系', img: `${base}spirits/paersasi.webp`, color: '#9e2060', delay: '0s'  },
]

</script>

<template>
  <div class="root">

    <!-- ── Hero ──────────────────────────────────────────────── -->
    <section class="hero" :class="{ visible }">

      <!-- Label -->
      <p class="label">洛克王国：世界</p>

      <!-- Main heading — Cormorant 300, whisper-thin -->
      <h1 class="heading display">
        测测你的<br>灵魂精灵
      </h1>

      <!-- Sub -->
      <p class="sub">22 位精灵，谁与你的灵魂最契合？</p>

      <!-- CTA row — DESIGN.md warm stone signature -->
      <div class="cta-row">
        <button class="btn-warm cta-main" @click="startQuiz">
          <span class="cta-icon">◈</span>
          开始测试
        </button>
        <button v-if="hasProgress" class="btn-white" @click="router.push('/quiz')">继续上次</button>
        <button v-if="hasResult"   class="btn-white" @click="router.push('/result')">查看结果</button>
      </div>

      <p class="meta">共 15 题 · 约 3 分钟</p>
    </section>

    <!-- ── Visual — spirit orb, Apple product-shot style ─────── -->
    <section class="visual" :class="{ visible }">
      <div class="orb-wrap">
        <!-- Halo rings -->
        <div class="halo h1" />
        <div class="halo h2" />
        <div class="halo h3" />
        <!-- Core sphere -->
        <img :src="`${base}prism-ball.png`" class="sphere" alt="棱镜球" />
        <!-- Orbit ring -->
        <div class="orbit" />
      </div>
    </section>

    <!-- ── Spirit preview strip ──────────────────────────────── -->
    <section class="spirit-strip" :class="{ visible }">
      <p class="strip-label">部分精灵预览</p>
      <div class="strip-row">
        <div
          v-for="s in spirits" :key="s.name"
          class="spirit-card"
          :style="{ '--c': s.color, animationDelay: s.delay }"
        >
          <div class="spirit-img-wrap">
            <img :src="s.img" :alt="s.name" class="spirit-img" />
          </div>
          <p class="spirit-name">{{ s.name }}</p>
          <p class="spirit-elem">{{ s.element }}</p>
        </div>

        <!-- Mystery cards -->
        <div v-for="i in 2" :key="`m${i}`" class="spirit-card mystery">
          <div class="spirit-img-wrap">
            <span class="mystery-glyph">?</span>
          </div>
          <p class="spirit-name" style="color: var(--text-3)">未知精灵</p>
          <p class="spirit-elem">待解锁</p>
        </div>
      </div>
    </section>

    <!-- ── Stat strip ─────────────────────────────────────────── -->
    <section class="stats" :class="{ visible }">
      <div class="stat">
        <span class="stat-num display">22</span>
        <span class="stat-label">位精灵</span>
      </div>
      <div class="stat-divider" />
      <div class="stat">
        <span class="stat-num display">2</span>
        <span class="stat-label">隐藏彩蛋</span>
      </div>
      <div class="stat-divider" />
      <div class="stat">
        <span class="stat-num display">15</span>
        <span class="stat-label">道题目</span>
      </div>
    </section>

  </div>
</template>

<style scoped>
.root {
  min-height: 100dvh;
  background: #fafaf8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px 64px;
  gap: 72px;
}

/* ── Hero ────────────────────────────────────────────────────── */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 1s ease, transform 1s ease;
}
.hero.visible { opacity: 1; transform: translateY(0); }

.label {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.22em;
  color: var(--text-3);
  text-transform: uppercase;
}

/* DESIGN.md hero: Waldenburg 300, 48px, lh 1.08, ls -0.96px */
.heading {
  font-size: clamp(48px, 11vw, 88px);
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: #000000;
  margin: 0;
}

.sub {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0.02em;
  color: var(--text-2);
  max-width: 320px;
}

/* DESIGN.md warm stone CTA */
.cta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.cta-main {
  font-size: 16px;
  padding: 14px 28px 14px 22px;
}
.cta-icon {
  margin-right: 8px;
  color: var(--accent);
  font-size: 14px;
}

.meta {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 13px;
  color: var(--text-3);
  letter-spacing: 0.04em;
}

/* ── Visual ──────────────────────────────────────────────────── */
.visual {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 1s ease 0.2s, transform 1s ease 0.2s;
}
.visual.visible { opacity: 1; transform: translateY(0); }

.orb-wrap {
  position: relative;
  width: 260px;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Halos — sub-0.1 opacity, DESIGN.md shadow philosophy */
.halo {
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
  animation: breathe 4s ease-in-out infinite;
}
.h1 {
  inset: 0;
  border-color: rgba(140,180,255,0.15);
  animation-delay: 0s;
}
.h2 {
  inset: -20px;
  border-color: rgba(180,140,255,0.09);
  animation-delay: 0.6s;
  animation-duration: 5s;
}
.h3 {
  inset: -40px;
  border-color: rgba(120,220,200,0.06);
  animation-delay: 1.2s;
  animation-duration: 6s;
}

/* Sphere — Apple product jewel */
.sphere {
  width: 150px;
  height: 150px;
  object-fit: contain;
  animation: float 5s ease-in-out infinite;
  filter: drop-shadow(0 16px 32px rgba(120,180,255,0.3)) drop-shadow(0 0 20px rgba(180,140,255,0.15));
  position: relative;
  z-index: 2;
}

/* Orbit */
.orbit {
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  border: 1px dashed rgba(0,168,130,0.15);
  animation: spin-slow 16s linear infinite;
}

/* Spirit chips — white pill, DESIGN.md card shadow */
.chip {
  position: absolute;
  padding: 6px 14px;
  border-radius: 9999px;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #000;
  background: rgba(255,255,255,0.92);
  box-shadow: rgba(0,0,0,0.4) 0px 0px 1px, rgba(0,0,0,0.05) 0px 4px 12px;
  animation: float 4s ease-in-out infinite;
  backdrop-filter: blur(8px);
  white-space: nowrap;
}
.c1 { top: 8%;   left: -10%;  animation-delay: 0s;    }
.c2 { top: 15%;  right: -12%; animation-delay: 0.7s;  }
.c3 { bottom: 10%; left: -14%; animation-delay: 1.3s; }
.c4 { bottom: 18%; right: -8%; animation-delay: 0.4s; }

/* ── Spirit strip ────────────────────────────────────────────── */
.spirit-strip {
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  opacity: 0;
  transition: opacity 1s ease 0.3s;
}
.spirit-strip.visible { opacity: 1; }

.strip-label {
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  color: var(--text-3);
  text-transform: uppercase;
}

.strip-row {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
  width: 100%;
  justify-content: center;
}
.strip-row::-webkit-scrollbar { display: none; }

.spirit-card {
  flex-shrink: 0;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px 14px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow:
    rgba(0,0,0,0.075) 0px 0px 0px 0.5px inset,
    rgba(0,0,0,0.06) 0px 0px 0px 1px,
    rgba(0,0,0,0.04) 0px 4px 12px;
  animation: fade-up 0.5s ease both;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.spirit-card:hover {
  transform: translateY(-4px);
  box-shadow:
    rgba(0,0,0,0.075) 0px 0px 0px 0.5px inset,
    color-mix(in srgb, var(--c) 30%, transparent) 0px 0px 0px 1px,
    rgba(0,0,0,0.06) 0px 8px 24px;
}
.spirit-card.mystery { background: #f9f9f7; }

.spirit-img-wrap {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.spirit-img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  mix-blend-mode: multiply;
  transition: transform 0.3s ease;
}
.spirit-card:hover .spirit-img { transform: scale(1.08); }

.mystery-glyph {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: 36px;
  color: var(--border);
}

.spirit-name {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #000;
  margin: 0;
}
.spirit-elem {
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--c, var(--text-3));
  margin: 0;
  letter-spacing: 0.04em;
}

/* ── Stats ───────────────────────────────────────────────────── */
.stats {
  display: flex;
  align-items: center;
  gap: 32px;
  opacity: 0;
  transition: opacity 1s ease 0.4s;
}
.stats.visible { opacity: 1; }

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.stat-num {
  font-size: 36px;
  color: #000;
  letter-spacing: -0.03em;
}
.stat-label {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 12px;
  color: var(--text-3);
  letter-spacing: 0.06em;
}
.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--border);
}
</style>
