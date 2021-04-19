import { SyntheticEvent } from 'react'
import { TranslatedProperty, ImageMeta } from '@titicaca/type-definitions'

export interface RegionData {
  id: string
  type: string
  nameOverride: string | null
  source: {
    id: string
    names: TranslatedProperty
    style?: {
      backgroundImageUrl: string
    }
  }
}

export interface TripleElementData<T = string, Value = unknown> {
  type: T
  value: Value
}

export type ImageEventHandler = (e: SyntheticEvent, image: ImageMeta) => void

export type Link = {
  href?: string
  label?: string
  level?: string
}

export type LinkEventHandler = (e: React.SyntheticEvent, link: Link) => void

export interface ElementSet {
  [type: string]: React.ComponentType<any>
}
