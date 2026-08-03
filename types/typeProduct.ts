export type Product = {
  id: string
  name: string
  image: string
  description: string
  price: number
  quantity?: number
  category: string
  weight: string
}

export type Steak = {
  id?: string
  title: string
  price: string
  img: string
  tag?: string
  desc: string
  weight: string
  grade?: string
  detail_images?: string[]
  movie?: string
  lineage?: string
  marbling?: string
}