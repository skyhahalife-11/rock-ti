export interface SpiritTheme {
  primary:   string   // 主题色
  secondary: string   // 辅色
  bg:        string   // 卡片背景
  glow:      string   // 光晕色（rgba）
  text:      string   // 卡片文字色
}

export interface Spirit {
  id:          string
  name:        string
  element:     string
  archetype:   string
  tags:        string[]
  description: string
  shareText:   string
  isHidden:    boolean
  hiddenCondition?: string
  theme:       SpiritTheme
  sprite:      string   // /spirits/xxx.png
}
