<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter }      from 'vue-router'

const router  = useRouter()
const visible = ref(false)
onMounted(() => setTimeout(() => { visible.value = true }, 80))

const rules = [
  { num: '01', title: '15 道题', desc: '每题选一个最符合直觉的答案，别过度分析' },
  { num: '02', title: '第一感觉', desc: '即兴的选择往往更能反映真实的你' },
  { num: '03', title: '隐藏精灵', desc: '特定的选择组合才能解锁 2 位神秘精灵' },
  { num: '04', title: '专属卡片', desc: '测完生成你的灵魂精灵卡，可保存分享给朋友' },
]
</script>

<template>
  <div class="root">
    <div class="inner" :class="{ visible }">

      <!-- Nav -->
      <nav class="nav">
        <button class="back" @click="router.back()">← 返回</button>
        <span class="nav-title">洛克王国 TI</span>
      </nav>

      <!-- Header -->
      <header class="header">
        <p class="label">Soul Spirit Quiz</p>
        <h1 class="heading display">测试说明</h1>
        <p class="desc">出发之前，先了解规则。</p>
      </header>

      <!-- Rules — DESIGN.md generous vertical spacing -->
      <div class="rules">
        <div
          v-for="(r, i) in rules" :key="i"
          class="rule card"
          :style="{ animationDelay: `${0.1 + i * 0.08}s` }"
        >
          <span class="rule-num display">{{ r.num }}</span>
          <div class="rule-body">
            <h3 class="rule-title">{{ r.title }}</h3>
            <p class="rule-desc">{{ r.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Lore block — warm stone section -->
      <div class="lore-block">
        <p class="lore">
          在洛克王国的世界里，每位训练师都有一位与灵魂深度共鸣的精灵伙伴。
          你的那位，就在 15 道题之后。
        </p>
      </div>

      <!-- CTA -->
      <div class="cta-area">
        <button class="btn-warm cta-btn" @click="router.push('/quiz')">
          出发探索 →
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.root {
  min-height: 100dvh;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  padding: 0 16px 64px;
}

.inner {
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.inner.visible { opacity: 1; transform: translateY(0); }

/* ── Nav — DESIGN.md sticky white header adapted ─────────────── */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-sub);
  position: sticky;
  top: 0;
  background: rgba(245,245,245,0.9);
  backdrop-filter: blur(12px);
  z-index: 10;
}
.back {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-3);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  padding: 0;
}
.back:hover { color: var(--text); }
.nav-title {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 13px;
  color: var(--text-3);
  letter-spacing: 0.08em;
}

/* ── Header ──────────────────────────────────────────────────── */
.header { padding-top: 8px; }
.label {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.22em;
  color: var(--text-3);
  text-transform: uppercase;
  margin-bottom: 12px;
}
/* DESIGN.md: Waldenburg 300 section heading, 36px */
.heading {
  font-size: clamp(36px, 8vw, 52px);
  letter-spacing: -0.02em;
  color: #000;
  margin: 0 0 16px;
}
.desc {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0.02em;
  color: var(--text-2);
}

/* ── Rules — DESIGN.md card style ───────────────────────────── */
.rules {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.rule {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px 24px;
  animation: fade-up 0.5s ease both;
}
.rule-num {
  font-size: 28px;
  color: rgba(0,0,0,0.08);
  flex-shrink: 0;
  line-height: 1;
  margin-top: 2px;
  letter-spacing: -0.04em;
}
.rule-body { flex: 1; }
.rule-title {
  font-family: 'Nunito', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #000;
  margin: 0 0 4px;
}
.rule-desc {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.7;
  letter-spacing: 0.01em;
  margin: 0;
}

/* ── Lore — warm stone block, DESIGN.md signature ────────────── */
.lore-block {
  background: var(--warm-stone);
  border-radius: 16px;
  padding: 24px 28px;
  box-shadow: rgba(78,50,23,0.04) 0px 6px 16px;
}
.lore {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 15px;
  line-height: 1.9;
  color: var(--text-2);
  letter-spacing: 0.02em;
  margin: 0;
}

/* ── CTA ─────────────────────────────────────────────────────── */
.cta-area { display: flex; }
.cta-btn {
  font-size: 16px;
  padding: 15px 32px 15px 26px;
  width: 100%;
  justify-content: center;
  border-radius: 30px;
}
</style>
