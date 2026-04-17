import { ref, computed }       from 'vue'
import { useRouter }            from 'vue-router'
import type { Question, QuizOption } from '@/types/question'
import { calcResult }           from './scoreEngine'
import { useStorage }           from './useStorage'
import questionsRaw             from '@/data/questions.json'

const questions = questionsRaw as unknown as Question[]

export function useQuiz() {
  const router  = useRouter()
  const storage = useStorage()

  // ── State ──────────────────────────────────────────────────────────────────
  const currentIndex   = ref(storage.loadProgress()?.currentIndex ?? 0)
  const selectedOptions = ref<QuizOption[]>(storage.loadProgress()?.selectedOptions ?? [])

  // ── Derived ────────────────────────────────────────────────────────────────
  const currentQuestion = computed(() => questions[currentIndex.value])
  const totalQuestions  = questions.length
  const progress        = computed(() => currentIndex.value / totalQuestions)
  const isLast          = computed(() => currentIndex.value === totalQuestions - 1)

  // ── Actions ────────────────────────────────────────────────────────────────
  function selectOption(option: QuizOption) {
    // Replace answer for current question (re-answering allowed)
    selectedOptions.value[currentIndex.value] = option
    storage.saveProgress({ currentIndex: currentIndex.value, selectedOptions: selectedOptions.value })
  }

  function next() {
    if (!selectedOptions.value[currentIndex.value]) return  // must answer first

    if (isLast.value) {
      finish()
    } else {
      currentIndex.value++
      storage.saveProgress({ currentIndex: currentIndex.value, selectedOptions: selectedOptions.value })
    }
  }

  function prev() {
    if (currentIndex.value > 0) {
      currentIndex.value--
      storage.saveProgress({ currentIndex: currentIndex.value, selectedOptions: selectedOptions.value })
    }
  }

  function finish() {
    const answeredOptions = selectedOptions.value.filter(Boolean)
    const result          = calcResult(answeredOptions)
    storage.saveResult(result)
    router.push('/loading')
  }

  function reset() {
    currentIndex.value    = 0
    selectedOptions.value = []
    storage.clearProgress()
  }

  return {
    questions,
    currentIndex,
    currentQuestion,
    selectedOptions,
    totalQuestions,
    progress,
    isLast,
    selectOption,
    next,
    prev,
    reset,
  }
}
