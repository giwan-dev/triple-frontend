import { useMemo } from 'react'
import qs from 'qs'
import { useHistoryFunctions, useEnv } from '@titicaca/react-contexts'

import { ResourceType } from './types'
import { writeReview } from './review-api-clients'

/**
 * @deprecated 링크컴포넌트로 전환하여 사용하지 않습니다.
 */
export function useClientActions() {
  const { appUrlScheme } = useEnv()
  const { navigate } = useHistoryFunctions()

  return useMemo(() => {
    return {
      writeReview(params: {
        resourceType: ResourceType
        resourceId: string
        regionId?: string
        rating?: number
        photoFirst?: boolean
      }) {
        writeReview({ appUrlScheme, ...params })
      },
      navigateUserDetail(uid: string) {
        window.location.href = `${appUrlScheme}:///users/${uid}`
      },
      navigateImages(
        images: {
          id: string
          title: string
          description: string
          width: unknown
          height: unknown
          sourceUrl: string
          sizes: {
            full: { url: string }
            large: { url: string }
            small_square: { url: string }
          }
        }[],
        index: number,
      ) {
        window.location.href = `${appUrlScheme}:///images?${qs.stringify({
          images: JSON.stringify(images),
          index,
        })}`
      },
      navigateReviewDetail({
        reviewId,
        regionId,
        resourceId,
        anchor,
      }: {
        reviewId: string
        regionId?: string
        resourceId: string
        anchor?: string
      }) {
        const params = qs.stringify({
          region_id: regionId,
          resource_id: resourceId,
        })
        navigate(
          `${appUrlScheme}:///reviews/${reviewId}/detail?${params}${
            anchor ? `#${anchor}` : ''
          }`,
        )
      },
      reportReview(reviewId: string) {
        window.location.href = `${appUrlScheme}:///reviews/${reviewId}/report`
      },
    }
  }, [appUrlScheme, navigate])
}
