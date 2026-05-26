export type SupportContactCard = {
  id: string
  title: string
  subtitle?: string
  description?: string
  actionLabel: string
  actionType: "call" | "message" | "urgent"
  href?: string
}

export type SupportFaqItem = {
  id: string
  question: string
  answer: string
}
