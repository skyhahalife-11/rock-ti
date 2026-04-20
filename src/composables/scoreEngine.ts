import type { QuizOption } from '@/types/question'
import type { Spirit }     from '@/types/spirit'
import type { QuizResult } from '@/types/result'
import spiritsRaw           from '@/data/spirits.json'

const spirits = spiritsRaw as unknown as Spirit[]

// 彩蛋触发阈值（分开设置，因为两类标签选项数量不同）
// jijiiya 共 11 个选项，需选中 8 个（73%）才触发恩佐
// dengdengya 共 14 个选项，需选中 10 个（71%）才触发阿布
const JIJIIYA_THRESHOLD  = 8
const DENGDENG_THRESHOLD = 10

export function calcResult(selectedOptions: QuizOption[]): QuizResult {
  // ── Easter egg detection ─────────────────────────────────────────────────
  let jijiiyaCount  = 0
  let dengdengCount = 0

  for (const opt of selectedOptions) {
    if (opt.easterTag === 'jijiiya')    jijiiyaCount++
    if (opt.easterTag === 'dengdengya') dengdengCount++
  }

  // jijiiya >= 6 → enzo，dengdengya >= 6 → abu；两者同时满足时 jijiiya 优先
  const votes = tallyVotes(selectedOptions)

  if (jijiiyaCount >= JIJIIYA_THRESHOLD || dengdengCount >= DENGDENG_THRESHOLD) {
    const eggId     = jijiiyaCount >= JIJIIYA_THRESHOLD ? 'enzo' : 'abu'
    const eggSpirit = spirits.find(s => s.id === eggId)!
    const subSpirit = pickTop(votes, spirits.filter(s => !s.isHidden), 1, [])[0]

    return {
      mainSpirit: eggSpirit,
      subSpirit,
      scores: votes,
      isEasterEgg: true,
      timestamp: Date.now(),
    }
  }

  // ── Vote-based scoring ────────────────────────────────────────────────────
  // weight=3 得 2 票（决定主灵魂），weight=2 得 1 票（决定副灵魂及平局）
  const visibleSpirits = spirits.filter(s => !s.isHidden)
  const [main, sub]    = pickTop(votes, visibleSpirits, 2, [])

  return {
    mainSpirit: main,
    subSpirit:  sub,
    scores: votes,
    isEasterEgg: false,
    timestamp: Date.now(),
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * 投票制计票：
 *   weight=3（主力精灵）→ 2 票
 *   weight=2（次要精灵）→ 1 票
 *   weight=1 不计票
 */
function tallyVotes(selected: QuizOption[]): Record<string, number> {
  const votes: Record<string, number> = {}
  for (const opt of selected) {
    for (const [id, weight] of Object.entries(opt.weights)) {
      if (weight === 3)      votes[id] = (votes[id] ?? 0) + 2
      else if (weight === 2) votes[id] = (votes[id] ?? 0) + 1
    }
  }
  return votes
}

function pickTop(
  votes: Record<string, number>,
  pool: Spirit[],
  n: number,
  exclude: string[],
): Spirit[] {
  return [...pool]
    .filter(s => !exclude.includes(s.id))
    .sort((a, b) => (votes[b.id] ?? 0) - (votes[a.id] ?? 0))
    .slice(0, n)
}
