import styled, { css } from 'styled-components'
import { marginMixin, MarginPadding } from '@titicaca/core-elements'
import { generateUrl } from '@titicaca/view-utilities'
import qs from 'qs'
import { ExternalLink } from '@titicaca/router'
import React, { PropsWithChildren } from 'react'
import { ImageMeta } from '@titicaca/type-definitions'
import moment from 'moment'
import semver from 'semver'
import { useUserAgentContext } from '@titicaca/react-contexts'

import { ReviewData } from '../../types'

interface Margin {
  margin?: MarginPadding
}

export const ImageElement = styled.img<
  {
    absolute?: boolean
    height?: number
    fullHeight?: boolean
  } & Margin
>`
  ${({ absolute }) =>
    absolute &&
    css`
      position: absolute;
      top: 0;
    `}

  ${({ fullHeight }) =>
    fullHeight &&
    css`
      height: 100%;
    `}

  ${({ height }) =>
    height &&
    css`
      height: ${height}px;
    `}

  border-radius: 4px;
  width: 100%;
  object-fit: cover;

  ${marginMixin}
`

export const SquareFrame = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  height: 0;
`

export const ImagesContainer = styled.div<
  {
    flexDirection: 'column' | 'row'
    height?: number
  } & Margin
>`
  display: flex;
  justify-content: space-between;
  ${({ flexDirection }) => css`
    flex-direction: ${flexDirection};
  `}
  ${({ height }) =>
    height &&
    css`
      height: ${height}px;
    `}

  ${marginMixin}
`

export const Dimmer = styled.table`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-gray500);
  border-radius: 4px;

  & > td {
    vertical-align: middle;
  }
`

export const FlexItemContainer = styled.div<
  {
    flexShrink?: number
  } & Margin
>`
  position: relative;
  flex-basis: 100%;

  ${({ flexShrink = 1 }) => css`
    flex-shrink: ${flexShrink};
  `}

  /* stylelint-disable-next-line selector-type-no-unknown */
  & > div:not(${SquareFrame}) {
    height: 100%;
  }

  ${marginMixin}
`

const LOUNGE_APP_VERSION = '4.3.0'

export const ExternalLinkImage = ({
  review,
  image,
  onClick,
  children,
}: PropsWithChildren<{
  review: ReviewData
  image: ImageMeta
  onClick: () => void
}>) => {
  const appVersion = semver.coerce(useUserAgentContext()?.app?.version)

  const {
    user: { name },
    comment,
    media,
    createdAt,
  } = review || {}

  const convertImage = (convertingImage: ImageMeta) => ({
    id: convertingImage.id,
    title: '',
    description: (comment || '').replace(/\n\s*\n/g, '\n'),
    width: convertingImage.width,
    height: convertingImage.height,
    sourceUrl: `${name} / ${moment(createdAt).format('YYYY.M.D')}`,
    sizes: {
      full: convertingImage.sizes.full,
      large: convertingImage.sizes.large,
      small_square:
        'smallSquare' in convertingImage.sizes
          ? convertingImage.sizes.smallSquare
          : convertingImage.sizes.small_square,
    },
  })

  return (
    <div
      onClick={(e) => {
        if (
          (appVersion && semver.gte(appVersion, LOUNGE_APP_VERSION)) ||
          !media
        ) {
          e.preventDefault()
        }
      }}
    >
      <ExternalLink
        href={generateUrl({
          path: `/images`,
          query: qs.stringify({
            images: JSON.stringify(media?.map(convertImage)),
            index: media?.findIndex(({ id }) => id === image.id),
          }),
        })}
        target="new"
        allowSource="app-with-session"
        onClick={onClick}
      >
        <a>{children}</a>
      </ExternalLink>
    </div>
  )
}
