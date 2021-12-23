import { ImageMeta } from '@titicaca/type-definitions'
import React from 'react'

import { ReviewData } from '../../types'

import MultipleImages from './multiple-images'
import PentaImages from './penta-images'
import SingleImage from './single-image'

export default function Images({
  images,
  review,
  image,
  onImageClick,
}: {
  images: ImageMeta[]
  image: ImageMeta
  review: ReviewData
  onImageClick: () => void
}) {
  if (images.length <= 0) {
    return null
  }

  if (images.length >= 5) {
    return (
      <PentaImages
        images={images}
        image={image}
        review={review}
        onImageClick={onImageClick}
      />
    )
  }

  if (images.length > 1) {
    return (
      <MultipleImages
        images={images}
        image={image}
        review={review}
        onImageClick={onImageClick}
      />
    )
  }

  return (
    <SingleImage
      image={images[0]}
      review={review}
      onImageClick={onImageClick}
    />
  )
}
