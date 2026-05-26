export type ReceiptHistoryItem = {
  id: number
  title: string
  status: string
  statusClass: string
  date: string
  time: string
  location: string
  amount: string
  plate: string
  image: string
  washType: string
  station: string
  payment: string
  orderId: string
  summaryLabel: string
  summaryValue: string
}

export type ReceiptDetailFieldKey =
  | "washType"
  | "station"
  | "payment"
  | "orderId"

export type ReceiptDetailField = {
  name: string
  key: ReceiptDetailFieldKey
}

export type LatestSingleWashReceiptInput = {
  planName: string
  price: string
  plate: string
  payment: string
  location?: string
  station?: string
}
