import React, { useCallback } from 'react'
import { List } from '@titicaca/core-elements'
import { StaticIntersectionObserver as IntersectionObserver } from '@titicaca/intersection-observer'
import { PoiListElement } from '@titicaca/poi-list-elements'
import {
  useEventTrackingContext,
  useUserAgentContext,
} from '@titicaca/react-contexts'
import { ExternalLink } from '@titicaca/router'

import { ListingPOI } from './types'

export default function PoiEntry({
  index,
  poi,
  poi: {
    id,
    type,
    source: { regionId },
  },
  eventLabel,
  optimized,
}: {
  index: number
  poi: ListingPOI
  eventLabel: string
  optimized?: boolean
}) {
  const { trackEvent, trackSimpleEvent } = useEventTrackingContext()
  const { isPublic } = useUserAgentContext()

  const handleIntersectionChange = useCallback(
    ({ isIntersecting }: { isIntersecting: boolean }) => {
      if (isIntersecting) {
        trackEvent({
          fa: {
            action: '근처추천장소_POI노출',
            label: `${eventLabel}_${index + 1}_${id}`,
            item_id: id,
          },
        })
      }
    },
    [trackEvent, eventLabel, index, id],
  )

  return (
    <IntersectionObserver key={id} onChange={handleIntersectionChange}>
      <List.Item>
        <ExternalLink
          href={`/regions/${regionId}/${type}s/${id}`}
          target={isPublic ? 'current' : 'new'}
          allowSource="all"
          onClick={() => {
            trackSimpleEvent({
              action: '근처추천장소_POI선택',
              label: `${eventLabel}_${index + 1}_${id}`,
            })
          }}
        >
          <a>
            <PoiListElement as="div" poi={poi} optimized={optimized} />
          </a>
        </ExternalLink>
      </List.Item>
    </IntersectionObserver>
  )
}
