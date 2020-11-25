import React, { PropsWithChildren } from 'react'
import {
  ScrapsProvider,
  useSessionContext,
  useUserAgentContext,
} from '@titicaca/react-contexts'
import {
  useTransitionModal,
  TransitionType,
  useLoginCTAModal,
} from '@titicaca/modals'

/**
 * 전역 스크랩 context에 가드를 추가하는 컴포넌트
 *
 * 모웹이거나 세션ID가 없을 때 스크랩이 작동하면 안된다.
 */
export function GuardedScrapsProvider({
  children,
  beforeScrapedChange,
  ...props
}: PropsWithChildren<Parameters<typeof ScrapsProvider>[0]>) {
  const { isPublic } = useUserAgentContext()
  const { hasSessionId } = useSessionContext()
  const { show: showTransitionModal } = useTransitionModal()
  const { show: showLoginCTA } = useLoginCTAModal()

  return (
    <ScrapsProvider
      beforeScrapedChange={(target, scraped) => {
        if (isPublic) {
          showTransitionModal(TransitionType.Scrap)
          return false
        }

        if (!hasSessionId) {
          showLoginCTA()
          return false
        }

        if (beforeScrapedChange) {
          return beforeScrapedChange(target, scraped)
        }
        return true
      }}
      {...props}
    >
      {children}
    </ScrapsProvider>
  )
}
