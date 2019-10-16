import React from 'react'
import ReviewContainer from './review-container'
import { TransitionModals } from './transition-modals'
import { ReviewProps } from './types'

export * from './review-likes-context'
export * from './review-placeholder-with-rating'
export * from './review-api-clients'

export function Reviews({ resourceId, regionId, ...props }: ReviewProps) {
  return (
    <>
      <ReviewContainer regionId={regionId} resourceId={resourceId} {...props} />
      <TransitionModals regionId={regionId} resourceId={resourceId} />
    </>
  )
}
