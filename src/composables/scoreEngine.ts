import type { QuizOption } from '@/types/question'
import type { Spirit }     from '@/types/spirit'
import type { QuizResult } from '@/types/result'
import spiritsRaw           from '@/data/spirits.json'
import questionsRaw         from '@/data/questions.json'

const spirits   = spiritsRaw as unknown as Spirit[]
const questions = questionsRaw as unknown as { options: QuizOption[] }[]

// 彩蛋触发阈值（分开设置，因为两类标签选项数量不同）
// jijiiya 共 11 个选项，需选中 8 个（73%）才触发恩佐
// dengdengya 共 14 个选项，需选中 10 个（71%）才触发阿布
const JIJIIYA_THRESHOLD  = 8
const DENGDENG_THRESHOLD = 10

// 每个精灵拥有的 weight=3 题目总数（用于归一化，消除题数不等带来的概率偏差）
const maxVotes: Record<string, number> = {}
for (const q of questions)
  for (const opt of q.options)
    for (const [id, w] of Object.entries(opt.weights as Record<string, number>))
      if (w === 3) maxVotes[id] = (maxVotes[id] ?? 0) + 1

export function calcResult(selectedOptions: QuizOption[]): QuizResult {
  // ── Easter egg detection ─────────────────────────────────────────────────
  let jijiiyaCount  = 0
  let dengdengCount = 0

  for (const opt of selectedOptions) {
    if (opt.easterTag === 'jijiiya')    jijiiyaCount++
    if (opt.easterTag === 'dengdengya') dengdengCount++
  }

  // jijiiya >= 6 → enzo，dengdengya >= 6 → abu；两者同时满足时 jijiiya 优先
  const primaryVotes   = tallyVotes(selectedOptions)
  const secondaryVotes = tallySecondary(selectedOptions)

  if (jijiiyaCount >= JIJIIYA_THRESHOLD || dengdengCount >= DENGDENG_THRESHOLD) {
    const eggId     = jijiiyaCount >= JIJIIYA_THRESHOLD ? 'enzo' : 'abu'
    const eggSpirit = spirits.find(s => s.id === eggId)!
    const subSpirit = pickTop(secondaryVotes, spirits.filter(s => !s.isHidden), 1, [])[0]

    return {
      mainSpirit: eggSpirit,
      subSpirit,
      scores: primaryVotes,
      isEasterEgg: true,
      timestamp: Date.now(),
    }
  }

  // ── Vote-based scoring ────────────────────────────────────────────────────
  // 主精灵：归一化得分最高者（得票 ÷ 该精灵 weight=3 题总数）
  // 归一化消除题数不等带来的概率偏差（水蓝蓝/火花/酷拉各有 4 道，其余 3 道）
  // 平局时随机选，保证出场概率均等
  // 副精灵：次要票最多（排除主精灵后）
  const visibleSpirits = spirits.filter(s => !s.isHidden)
  const topScore       = Math.max(...visibleSpirits.map(s => (primaryVotes[s.id] ?? 0) / (maxVotes[s.id] ?? 1)))
  const tied           = visibleSpirits.filter(s => (primaryVotes[s.id] ?? 0) / (maxVotes[s.id] ?? 1) === topScore)
  const main           = tied[Math.floor(Math.random() * tied.length)]
  const sub            = pickTop(secondaryVotes, visibleSpirits, 1, [main.id])[0]

  return {
    mainSpirit: main,
    subSpirit:  sub,
    scores: primaryVotes,
    isEasterEgg: false,
    timestamp: Date.now(),
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * 主精灵投票：只计 weight=3 的主力票（每题 1 票）
 * 保证 19 只可见精灵出场概率接近均等（各有 3~4 道主力题）
 */
function tallyVotes(selected: QuizOption[]): Record<string, number> {
  const votes: Record<string, number> = {}
  for (const opt of selected) {
    for (const [id, weight] of Object.entries(opt.weights)) {
      if (weight === 3) votes[id] = (votes[id] ?? 0) + 1
    }
  }
  return votes
}

/**
 * 副精灵投票：只计 weight=2 的次要票，用于选出副灵魂精灵
 */
function tallySecondary(selected: QuizOption[]): Record<string, number> {
  const votes: Record<string, number> = {}
  for (const opt of selected) {
    for (const [id, weight] of Object.entries(opt.weights)) {
      if (weight === 2) votes[id] = (votes[id] ?? 0) + 1
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
