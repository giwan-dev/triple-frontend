import { Responsive } from '@titicaca/core-elements'
import { ImageMeta } from '@titicaca/type-definitions'
import React from 'react'

import { ReviewData } from '../../types'

import { ExternalLinkImage, ImageElement, SquareFrame } from './elements'

export default function SigleImage({
  image,
  review,
  onImageClick,
}: {
  image: ImageMeta
  review: ReviewData
  onImageClick: () => void
}) {
  return (
    <>
      <Responsive maxWidth={499}>
        <ExternalLinkImage review={review} image={image} onClick={onImageClick}>
          {image.width && image.height && image.width > image.height ? (
            <ImageElement src={image.sizes.large.url} />
          ) : (
            <SquareFrame>
              <ImageElement src={image.sizes.large.url} absolute fullHeight />
            </SquareFrame>
          )}
        </ExternalLinkImage>
      </Responsive>
      <Responsive minWidth={500}>
        <ExternalLinkImage review={review} image={image} onClick={onImageClick}>
          <ImageElement src={image.sizes.large.url} height={293} />
        </ExternalLinkImage>
      </Responsive>
    </>
  )
}
