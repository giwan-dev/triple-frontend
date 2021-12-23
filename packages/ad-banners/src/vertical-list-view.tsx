import React, { FC } from 'react'
import { MarginPadding } from '@titicaca/core-elements'
import { ExternalLink } from '@titicaca/router'

import VerticalEntity from './vertical-entity'
import { Banner } from './typing'
import ListSection from './list-section'

interface VerticalListViewProps {
  banners: Banner[]
  padding?: MarginPadding
  margin?: MarginPadding
  onBannerClick: (banner: Banner, index: number) => void
  onBannerIntersect: (
    isIntersecting: boolean,
    banner: Banner,
    index: number,
  ) => void
}

const VerticalListView: FC<VerticalListViewProps> = ({
  banners,
  padding,
  margin,
  onBannerIntersect,
  onBannerClick,
}) => {
  const makeBannerClickHandler = (index: number) => {
    return (banner: Banner) => {
      onBannerClick(banner, index)
    }
  }
  const makeBannerIntersectingHandler = (index: number) => {
    return (isIntersecting: boolean, banner: Banner) => {
      onBannerIntersect(isIntersecting, banner, index)
    }
  }

  if (banners.length === 0) {
    return null
  }

  return (
    <ListSection minWidth={0} padding={padding} margin={margin}>
      {banners.map((banner, index) => (
        <ExternalLink
          key={banner.id}
          href={banner.target}
          target="new"
          allowSource="app"
        >
          <a>
            <VerticalEntity
              banner={banner}
              onClick={makeBannerClickHandler(index)}
              onIntersect={makeBannerIntersectingHandler(index)}
            />
          </a>
        </ExternalLink>
      ))}
    </ListSection>
  )
}

export default VerticalListView
