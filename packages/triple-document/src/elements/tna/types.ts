import { TagColors } from '@titicaca/core-elements'
import { HttpResponse } from '@titicaca/fetcher'

type Price = string | number
export type ProductsFetcher = (
  slotId?: number,
) => Promise<HttpResponse<TNAProductsResponse>>

export interface TNAProductsResponse {
  products: TNAProductData[]
  title: string
}

interface DomesticArea {
  displayName: string
  id: string
  name: string
  representative: boolean
}

export interface DiscountPolicy {
  maxDiscountAmount: number
  type: 'RATE' | 'AMOUNT'
  value: number
}

export interface TnaCoupon {
  amountAfterUsingCoupon: number
  amountBeforeUsingCoupon: number
  description: string
  discountAmount: number
  discountPolicy: DiscountPolicy
  downloaded: boolean
  id: string
  name: string
}

export interface TNAProductData {
  id: number | string
  heroImage?: string
  title?: string
  tags?: { text: string; type: TagColors; style: React.CSSProperties }[]
  salePrice?: Price
  basePrice?: Price
  reviewRating: number
  reviewsCount: number
  domesticAreas: DomesticArea[]
  applicableCoupon?: TnaCoupon
  expectedApplicableCoupon?: TnaCoupon
}
