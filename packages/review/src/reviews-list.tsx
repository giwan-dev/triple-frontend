import React, { useCallback, useState } from 'react'
import { List } from '@titicaca/core-elements'
import {
  useUserAgentContext,
  useEventTrackingContext,
  useHistoryFunctions,
} from '@titicaca/react-contexts'
import { useSessionCallback } from '@titicaca/ui-flow'
import { Timestamp } from '@titicaca/view-utilities'

import ReviewElement, { ReviewElementProps } from './review-element'
import { HASH_MY_REVIEW_ACTION_SHEET } from './my-review-action-sheet'
import OthersReviewActionSheet, {
  HASH_REVIEW_ACTION_SHEET,
} from './others-review-action-sheet'
import { AppNativeActionProps, ReviewData } from './types'

export default function ReviewsList({
  myReview,
  reviews,
  regionId,
  fetchNext,
  resourceId,
  maxLength,
  reviewRateDescriptions,
  showToast,
}: {
  myReview?: ReviewData
  reviews: ReviewData[]
  fetchNext?: () => void
  regionId?: string
  /**
   * @deprecated env context를 사용하면 생략 가능
   */
  resourceId: string
  maxLength?: number
  reviewRateDescriptions?: string[]
  showToast: AppNativeActionProps['showToast']
}) {
  const [selectedReview, setSelectedReview] = useState<ReviewData | undefined>(
    undefined,
  )
  const { isPublic } = useUserAgentContext()
  const { trackEvent } = useEventTrackingContext()
  const { push } = useHistoryFunctions()

  const handleUserClick: ReviewElementProps['onUserClick'] = useCallback(
    ({ user: { uid, unregister, mileage } }: ReviewData) => {
      const { level } = mileage || { level: 0 }
      trackEvent({
        ga: ['리뷰 프로필'],
        fa: {
          action: '리뷰_프로필',
          item_id: resourceId,
          user_id: uid,
          level,
        },
      })

      if (unregister) {
        showToast('탈퇴한 사용자입니다.')
      }
    },
    [trackEvent, resourceId, showToast],
  )

  const handleMenuClick: ReviewElementProps['onMenuClick'] = useSessionCallback(
    useCallback(
      (review: ReviewData) => {
        if (!isPublic) {
          if (myReview && review.id === myReview.id) {
            push(HASH_MY_REVIEW_ACTION_SHEET)
          } else {
            setSelectedReview(review)
            push(HASH_REVIEW_ACTION_SHEET)
          }
        }
      },
      [isPublic, myReview, push],
    ),
  )

  const handleImageClick: ReviewElementProps['onImageClick'] = useCallback(
    ({ media }: ReviewData, index) => {
      if (!media) {
        return
      }

      trackEvent({
        ga: ['리뷰_리뷰사진썸네일'],
        fa: {
          action: '리뷰_리뷰사진썸네일',
          item_id: resourceId,
          photo_id: media[index].id,
        },
      })
    },
    [resourceId, trackEvent],
  )

  const handleReviewClick = useCallback(
    (reviewId: string) => {
      trackEvent({
        ga: ['리뷰_리뷰선택', resourceId],
        fa: {
          action: '리뷰_리뷰선택',
          item_id: resourceId,
          review_id: reviewId,
        },
      })
    },
    [trackEvent, resourceId],
  )

  const handleMessageCountClick = useCallback(
    (reviewId: string, resourceType: string) => {
      trackEvent({
        ga: ['리뷰_댓글', regionId],
        fa: {
          action: '리뷰_댓글',
          item_id: resourceId,
          review_id: reviewId,
          region_id: regionId,
          content_type: resourceType,
        },
      })
    },
    [regionId, resourceId, trackEvent],
  )

  const handleShow = fetchNext
    ? (index: number) => index > reviews.length - 3 && fetchNext()
    : undefined

  const allReviews = myReview ? [myReview, ...(reviews || [])] : reviews
  const displayedReviews = maxLength
    ? allReviews.slice(0, maxLength)
    : allReviews

  return (
    <>
      <List divided margin={{ top: 24 }} verticalGap={48}>
        {displayedReviews.map((review, i) => (
          <ReviewElement
            isMyReview={!!(myReview && myReview.id === review.id)}
            key={review.id}
            index={i}
            review={review}
            regionId={regionId}
            reviewRateDescriptions={reviewRateDescriptions}
            onUserClick={isPublic ? undefined : handleUserClick}
            onMenuClick={handleMenuClick}
            onImageClick={handleImageClick}
            onReviewClick={handleReviewClick}
            onMessageCountClick={handleMessageCountClick}
            resourceId={resourceId}
            DateFormatter={Timestamp}
            onShow={handleShow}
          />
        ))}
      </List>

      <OthersReviewActionSheet selectedReview={selectedReview} />
    </>
  )
}
