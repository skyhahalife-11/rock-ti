import type { QuizResult } from '@/types/result'
import type { QuizOption }  from '@/types/question'

const KEYS = {
  result:   'roco_ti_result',
  progress: 'roco_ti_progress',
} as const

interface ProgressSnapshot {
  currentIndex:    number
  selectedOptions: QuizOption[]
}

export function useStorage() {
  // ── Result ─────────────────────────────────────────────────────────────────
  function saveResult(result: QuizResult) {
    localStorage.setItem(KEYS.result, JSON.stringify(result))
  }

  function loadResult(): QuizResult | null {
    try {
      const raw = localStorage.getItem(KEYS.result)
      return raw ? (JSON.parse(raw) as QuizResult) : null
    } catch {
      return null
    }
  }

  function clearResult() {
    localStorage.removeItem(KEYS.result)
  }

  // ── Progress ───────────────────────────────────────────────────────────────
  function saveProgress(snap: ProgressSnapshot) {
    localStorage.setItem(KEYS.progress, JSON.stringify(snap))
  }

  function loadProgress(): ProgressSnapshot | null {
    try {
      const raw = localStorage.getItem(KEYS.progress)
      return raw ? (JSON.parse(raw) as ProgressSnapshot) : null
    } catch {
      return null
    }
  }

  function clearProgress() {
    localStorage.removeItem(KEYS.progress)
  }

  // ── Full reset ─────────────────────────────────────────────────────────────
  function clearAll() {
    clearResult()
    clearProgress()
  }

  return {
    saveResult,
    loadResult,
    clearResult,
    saveProgress,
    loadProgress,
    clearProgress,
    clearAll,
  }
}
