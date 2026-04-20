<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter }                from 'vue-router'
import { toPng }                    from 'html-to-image'
import { useStorage }               from '@/composables/useStorage'
import type { QuizResult }          from '@/types/result'

const router  = useRouter()
const storage = useStorage()

const result     = ref<QuizResult | null>(null)
const visible    = ref(false)
const cardRef    = ref<HTMLElement | null>(null)
const downloading = ref(false)
const fontWarmed  = ref(false)
const previewUrl  = ref('')

onMounted(() => {
  const r = storage.loadResult()
  if (!r) { router.replace('/'); return }
  result.value = r
  setTimeout(async () => {
    visible.value = true
    await nextTick()
    if (cardRef.value) {
      toPng(cardRef.value, { pixelRatio: 1 }).then(() => { fontWarmed.value = true }).catch(() => {})
    }
  }, 80)
})

const main       = computed(() => result.value?.mainSpirit)
const sub        = computed(() => result.value?.subSpirit)
const isEasterEgg = computed(() => result.value?.isEasterEgg)

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
  const fallback = img.nextElementSibling as HTMLElement
  if (fallback) fallback.style.display = 'flex'
}

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

async function downloadCard() {
  if (!cardRef.value || downloading.value) return
  downloading.value = true
  try {
    // 预先把精灵图转成 base64，避免手机端截图时图片来不及加载
    const spiritImg = cardRef.value.querySelector('.spirit-img') as HTMLImageElement | null
    let originalSrc = ''
    if (spiritImg?.src) {
      originalSrc = spiritImg.src
      try {
        const resp = await fetch(spiritImg.src)
        const blob = await resp.blob()
        spiritImg.src = await blobToDataUrl(blob)
      } catch { /* 预加载失败时沿用原路径 */ }
    }

    const pixelRatio = isMobile ? 1.5 : 2
    // 第一次调用让库加载字体等资源，第二次拿到正确截图
    await toPng(cardRef.value, { pixelRatio })
    const dataUrl = await toPng(cardRef.value, { pixelRatio })

    // 还原图片 src
    if (spiritImg && originalSrc) spiritImg.src = originalSrc

    if (isMobile) {
      // 手机端：展示全屏预览浮层，用户长按图片保存（iOS/Android 全平台通吃）
      previewUrl.value = dataUrl
      return
    } else {
      const link = document.createElement('a')
      link.download = `灵魂精灵-${main.value?.name ?? 'result'}.png`
      link.href = dataUrl
      link.click()
    }
  } catch (err) {
    console.error(err)
  } finally {
    downloading.value = false
  }
}

function restart() {
  storage.clearAll()
  router.push('/')
}
</script>

<template>
  <div class="root" v-if="result">
    <div class="inner" :class="{ visible }">

      <!-- ── Nav ───────────────────────────────────────────────── -->
      <nav class="nav">
        <button class="nav-back" @click="restart">← 重新测试</button>
        <span class="nav-title">洛克王国 TI</span>
        <div style="width: 80px" />
      </nav>

      <!-- ── Header ────────────────────────────────────────────── -->
      <header class="header">
        <p class="label">Soul Spirit Quiz</p>
        <h1 class="heading display">你的灵魂精灵</h1>
        <p class="desc" v-if="isEasterEgg">✦ 隐藏彩蛋解锁</p>
        <p class="desc" v-else>你的灵魂，找到它的伙伴了。</p>
      </header>

      <!-- ── Result Card ────────────────────────────────────────── -->
      <div ref="cardRef" class="result-card card">

        <!-- Accent bar -->
        <div class="accent-bar" :style="{ background: main?.theme.primary }" />

        <!-- Spirit image -->
        <div class="spirit-visual">
          <img
            v-if="main?.sprite"
            :src="main.sprite"
            :alt="main.name"
            class="spirit-img"
            @error="onImgError"
          />
          <div
            class="spirit-fallback"
            :style="{ background: main?.theme.primary + '18', color: main?.theme.primary }"
          >{{ main?.name?.slice(0, 1) }}</div>
        </div>

        <!-- Identity -->
        <div class="identity">
          <p class="element-label" :style="{ color: main?.theme.primary }">
            {{ main?.element }}
          </p>
          <h2 class="spirit-name display">{{ main?.name }}</h2>
          <p class="archetype">{{ main?.archetype }}</p>
        </div>

        <!-- Tags -->
        <div class="tags">
          <span
            v-for="tag in main?.tags" :key="tag"
            class="tag"
            :style="{ color: main?.theme.primary, borderColor: main?.theme.primary + '40' }"
          >{{ tag }}</span>
        </div>

        <!-- Divider -->
        <div class="divider" />

        <!-- Description -->
        <p class="desc-text">{{ main?.description }}</p>

        <!-- Sub spirit -->
        <div class="sub-row" v-if="sub">
          <span class="sub-label">副灵魂精灵</span>
          <span class="sub-name">{{ sub.name }}</span>
          <span class="sub-elem" :style="{ color: sub.theme.primary }">{{ sub.element }}</span>
        </div>

        <!-- Watermark -->
        <p class="watermark">洛克王国 · 灵魂精灵测试</p>

      </div>

      <!-- ── Actions ────────────────────────────────────────────── -->
      <div class="actions">
        <button class="btn-warm btn-save" @click="downloadCard" :disabled="downloading">
          {{ downloading ? '生成中…' : (isMobile ? '分享 / 保存卡片' : '↓ 保存卡片') }}
        </button>
        <button class="btn-white" @click="restart">重新测试</button>
      </div>

      <!-- ── Share lore ─────────────────────────────────────────── -->
      <div class="lore-block">
        <p class="lore-text">{{ main?.shareText }}</p>
      </div>

    </div>
  </div>

      <!-- ── 手机长按保存浮层 ────────────────────────────────────────────── -->
      <Teleport to="body">
        <div v-if="previewUrl" class="preview-mask" @click.self="previewUrl = ''">
          <div class="preview-box">
            <p class="preview-hint">长按图片保存到相册</p>
            <img :src="previewUrl" class="preview-img" alt="结果卡片" />
            <button class="preview-close" @click="previewUrl = ''">关闭</button>
          </div>
        </div>
      </Teleport>
</template>

<style scoped>
.root {
  min-height: 100dvh;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  padding: 0 16px 80px;
}

.inner {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.inner.visible { opacity: 1; transform: translateY(0); }

/* ── Nav ─────────────────────────────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0 16px;
  border-bottom: 1px solid var(--border-sub);
  position: sticky;
  top: 0;
  background: rgba(245,245,245,0.9);
  backdrop-filter: blur(12px);
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
  width: 80px;
  text-align: left;
}
.nav-back:hover { color: var(--text); }

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
  margin: 0 0 12px;
}

.heading {
  font-size: clamp(36px, 9vw, 52px);
  letter-spacing: -0.02em;
  color: #000;
  margin: 0 0 10px;
}

.desc {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 16px;
  color: var(--text-2);
  line-height: 1.6;
  margin: 0;
  letter-spacing: 0.02em;
}

/* ── Result Card ─────────────────────────────────────────────── */
.result-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  padding: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Thin color bar at top — spirit accent, only color element */
.accent-bar {
  height: 3px;
  width: 100%;
  flex-shrink: 0;
}

/* ── Spirit image ────────────────────────────────────────────── */
.spirit-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 0 16px;
  position: relative;
}

.spirit-img {
  width: 140px;
  height: 140px;
  object-fit: contain;
  mix-blend-mode: multiply;
  animation: float 5s ease-in-out infinite;
}

.spirit-fallback {
  display: none;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 48px;
  font-weight: 300;
}

/* ── Identity ────────────────────────────────────────────────── */
.identity {
  padding: 0 28px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.element-label {
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 0;
}

.spirit-name {
  font-size: clamp(40px, 10vw, 52px);
  color: #000;
  margin: 0;
  letter-spacing: -0.025em;
}

.archetype {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--text-2);
  letter-spacing: 0.04em;
  margin: 0;
}

/* ── Tags ────────────────────────────────────────────────────── */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 28px 0;
  justify-content: center;
}

.tag {
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  border: 1px solid;
  border-radius: 20px;
  padding: 4px 12px;
}

/* ── Divider ─────────────────────────────────────────────────── */
.divider {
  height: 1px;
  background: var(--border);
  margin: 20px 28px 0;
}

/* ── Description ─────────────────────────────────────────────── */
.desc-text {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 14px;
  line-height: 1.85;
  color: var(--text-2);
  letter-spacing: 0.02em;
  padding: 16px 28px 0;
  margin: 0;
}

/* ── Sub spirit ──────────────────────────────────────────────── */
.sub-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 28px 0;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.sub-label {
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--text-3);
}

.sub-name {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-2);
}

.sub-elem {
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  margin-left: auto;
}

/* ── Watermark ───────────────────────────────────────────────── */
.watermark {
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-align: center;
  color: var(--text-3);
  margin: 16px 0 0;
  opacity: 0.5;
}

/* ── Actions ─────────────────────────────────────────────────── */
.actions {
  display: flex;
  gap: 10px;
}

.btn-save {
  flex: 1;
  font-size: 15px;
  padding: 14px 20px;
  border-radius: 30px;
  justify-content: center;
}
.btn-save:disabled { opacity: 0.4; cursor: default; }

/* ── Lore block — matches IntroPage lore-block exactly ──────── */
.lore-block {
  background: var(--warm-stone);
  border-radius: 16px;
  padding: 24px 28px;
  box-shadow: rgba(78,50,23,0.04) 0px 6px 16px;
}

.lore-text {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 15px;
  line-height: 1.9;
  color: var(--text-2);
  letter-spacing: 0.02em;
  margin: 0;
}

/* ── 手机长按保存浮层 ──────────────────────────────────────────────────── */
.preview-mask {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.92);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(12px);
}

.preview-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 380px;
}

.preview-hint {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 15px;
  color: var(--text-2);
  letter-spacing: 0.06em;
  margin: 0;
  text-align: center;
}

.preview-img {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
  display: block;
  -webkit-user-select: none;
  user-select: none;
}

.preview-close {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-3);
  background: none;
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 8px 28px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.preview-close:hover { color: var(--text); border-color: var(--text-3); }

</style>
