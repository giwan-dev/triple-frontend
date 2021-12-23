import React, {
  useState,
  PropsWithChildren,
  ComponentType,
  MouseEventHandler,
  useCallback,
} from 'react'
import styled, { css } from 'styled-components'
import * as CSS from 'csstype'
import semver from 'semver'
import { StaticIntersectionObserver as IntersectionObserver } from '@titicaca/intersection-observer'
import { List, Container, Text, Rating } from '@titicaca/core-elements'
import {
  useEventTrackingContext,
  useUserAgentContext,
} from '@titicaca/react-contexts'
import { useSessionCallback } from '@titicaca/ui-flow'
import { ExternalLink } from '@titicaca/router'
import { generateUrl } from '@titicaca/view-utilities'
import qs from 'qs'

import { useReviewLikesContext } from '../review-likes-context'
import { ReviewData } from '../types'
import { unlikeReview, likeReview } from '../review-api-clients'

import User from './user'
import Comment from './comment'
import FoldableComment from './foldable-comment'
import Images from './images'

type ReviewHandler = (review: ReviewData) => void

export interface ReviewElementProps {
  review: ReviewData
  regionId?: string
  isMyReview: boolean
  index: number
  onUserClick?: ReviewHandler
  onUnfoldButtonClick?: ReviewHandler
  onMenuClick: ReviewHandler
  onImageClick: (review: ReviewData, index: number) => void
  onReviewClick: (reviewId: string) => void
  onMessageCountClick: (reviewId: string, resourceType: string) => void
  onShow?: (index: number) => void
  reviewRateDescriptions?: string[]
  DateFormatter?: ComponentType<{ date: string }>
  resourceId: string
}

const MetaContainer = styled.div`
  margin-top: 5px;
  height: 27px;
`

const MoreIcon = styled.img`
  margin-top: -3px;
  margin-left: 5px;
  width: 30px;
  height: 30px;
  vertical-align: middle;
  cursor: pointer;
`

const MessageCount = styled(Container)<{ isCommaVisible?: boolean }>`
  font-weight: bold;
  background-image: url('https://assets.triple.guide/images/btn-lounge-comment-off@3x.png');
  background-size: 18px 18px;
  background-repeat: no-repeat;

  ${({ isCommaVisible }) =>
    isCommaVisible &&
    css`
      margin-left: 8px;
      &::before {
        position: absolute;
        left: -10px;
        content: '·';
      }
    `}
`

const LikeButton = styled(Container)<{ liked?: boolean }>`
  font-weight: bold;
  text-decoration: none;
  background-size: 18px 18px;
  background-repeat: no-repeat;
  ${({ liked }) => css`
    color: var(${liked ? '--color-blue' : '--color-gray400'});
    background-image: url('https://assets.triple.guide/images/btn-lounge-thanks-${liked
      ? 'on'
      : 'off'}@3x.png');
  `};
`

const LOUNGE_APP_VERSION = '4.3.0'
const MESSAGE_COUNT_APP_VERSION = '5.5.0'

export default function ReviewElement({
  review,
  regionId,
  review: {
    user,
    blindedAt,
    comment,
    createdAt,
    rating,
    media,
    replyBoard,
    resourceType,
  },
  isMyReview,
  index,
  onUserClick,
  onUnfoldButtonClick,
  onMenuClick,
  onImageClick,
  onReviewClick,
  onMessageCountClick,
  onShow,
  DateFormatter,
  reviewRateDescriptions,
  resourceId,
}: ReviewElementProps) {
  const [unfolded, setUnfolded] = useState(false)
  const {
    deriveCurrentStateAndCount,
    updateLikedStatus,
  } = useReviewLikesContext()
  const appVersion = semver.coerce(useUserAgentContext()?.app?.version)
  const { isPublic } = useUserAgentContext()
  const { trackEvent } = useEventTrackingContext()
  const { liked, likesCount } = deriveCurrentStateAndCount({
    reviewId: review.id,
    liked: review.liked,
    likesCount: review.likesCount,
  })
  const isMessageCountVisible =
    (!!appVersion && semver.gte(appVersion, MESSAGE_COUNT_APP_VERSION)) ||
    isPublic

  const handleLikeButtonClick: MouseEventHandler = useSessionCallback(
    useCallback(async () => {
      const actionName = `리뷰_땡쓰${liked ? '취소' : ''}`

      trackEvent({
        ga: [actionName],
        fa: {
          action: actionName,
          review_id: review.id,
          item_id: resourceId,
        },
      })

      const response = await (liked
        ? unlikeReview({ id: review.id })
        : likeReview({ id: review.id }))

      if (response.ok) {
        updateLikedStatus({ [review.id]: !liked }, resourceId)
      }
    }, [liked, resourceId, review, trackEvent, updateLikedStatus]),
  )

  return (
    <IntersectionObserver
      onChange={({ isIntersecting }) =>
        isIntersecting && onShow && onShow(index)
      }
    >
      <List.Item style={{ paddingTop: 6 }}>
        <User
          user={user}
          onClick={onUserClick && (() => onUserClick(review))}
        />
        {!blindedAt && !!rating ? <Score score={rating} /> : null}
        <Content>
          <div
            onClick={(e) => {
              if (appVersion && semver.gte(appVersion, LOUNGE_APP_VERSION)) {
                e.preventDefault()
              }
            }}
          >
            <ExternalLink
              href={generateUrl({
                path: `/reviews/${review.id}/detail`,
                query: qs.stringify({
                  region_id: regionId,
                  resource_id: resourceId,
                }),
              })}
              target={isPublic ? 'current' : 'new'}
              allowSource="all"
              onClick={() => onReviewClick(review.id)}
            >
              <a>
                {blindedAt ? (
                  '신고가 접수되어 블라인드 처리되었습니다.'
                ) : comment ? (
                  unfolded ? (
                    comment
                  ) : (
                    <FoldableComment
                      comment={comment}
                      hasImage={(media || []).length > 0}
                      onUnfoldButtonClick={() => {
                        if (
                          appVersion &&
                          semver.gte(appVersion, LOUNGE_APP_VERSION)
                        ) {
                          return
                        }

                        trackEvent({
                          ga: ['리뷰_리뷰글더보기'],
                          fa: {
                            action: '리뷰_리뷰글더보기',
                            item_id: resourceId,
                          },
                        })
                        setUnfolded(true)

                        onUnfoldButtonClick && onUnfoldButtonClick(review)
                      }}
                    />
                  )
                ) : (
                  <RateDescription
                    rating={rating}
                    reviewRateDescriptions={reviewRateDescriptions}
                  />
                )}
                {!blindedAt && media && media.length > 0 ? (
                  <Container margin={{ top: 10 }}>
                    <Images
                      review={review}
                      images={media}
                      image={media[index]}
                      onImageClick={() => onImageClick(review, index)}
                    />
                  </Container>
                ) : null}
              </a>
            </ExternalLink>
          </div>
        </Content>
        <Meta>
          {!blindedAt ? (
            <LikeButton
              display="inline-block"
              margin={{ top: 5 }}
              padding={{ top: 2, bottom: 2, right: 10, left: 20 }}
              height={18}
              liked={liked}
              onClick={handleLikeButtonClick}
            >
              {likesCount}
            </LikeButton>
          ) : null}

          {isMessageCountVisible ? (
            <MessageCount
              display="inline-block"
              position="relative"
              height={18}
              margin={{ top: 5 }}
              padding={{ top: 2, bottom: 2, left: 20, right: 0 }}
              isCommaVisible={!blindedAt}
            >
              <ExternalLink
                href={generateUrl({
                  path: `/reviews/${review.id}/detail?#reply`,
                  query: qs.stringify({
                    reviewId: review.id,
                    regionId,
                    resourceId,
                    anchor: 'reply',
                  }),
                })}
                target="new"
                allowSource="app-with-session"
                onClick={() => onMessageCountClick(review.id, resourceType)}
              >
                <a>
                  {replyBoard
                    ? replyBoard.rootMessagesCount +
                      replyBoard.childMessagesCount
                    : 0}
                </a>
              </ExternalLink>
            </MessageCount>
          ) : null}

          {!blindedAt || (blindedAt && isMyReview) ? (
            <Date floated="right">
              {DateFormatter ? <DateFormatter date={createdAt} /> : createdAt}
              <MoreIcon
                src="https://assets.triple.guide/images/btn-review-more@4x.png"
                onClick={() => onMenuClick(review)}
              />
            </Date>
          ) : null}
        </Meta>
      </List.Item>
    </IntersectionObserver>
  )
}

function Score({ score }: { score?: number }) {
  return (
    <Container margin={{ top: 18 }}>
      <Rating size="tiny" score={score} />
    </Container>
  )
}

function Content({ children }: PropsWithChildren<{}>) {
  return (
    <Container margin={{ top: 6 }} clearing>
      <Comment>{children}</Comment>
    </Container>
  )
}

function Meta({ children }: PropsWithChildren<{}>) {
  return (
    <MetaContainer>
      <Text size="mini" color="gray" alpha={0.4}>
        {children}
      </Text>
    </MetaContainer>
  )
}

function Date({
  floated,
  children,
}: PropsWithChildren<{ floated?: CSS.Property.Float }>) {
  return (
    <Container floated={floated} margin={{ top: 2 }}>
      {children}
    </Container>
  )
}

function RateDescription({
  rating,
  reviewRateDescriptions,
}: {
  rating?: number | null | undefined
  reviewRateDescriptions: string[] | undefined
}) {
  const comment =
    rating && reviewRateDescriptions ? reviewRateDescriptions[rating] : ''
  return <Comment>{comment}</Comment>
}
