export type DashboardLocation = {
  id: number
  image: string
  title: string
  address: {
    street: string
    city: string
  }
  coords: {
    lat: number
    lng: number
  }
}

export type DashboardNewsItem = {
  id: number
  image: string
  description: string
  imageClassName?: string
}
