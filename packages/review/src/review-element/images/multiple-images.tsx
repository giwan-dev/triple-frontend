import { Responsive } from '@titicaca/core-elements'
import { ImageMeta } from '@titicaca/type-definitions'
import React from 'react'

import { ReviewData } from '../../types'

import {
  ImageElement,
  SquareFrame,
  ImagesContainer,
  FlexItemContainer,
  ExternalLinkImage,
} from './elements'

const IMAGES_CONTAINER_HEIGHTS = [217, 292, 328]
const IMAGE_HEIGHTS = [217, 143, 105]

export default function MultipleImages({
  images,
  image,
  review,
  onImageClick,
}: {
  images: ImageMeta[]
  image: ImageMeta
  review: ReviewData
  onImageClick: () => void
}) {
  const [firstImage, ...restImages] = images

  return (
    <>
      <Responsive maxWidth={499}>
        <ImagesContainer flexDirection="row">
          <FlexItemContainer flexShrink={1} margin={{ right: 5 }}>
            <SquareFrame>
              <ExternalLinkImage
                review={review}
                image={image}
                onClick={onImageClick}
              >
                <ImageElement
                  src={firstImage.sizes.large.url}
                  fullHeight
                  absolute
                />
              </ExternalLinkImage>
            </SquareFrame>
          </FlexItemContainer>

          <FlexItemContainer flexShrink={restImages.length}>
            <ImagesContainer flexDirection="column">
              {restImages.map(({ id, sizes }, index) => (
                <FlexItemContainer
                  key={`review.img.${id}.${index}`}
                  flexShrink={1}
                  margin={{ bottom: index < restImages.length - 1 ? 5 : 0 }}
                >
                  <SquareFrame>
                    <ExternalLinkImage
                      review={review}
                      image={image}
                      onClick={onImageClick}
                    >
                      <ImageElement src={sizes.large.url} absolute fullHeight />
                    </ExternalLinkImage>
                  </SquareFrame>
                </FlexItemContainer>
              ))}
            </ImagesContainer>
          </FlexItemContainer>
        </ImagesContainer>
      </Responsive>
      <Responsive minWidth={500}>
        <ImagesContainer
          flexDirection="row"
          height={IMAGES_CONTAINER_HEIGHTS[restImages.length - 1]}
        >
          <FlexItemContainer flexShrink={1} margin={{ right: 9 }}>
            <ExternalLinkImage
              review={review}
              image={image}
              onClick={onImageClick}
            >
              <ImageElement src={firstImage.sizes.large.url} fullHeight />
            </ExternalLinkImage>
          </FlexItemContainer>

          <FlexItemContainer flexShrink={restImages.length}>
            <Responsive maxWidth={767}>
              <ImagesContainer flexDirection="column">
                {restImages.map(({ id, sizes }, index) => (
                  <ExternalLinkImage
                    key={id}
                    review={review}
                    image={image}
                    onClick={onImageClick}
                  >
                    <ImageElement
                      key={`review.img.${id}.${index}`}
                      src={sizes.large.url}
                      height={IMAGE_HEIGHTS[restImages.length - 1]}
                      margin={{ bottom: index < restImages.length - 1 ? 6 : 0 }}
                    />
                  </ExternalLinkImage>
                ))}
              </ImagesContainer>
            </Responsive>
            <Responsive minWidth={768}>
              <ImagesContainer flexDirection="column">
                {restImages.map(({ id, sizes }, index) => (
                  <ExternalLinkImage
                    key={id}
                    review={review}
                    image={image}
                    onClick={onImageClick}
                  >
                    <ImageElement
                      key={`review.img.${id}.${index}`}
                      src={sizes.large.url}
                      height={IMAGE_HEIGHTS[restImages.length - 1]}
                      margin={{ bottom: index < restImages.length - 1 ? 6 : 0 }}
                    />
                  </ExternalLinkImage>
                ))}
              </ImagesContainer>
            </Responsive>
          </FlexItemContainer>
        </ImagesContainer>
      </Responsive>
    </>
  )
}
