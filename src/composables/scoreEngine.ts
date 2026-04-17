import type { QuizOption } from '@/types/question'
import type { Spirit }     from '@/types/spirit'
import type { QuizResult } from '@/types/result'
import spiritsRaw           from '@/data/spirits.json'
import questionsRaw         from '@/data/questions.json'

const spirits   = spiritsRaw   as unknown as Spirit[]
const questions = questionsRaw as unknown as Array<{ options: QuizOption[] }>

export function calcResult(selectedOptions: QuizOption[]): QuizResult {
  // ── Easter egg detection ─────────────────────────────────────────────────
  let jijiiyaCount  = 0
  let dengdengCount = 0

  for (const opt of selectedOptions) {
    if (opt.easterTag === 'jijiiya')   jijiiyaCount++
    if (opt.easterTag === 'dengdengya') dengdengCount++
  }

  // jijiiya >= 3 → enzo（孤傲阴郁路线），dengdengya >= 3 → abu（温和随缘路线）
  // 两者同时满足时 jijiiya 优先
  if (jijiiyaCount >= 3 || dengdengCount >= 3) {
    const eggId      = jijiiyaCount >= 3 ? 'enzo' : 'abu'
    const eggSpirit  = spirits.find(s => s.id === eggId)!
    const normalized = calcNormalizedScores(selectedOptions)
    const subSpirit  = pickTopN(normalized, spirits.filter(s => !s.isHidden), 1, [])[0]

    return {
      mainSpirit: eggSpirit,
      subSpirit,
      scores: normalized,
      isEasterEgg: true,
      timestamp: Date.now(),
    }
  }

  // ── Normal scoring ────────────────────────────────────────────────────────
  const normalized     = calcNormalizedScores(selectedOptions)
  const visibleSpirits = spirits.filter(s => !s.isHidden)
  const [main, sub]    = pickTopN(normalized, visibleSpirits, 2, [])

  return {
    mainSpirit: main,
    subSpirit:  sub,
    scores: normalized,
    isEasterEgg: false,
    timestamp: Date.now(),
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalize each spirit's score by the theoretical maximum it could have
 * received across the selected questions. This prevents spirits that appear
 * in many options from winning simply due to frequency.
 */
function calcNormalizedScores(selected: QuizOption[]): Record<string, number> {
  // Accumulate actual scores
  const actual: Record<string, number> = {}
  for (const opt of selected) {
    for (const [id, weight] of Object.entries(opt.weights)) {
      actual[id] = (actual[id] ?? 0) + weight
    }
  }

  // For each question answered, find the max weight any spirit could have got
  const maxPossible: Record<string, number> = {}
  for (const opt of selected) {
    // Find the question this option belongs to
    const question = questions.find(q => q.options.some(o => o.id === opt.id))
    if (!question) continue

    // The theoretical max for each spirit in this question is the highest
    // weight assigned to it across all options of that question
    for (const candidate of question.options) {
      for (const [id, weight] of Object.entries(candidate.weights)) {
        if ((maxPossible[id] ?? 0) < weight) {
          maxPossible[id] = weight
        }
      }
    }
  }

  // Normalize: score / max (capped at 1, defaulting to 0 if no max)
  const normalized: Record<string, number> = {}
  for (const id of Object.keys(actual)) {
    const max = maxPossible[id] ?? 1
    normalized[id] = actual[id] / max
  }
  return normalized
}

function pickTopN(
  scores: Record<string, number>,
  pool: Spirit[],
  n: number,
  exclude: string[],
): Spirit[] {
  return [...pool]
    .filter(s => !exclude.includes(s.id))
    .sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
    .slice(0, n)
}
