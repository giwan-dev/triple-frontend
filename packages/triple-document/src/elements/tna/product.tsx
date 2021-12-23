import React, { MouseEventHandler, useCallback } from 'react'
import { Text, Tag, Container, Image, Rating } from '@titicaca/core-elements'
import { formatNumber } from '@titicaca/view-utilities'
import { StaticIntersectionObserver } from '@titicaca/intersection-observer'
import { OverlayScrapButton } from '@titicaca/scrap-button'
import semver from 'semver'
import { useUserAgentContext } from '@titicaca/react-contexts'
import { ExternalLink } from '@titicaca/router'

import { TNAProductData, DomesticArea } from './types'
import { generateCoupon } from './helpers'
import { PricePolicyCouponInfo } from './price-policy-coupon-info'

const PLACEHOLDER_IMAGE_URL =
  'https://assets.triple.guide/images/ico_blank_see@2x.png'

function Pricing({
  basePrice,
  salePrice,
}: Parameters<typeof Container>[0] & {
  basePrice?: number
  salePrice: number
}) {
  const rate = basePrice
    ? Math.floor(((basePrice - salePrice) / basePrice) * 100)
    : null

  return (
    <Container margin={{ top: 10 }}>
      {rate ? (
        <Container margin={{ bottom: 2 }}>
          <Text color="red" bold>
            {rate}%
          </Text>
        </Container>
      ) : null}

      <Container>
        <Text inline bold size={18} color="gray">
          {`${formatNumber(salePrice)}원`}
        </Text>

        {basePrice ? (
          <Text
            inline
            color="gray300"
            size="mini"
            strikethrough
            margin={{ left: 5 }}
          >{`${formatNumber(basePrice)}원`}</Text>
        ) : null}
      </Container>
    </Container>
  )
}

export function TnaProductWithPrice({
  product,
  product: {
    id,
    title,
    heroImage,
    tags,
    salePrice: rawSalePrice,
    basePrice: rawBasePrice,
    reviewRating,
    reviewsCount,
    domesticAreas = [],
    applicableCoupon,
    expectedApplicableCoupon,
    scraped,
  },
  index,
  onIntersect,
  onClick,
}: {
  index: number
  product: TNAProductData
  onClick: (
    e: React.SyntheticEvent,
    product: TNAProductData,
    index: number,
  ) => void
  onIntersect: (product: TNAProductData, index: number) => void
}) {
  const { app, isPublic } = useUserAgentContext()

  const salePrice =
    typeof rawSalePrice === 'string' ? parseInt(rawSalePrice) : rawSalePrice
  const basePrice =
    typeof rawBasePrice === 'string' ? parseInt(rawBasePrice) : rawBasePrice
  const primaryDomesticArea: DomesticArea | undefined =
    domesticAreas.find(({ representative }) => representative) ||
    domesticAreas[0]
  const {
    hasCoupon,
    hasOnlyExpectedApplicableCoupon,
    hasAmountAfterUsingCouponPrice,
    displayPricePolicy,
  } = generateCoupon({
    applicableCoupon,
    expectedApplicableCoupon,
  })

  const appVersion = semver.coerce(app?.version)
  const canScrap = isPublic || (appVersion && semver.gte(appVersion, '5.8.0'))

  const handleIntersectionChange = useCallback(
    ({ isIntersecting }: IntersectionObserverEntry) => {
      if (isIntersecting) {
        onIntersect(product, index)
      }
    },
    [index, onIntersect, product],
  )

  const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      onClick(e, product, index)
    },
    [index, onClick, product],
  )

  return (
    <ExternalLink
      href={`/tna/products/${product.id}`}
      target={isPublic ? 'current' : 'new'}
      allowSource="all"
    >
      <a>
        <StaticIntersectionObserver onChange={handleIntersectionChange}>
          <Container onClick={handleClick} clearing>
            <Image>
              <Image.FixedDimensionsFrame
                size="small"
                width={90}
                floated="left"
              >
                {heroImage ? (
                  <Image.Img src={heroImage} alt={`${title}의 썸네일`} />
                ) : (
                  <Image.Placeholder src={PLACEHOLDER_IMAGE_URL} />
                )}
              </Image.FixedDimensionsFrame>
            </Image>
            {canScrap && (
              <Container position="absolute" positioning={{ top: 3, left: 51 }}>
                <OverlayScrapButton
                  resource={{ id, scraped, type: 'tna' }}
                  size={36}
                />
              </Container>
            )}

            <Container margin={{ left: 104 }}>
              <Text bold size="large" color="gray" ellipsis>
                {title}
              </Text>

              {primaryDomesticArea && (
                <Text color="gray400" size="tiny" margin={{ top: 4 }}>
                  {primaryDomesticArea.displayName}
                </Text>
              )}

              {tags && tags.length > 0 && (
                <Container margin={{ top: 3 }}>
                  {tags.map(({ text, type, style }, i) => (
                    <Tag
                      key={i}
                      type={type}
                      style={style}
                      margin={{ top: 4, right: i < tags.length - 1 ? 4 : 0 }}
                    >
                      {text}
                    </Tag>
                  ))}
                </Container>
              )}

              {reviewsCount ? (
                <Container margin={{ top: 4 }}>
                  <Rating size="tiny" score={reviewRating} />
                  <Text
                    inlineBlock
                    size="tiny"
                    color="gray400"
                    lineHeight={1.08}
                    margin={{ left: 6 }}
                  >
                    ({reviewsCount})
                  </Text>
                </Container>
              ) : null}

              {salePrice !== undefined ? (
                <Pricing
                  salePrice={salePrice}
                  basePrice={
                    !!basePrice && salePrice !== basePrice
                      ? basePrice
                      : undefined
                  }
                />
              ) : null}

              {hasCoupon && (
                <PricePolicyCouponInfo
                  hasOnlyExpectedApplicableCoupon={
                    hasOnlyExpectedApplicableCoupon
                  }
                  hasAmountAfterUsingCouponPrice={
                    hasAmountAfterUsingCouponPrice
                  }
                  displayPricePolicy={displayPricePolicy}
                />
              )}
            </Container>
          </Container>
        </StaticIntersectionObserver>
      </a>
    </ExternalLink>
  )
}
