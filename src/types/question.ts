export interface OptionWeights {
  [spiritId: string]: number
}

export interface QuizOption {
  id:         string
  text:       string
  weights:    OptionWeights
  easterTag?: 'jijiiya' | 'dengdengya'
}

export interface Question {
  id:      string
  title:   string
  options: QuizOption[]
}
