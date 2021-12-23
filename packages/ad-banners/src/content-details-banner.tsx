import React, { useState, useEffect } from 'react'
import { MarginPadding } from '@titicaca/core-elements'
import {
  useDeviceContext,
  useEventTrackingContext,
} from '@titicaca/react-contexts'

import {
  ContentType,
  postAdBannerEvent,
  getAdBanners,
  BannerTypes,
} from './api'
import { Banner } from './typing'
import VerticalListView from './vertical-list-view'

declare global {
  interface Window {
    requestIdleCallback?(callback: () => void, timeout?: number): number
    cancelIdleCallback?(handle: number): void
  }
}

interface EventAttributes {
  title?: string
}

/**
 * 트리플 광고 API를 사용하는 배너의 Props
 */
interface AdSystemBannerProps {
  contentType: ContentType
  contentRegionId: string
  contentId?: string
  eventAttributes?: EventAttributes
}

/**
 * Inventory API를 사용하는 배너의 Props
 */
interface InventoryBannerProps {
  onBannersFetch: () => Promise<Banner[]>
  onBannerIntersect?: (
    isIntersecting: boolean,
    banner: Banner,
    index: number,
  ) => void
  onBannerClick?: (banner: Banner, index: number) => void
}

type AdBannersProps = {
  margin?: MarginPadding
  padding?: MarginPadding
} & (AdSystemBannerProps | InventoryBannerProps)

const NOOP = () => {}

function isPropsForInventoryAPI(
  props: AdBannersProps,
): props is InventoryBannerProps {
  return 'onBannersFetch' in props
}

function useAdBannerProps(props: AdBannersProps) {
  const { latitude, longitude } = useDeviceContext()
  const { trackEvent } = useEventTrackingContext()

  if (isPropsForInventoryAPI(props)) {
    const { onBannersFetch, onBannerIntersect, onBannerClick } = props

    return {
      getBannersAPI: onBannersFetch,
      handleBannerIntersecting: onBannerIntersect || NOOP,
      handleBannerClick: (banner: Banner, index: number) => {
        if (onBannerClick) {
          onBannerClick(banner, index)
        }
      },
    }
  } else {
    const {
      contentType,
      contentId,
      contentRegionId,
      eventAttributes: { title } = { title: undefined },
    } = props

    return {
      getBannersAPI: () =>
        getAdBanners({
          contentType,
          regionId: contentRegionId,
          contentId,
          userLocation: { longitude, latitude },
          bannerType: BannerTypes.ContentDetailsBanner,
        }),
      handleBannerIntersecting: (
        isIntersecting: boolean,
        banner: Banner,
        index: number,
      ) => {
        if (!isIntersecting) {
          return
        }

        postAdBannerEvent({
          itemId: banner.id,
          eventType: 'impression',
          bannerType: BannerTypes.ContentDetailsBanner,
          contentId,
          regionId: contentRegionId,
          contentType,
          userLocation: { longitude, latitude },
        })

        trackEvent({
          fa: {
            action: 'V0_배너노출',
            banner_id: banner.id,
            banner_position: index,
            url: banner.target,
            poi_id: contentId,
          },
        })
      },
      handleBannerClick: (banner: Banner, index: number) => {
        postAdBannerEvent({
          itemId: banner.id,
          eventType: 'click',
          bannerType: BannerTypes.ContentDetailsBanner,
          contentId,
          regionId: contentRegionId,
          contentType,
          userLocation: { longitude, latitude },
        })

        trackEvent({
          fa: {
            action: 'V0_배너선택',
            banner_id: banner.id,
            banner_position: index,
            url: banner.target,
            poi_id: contentId,
          },
          ga: [
            'V0_배너선택',
            `${title}_${contentId}_${banner.id}_${banner.desc}_${banner.target}`,
          ],
        })
      },
    }
  }
}

export default function ContentDetailsBanner(props: AdBannersProps) {
  const { margin, padding } = props
  const {
    getBannersAPI,
    handleBannerIntersecting,
    handleBannerClick,
  } = useAdBannerProps(props)
  const [banners, setBanners] = useState([])

  useEffect(() => {
    let handle: number | undefined

    async function fetchBanners() {
      const response = await getBannersAPI()

      setBanners(response || [])
    }

    if (window.requestIdleCallback) {
      handle = window.requestIdleCallback(() => {
        fetchBanners()
      })
    } else {
      fetchBanners()
    }

    return () => {
      if (handle && window.cancelIdleCallback) {
        window.cancelIdleCallback(handle)
      }
    }
    // HACK: 최초 한 번만 실행
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <VerticalListView
      banners={banners}
      padding={padding}
      margin={margin}
      onBannerClick={handleBannerClick}
      onBannerIntersect={handleBannerIntersecting}
    />
  )
}
