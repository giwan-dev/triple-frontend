import React from 'react'
import ExtendedResourceListElement, {
  ResourceListElementProps,
} from '@titicaca/resource-list-element'
import { useScrapsContext } from '@titicaca/react-contexts'

import { POI_IMAGE_PLACEHOLDERS } from './constants'
import { POIListElementBaseProps, PoiListElementType } from './types'

interface ExtendedPoiListElementBaseProps<T extends PoiListElementType>
  extends POIListElementBaseProps<T> {
  hideScrapButton?: boolean
  maxCommentLines?: number
  distance?: string | number
  distanceSuffix?: string
  isAdvertisement?: boolean
  notes?: (string | null | undefined)[]
  needOnlyVicinity?: boolean
}

export type ExtendedPoiListElementProps<
  T extends PoiListElementType
> = ExtendedPoiListElementBaseProps<T> &
  Partial<Pick<ResourceListElementProps<T>, 'as'>>

export function ExtendedPoiListElement<T extends PoiListElementType>({
  poi,
  poi: {
    id,
    type,
    nameOverride,
    scraped,
    reviewsCount: reviewsCountWithGraphql,
    scrapsCount: scrapsCountWithGraphql,
    reviewsRating: reviewsRatingWithGraphql,
    source: {
      names,
      image,
      areas = [],
      categories = [],
      comment,
      regionId,
      reviewsCount: rawReviewsCount,
      scrapsCount: rawScrapsCount,
      reviewsRating: rawReviewsRating,
      vicinity,
    },
    distance,
  },
  onClick,
  hideScrapButton,
  distance: distanceOverride,
  distanceSuffix,
  maxCommentLines,
  as,
  isAdvertisement,
  notes,
  optimized,
  needOnlyVicinity,
}: ExtendedPoiListElementProps<T> & { optimized?: boolean }) {
  const { deriveCurrentStateAndCount } = useScrapsContext()
  const {
    source: { starRating },
  } =
    type === 'hotel'
      ? poi
      : {
          source: { starRating: undefined },
        }
  const [area] = areas
  const [category] = categories

  const { scrapsCount } = deriveCurrentStateAndCount({
    id,
    scraped,
    scrapsCount: scrapsCountWithGraphql ?? rawScrapsCount,
  })
  const reviewsCount = Number((reviewsCountWithGraphql ?? rawReviewsCount) || 0)
  const note = (
    notes || [
      starRating ? `${starRating}성급` : category ? category.name : null,
      needOnlyVicinity ? vicinity : regionId ? area.name || vicinity : vicinity,
    ]
  )
    .filter((v) => v)
    .join(' · ')

  return (
    <ExtendedResourceListElement
      as={as}
      scraped={scraped}
      resource={poi}
      image={image}
      imagePlaceholder={POI_IMAGE_PLACEHOLDERS[type]}
      name={nameOverride || names.ko || names.en || names.local || undefined}
      comment={comment}
      distance={distanceOverride || distance}
      distanceSuffix={distanceSuffix}
      note={note}
      reviewsCount={reviewsCount}
      reviewsRating={reviewsRatingWithGraphql ?? rawReviewsRating}
      scrapsCount={scrapsCount}
      onClick={onClick}
      hideScrapButton={hideScrapButton}
      maxCommentLines={maxCommentLines}
      isAdvertisement={isAdvertisement}
      optimized={optimized}
    />
  )
}
