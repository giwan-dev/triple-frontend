import { createContext, useContext, ComponentType } from 'react'
import { DeepPartial } from 'utility-types'

interface UtmQuery {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string

  // for camelized query
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string

  // utm parameter 명세가 아닌 custom query
  prt?: string
}

interface UtmContextValue {
  source: string
  medium: string
  campaign: string
  term?: string
  content?: string
  partner?: string
}

/**
 * query 객체에서 utm context 객체를 추출합니다.
 */
export function extractUtmContextFromQuery({
  utm_source,
  utm_medium,
  utm_campaign,
  utm_term,
  utm_content,
  utmSource,
  utmMedium,
  utmCampaign,
  utmTerm,
  utmContent,
  prt,
}: UtmQuery): UtmContextValue {
  const source = utm_source || utmSource || ''
  const medium = utm_medium || utmMedium || ''
  const campaign = utm_campaign || utmCampaign || ''
  const term = utm_term || utmTerm
  const content = utm_content || utmContent

  return {
    source,
    medium,
    campaign,
    term,
    content,
    partner: prt,
  }
}

const UtmContext = createContext<UtmContextValue>({
  source: '',
  medium: '',
  campaign: '',
})

export const UtmProvider = UtmContext.Provider

/**
 * Functional 컴포넌트에 utm context를 inject할 때 사용하는 함수
 */
export function useUtmContext() {
  const context = useContext(UtmContext)

  if (context === undefined) {
    throw new Error('UtmProvider is not mounted')
  }

  return context
}

export interface WithUtmContextBaseProps {
  utmContext: UtmContextValue
}

/**
 * class 컴포넌트에서 utm context를 inject할 때 사용하는 함수
 * @param Component
 */
export function withUtmContext<P extends DeepPartial<WithUtmContextBaseProps>>(
  Component: ComponentType<P>,
) {
  return function WithUtmContext(
    props: Omit<P, keyof WithUtmContextBaseProps>,
  ) {
    return (
      <UtmContext.Consumer>
        {(utmContext) => {
          const componentProps = {
            ...props,
            utmContext,
          } as P

          return <Component {...componentProps} />
        }}
      </UtmContext.Consumer>
    )
  }
}
