import {
  ComponentType,
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { DeepPartial } from 'utility-types'
import {
  notifyScraped,
  notifyUnscraped,
  subscribeScrapedChangeEvent,
  unsubscribeScrapedChangeEvent,
} from '@titicaca/triple-web-to-native-interfaces'

import { Target } from './types'
import {
  scrape as nativeScrape,
  unscrape as nativeUnscrape,
} from './api-client'
import {
  Scraps,
  useScrapsReducer,
  START_SCRAPE,
  SCRAPE,
  SCRAPE_FAILED,
  START_UNSCRAPE,
  UNSCRAPE,
  UNSCRAPE_FAILED,
  ScrapsReducerContext,
} from './use-reducer'

interface ScrapsContextValue {
  scraps: Scraps
  deriveCurrentStateAndCount: (params: {
    id: string
    scraped?: boolean
    scrapsCount?: number
  }) => { scraped: boolean; scrapsCount: number }
  scrape: (target: Target) => Promise<void>
  /** @deprecated Use `scrape()` instead */
  scrapeArticle: (id: string) => Promise<void>
  /** @deprecated Use `scrape()` instead */
  scrapePoi: (id: string) => Promise<void>
  unscrape: (target: Target) => Promise<void>
  /** @deprecated Use `unscrape()` instead */
  unscrapeArticle: (id: string) => Promise<void>
  /** @deprecated Use `unscrape()` instead */
  unscrapePoi: (id: string) => Promise<void>
  isDefault?: boolean
  enableTrackEvent?: boolean
}

function createNoOpFunctions(name: string) {
  return () => {
    if (process.env.NODE_ENV === 'development') {
      if (
        [
          'scrapeArticle',
          'unscrapeArticle',
          'scrapePoi',
          'unscrapePoi',
        ].includes(name)
      ) {
        // TODO: development 환경에서만 기록하는 logger 만들기
        // eslint-disable-next-line no-console
        console.warn(`${name} is deprecated. Please use scrape instead.`)
      }
    }
    return Promise.resolve()
  }
}

const ScrapsContext = createContext<ScrapsContextValue>({
  scraps: {},
  deriveCurrentStateAndCount: ({ scraped = false, scrapsCount = 0 }) => ({
    scraped,
    scrapsCount,
  }),
  scrape: createNoOpFunctions('scrape'),
  unscrape: createNoOpFunctions('unscrape'),
  scrapeArticle: createNoOpFunctions('scrapeArticle'),
  unscrapeArticle: createNoOpFunctions('unscrapeArticle'),
  scrapePoi: createNoOpFunctions('scrapePoi'),
  unscrapePoi: createNoOpFunctions('unscrapePoi'),
  isDefault: true,
})

interface ScrapsProviderProps {
  scraps?: Scraps
  enableTrackEvent?: boolean
  beforeScrapedChange?: (target: Target, scraped: boolean) => boolean
  afterScrapedChange?: (target: Target, scraped: boolean) => void
}

export function ScrapsProvider({
  scraps: initialScraps,
  enableTrackEvent,
  beforeScrapedChange,
  afterScrapedChange,
  children,
}: PropsWithChildren<ScrapsProviderProps>) {
  const parentScrapsReducer = useContext(ScrapsReducerContext)
  const localScrapsReducer = useScrapsReducer({ initialScraps })
  const scrapsReducer = parentScrapsReducer ?? localScrapsReducer
  const { scraps, updating, dispatch } = scrapsReducer
  const hasParentContext = !!parentScrapsReducer

  const deriveCurrentStateAndCount: ScrapsContextValue['deriveCurrentStateAndCount'] =
    useCallback(
      ({ id, scraped, scrapsCount: originalScrapsCount }) => {
        const currentState =
          typeof updating[id] !== 'undefined' ? updating[id] : scraps[id]
        const scrapsCount = Number(originalScrapsCount || 0)

        if (typeof scraped !== 'boolean' || typeof currentState !== 'boolean') {
          /* At least one of the status are unknown: Reduces to a bitwise OR operation */
          return {
            scraped: !!scraped || !!currentState,
            scrapsCount,
          }
        }

        return {
          scraped: currentState,
          scrapsCount:
            scraped === currentState
              ? scrapsCount
              : currentState
              ? scrapsCount + 1
              : scrapsCount - 1,
        }
      },
      [scraps, updating],
    )

  const scrape = useCallback(
    async ({ id, type }) => {
      if (typeof updating[id] !== 'undefined') {
        return
      }

      if (
        beforeScrapedChange &&
        beforeScrapedChange({ id, type }, true) === false
      ) {
        return
      }

      dispatch({ type: START_SCRAPE, id })

      const response = await nativeScrape({ id, type })

      if (response.ok) {
        notifyScraped(id)

        afterScrapedChange && afterScrapedChange({ id, type }, true)

        dispatch({ type: SCRAPE, id })
      } else {
        dispatch({ type: SCRAPE_FAILED, id })
      }
    },
    [updating, beforeScrapedChange, dispatch, afterScrapedChange],
  )

  const unscrape = useCallback(
    async ({ id, type }) => {
      if (typeof updating[id] !== 'undefined') {
        return
      }

      if (
        beforeScrapedChange &&
        beforeScrapedChange({ id, type }, false) === false
      ) {
        return
      }

      dispatch({ type: START_UNSCRAPE, id })

      const response = await nativeUnscrape({ id, type })

      if (response.ok) {
        notifyUnscraped(id)

        afterScrapedChange && afterScrapedChange({ id, type }, false)

        dispatch({ type: UNSCRAPE, id })
      } else {
        dispatch({ type: UNSCRAPE_FAILED, id })
      }
    },
    [updating, beforeScrapedChange, dispatch, afterScrapedChange],
  )

  useEffect(() => {
    if (hasParentContext) {
      return
    }

    const handleSubscribeEvent = ({
      scraped,
      id,
    }: {
      scraped: boolean
      id: string
    }) => dispatch({ type: scraped ? SCRAPE : UNSCRAPE, id })

    subscribeScrapedChangeEvent(handleSubscribeEvent)

    return () => unsubscribeScrapedChangeEvent(handleSubscribeEvent)
  }, [dispatch, hasParentContext])

  const value: ScrapsContextValue = useMemo(
    () => ({
      deriveCurrentStateAndCount,
      scrape,
      scrapeArticle: (id) => {
        if (process.env.NODE_ENV === 'development') {
          // TODO: development 환경에서만 기록하는 logger 만들기
          // eslint-disable-next-line no-console
          console.warn(
            'scrapeArticle is deprecated. Please use scrape instead.',
          )
        }
        return scrape({ id, type: 'article' })
      },
      scrapePoi: (id) => {
        if (process.env.NODE_ENV === 'development') {
          // TODO: development 환경에서만 기록하는 logger 만들기
          // eslint-disable-next-line no-console
          console.warn('scrapePoi is deprecated. Please use scrape instead.')
        }
        return scrape({ id, type: 'poi' })
      },
      scraps,
      unscrape,
      unscrapeArticle: (id) => {
        if (process.env.NODE_ENV === 'development') {
          // TODO: development 환경에서만 기록하는 logger 만들기
          // eslint-disable-next-line no-console
          console.warn(
            'unscrapeArticle is deprecated. Please use scrape instead.',
          )
        }
        return unscrape({ id, type: 'article' })
      },
      unscrapePoi: (id) => {
        if (process.env.NODE_ENV === 'development') {
          // TODO: development 환경에서만 기록하는 logger 만들기
          // eslint-disable-next-line no-console
          console.warn('unscrapePoi is deprecated. Please use scrape instead.')
        }
        return unscrape({ id, type: 'poi' })
      },
      enableTrackEvent,
    }),
    [deriveCurrentStateAndCount, enableTrackEvent, scrape, scraps, unscrape],
  )

  return (
    <ScrapsReducerContext.Provider value={scrapsReducer}>
      <ScrapsContext.Provider value={value}>{children}</ScrapsContext.Provider>
    </ScrapsReducerContext.Provider>
  )
}

export function useScrapsContext() {
  const context = useContext(ScrapsContext)

  if (context === undefined) {
    throw new Error('ScrapsProvider is not mounted')
  }

  const { isDefault, ...rest } = context

  if (isDefault && process.env.NODE_ENV === 'development') {
    // TODO: development 환경에서만 기록하는 logger 만들기
    // eslint-disable-next-line no-console
    console.error('ScrapsProvider를 찾을 수 없습니다.')
  }

  return rest
}

export interface WithScrapsBaseProps {
  deriveCurrentScrapedStateAndCount: ScrapsContextValue['deriveCurrentStateAndCount']
  scraps: Scraps
  scrapActions: Omit<
    ScrapsContextValue,
    'deriveCurrentStateAndCount' | 'scraps'
  >
}

export function withScraps<P extends DeepPartial<WithScrapsBaseProps>>(
  Component: ComponentType<P>,
) {
  return function ScrapsComponent(props: Omit<P, keyof WithScrapsBaseProps>) {
    const { deriveCurrentStateAndCount, scraps, ...actions } =
      useScrapsContext()

    return (
      <Component
        {...({
          ...props,
          deriveCurrentScrapedStateAndCount: deriveCurrentStateAndCount,
          scraps,
          scrapActions: actions,
        } as P)}
      />
    )
  }
}
