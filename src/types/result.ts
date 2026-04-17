import type { Spirit } from './spirit'

export interface QuizResult {
  mainSpirit:  Spirit
  subSpirit:   Spirit
  scores:      Record<string, number>
  isEasterEgg: boolean
  timestamp:   number
}
