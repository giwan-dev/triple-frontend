import { Responsive, Text } from '@titicaca/core-elements'
import { ImageMeta } from '@titicaca/type-definitions'
import React from 'react'

import { ReviewData } from '../../types'

import {
  ImageElement,
  SquareFrame,
  Dimmer,
  FlexItemContainer,
  ImagesContainer,
  ExternalLinkImage,
} from './elements'

export default function PentaImages({
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
  const [firstImage, secondImage, ...lowerImages] = images.slice(0, 5)
  const upperImages = [firstImage, secondImage]
  return (
    <>
      <Responsive maxWidth={499}>
        <ImagesContainer flexDirection="column">
          <ImagesContainer flexDirection="row" margin={{ bottom: 5 }}>
            {upperImages.map(({ id, sizes }, index) => (
              <FlexItemContainer
                key={`review-img.${id}.${index}`}
                flexShrink={1}
                margin={{ right: index === 0 ? 5 : 0 }}
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
          <ImagesContainer flexDirection="row">
            {lowerImages.map(({ id, sizes }, index) => (
              <FlexItemContainer
                key={`review-img.${id}.${index}`}
                flexShrink={1}
                margin={{ right: index < 2 ? 5 : 0 }}
              >
                <SquareFrame>
                  <ExternalLinkImage
                    review={review}
                    image={image}
                    onClick={onImageClick}
                  >
                    <ImageElement src={sizes.large.url} absolute fullHeight />
                    {images.length > 5 && index === 2 ? (
                      <Dimmer onClick={() => onImageClick()}>
                        <td>
                          <Text bold color="white900" textAlign="center">
                            + {images.length - 5}
                          </Text>
                        </td>
                      </Dimmer>
                    ) : null}
                  </ExternalLinkImage>
                </SquareFrame>
              </FlexItemContainer>
            ))}
          </ImagesContainer>
        </ImagesContainer>
      </Responsive>
      <Responsive minWidth={500}>
        <ImagesContainer flexDirection="column">
          <Responsive maxWidth={767}>
            <ImagesContainer
              flexDirection="row"
              height={217}
              margin={{ bottom: 6 }}
            >
              {upperImages.map(({ id, sizes }, index) => (
                <FlexItemContainer
                  key={`review-img.${id}.${index}`}
                  flexShrink={1}
                  margin={{ right: index === 0 ? 6 : 0 }}
                >
                  <ExternalLinkImage
                    review={review}
                    image={image}
                    onClick={onImageClick}
                  >
                    <ImageElement src={sizes.large.url} fullHeight />
                  </ExternalLinkImage>
                </FlexItemContainer>
              ))}
            </ImagesContainer>
          </Responsive>
          <Responsive minWidth={768}>
            <ImagesContainer
              flexDirection="row"
              height={217}
              margin={{ bottom: 6 }}
            >
              {upperImages.map(({ id, sizes }, index) => (
                <FlexItemContainer
                  key={`review-img.${id}.${index}`}
                  flexShrink={1}
                  margin={{ right: index === 0 ? 9 : 0 }}
                >
                  <ExternalLinkImage
                    review={review}
                    image={image}
                    onClick={onImageClick}
                  >
                    <ImageElement src={sizes.large.url} fullHeight />
                  </ExternalLinkImage>
                </FlexItemContainer>
              ))}
            </ImagesContainer>
          </Responsive>
          <ImagesContainer flexDirection="row" height={143}>
            {lowerImages.map(({ id, sizes }, index) => (
              <FlexItemContainer
                key={`review-img.${id}.${index}`}
                flexShrink={1}
                margin={{ right: index < 2 ? 9 : 0 }}
              >
                <ExternalLinkImage
                  review={review}
                  image={image}
                  onClick={onImageClick}
                >
                  <ImageElement src={sizes.large.url} fullHeight />
                  {images.length > 5 && index === 2 ? (
                    <Dimmer onClick={() => onImageClick()}>
                      <td>
                        <Text bold color="white900" textAlign="center">
                          + {images.length - 5}
                        </Text>
                      </td>
                    </Dimmer>
                  ) : null}
                </ExternalLinkImage>
              </FlexItemContainer>
            ))}
          </ImagesContainer>
        </ImagesContainer>
      </Responsive>
    </>
  )
}
