import { createContext, PropsWithChildren, useContext } from 'react'

import { useEventTrackingContext } from './event-tracking-context'
import {
  FirebaseAnalyticsParams,
  GoogleAnalyticsParams,
  PixelParams,
} from './types'

interface EventMetadataContextValue {
  [key: string]: string
}

const EventMetadataContext = createContext<
  EventMetadataContextValue | undefined
>(undefined)

export function EventMetadataProvider({
  children,
  eventMetadataContext,
}: PropsWithChildren<{ eventMetadataContext?: EventMetadataContextValue }>) {
  const parentEventMetadataContext = useContext(EventMetadataContext)

  return (
    <EventMetadataContext.Provider
      value={{ ...parentEventMetadataContext, ...eventMetadataContext }}
    >
      {children}
    </EventMetadataContext.Provider>
  )
}

function useEventMetadataContext() {
  const context = useContext(EventMetadataContext)

  if (context === undefined) {
    throw new Error('EventMetadataProvider is not mounted')
  }

  return context
}

export function useEventTrackerWithMetadata() {
  const { trackEvent } = useEventTrackingContext()
  const eventMetadata = useEventMetadataContext()

  return (params: {
    ga?: GoogleAnalyticsParams
    fa?: Partial<FirebaseAnalyticsParams>
    pixel?: PixelParams
  }) => {
    trackEvent({
      ga: getGoogleAnalyticsWithMetadata(params.ga, eventMetadata),
      fa: getFirebaseAnalyticsWithMetadata(params.fa, eventMetadata),
      pixel: getPixelWithMetadata(params.pixel, eventMetadata),
    })
  }
}

function getFirebaseAnalyticsWithMetadata(
  fa?: Partial<FirebaseAnalyticsParams>,
  eventMetaContext?: EventMetadataContextValue,
) {
  if (!fa) {
    return
  }

  return {
    ...eventMetaContext,
    ...fa,
  }
}

function getGoogleAnalyticsWithMetadata(
  ga?: GoogleAnalyticsParams,
  eventMetaContext?: EventMetadataContextValue,
) {
  if (!ga) {
    return
  }

  if (eventMetaContext) {
    const arrayOfContext = Object.values(eventMetaContext)
    const [action, label] = ga

    if (label) {
      return [action, [...arrayOfContext, label].join('_').substr(0, 150)]
    }
    return [action, [...arrayOfContext].join('_').substr(0, 150)]
  }

  return ga
}

function getPixelWithMetadata(
  pixel?: PixelParams,
  eventMetaContext?: EventMetadataContextValue,
) {
  if (!pixel) {
    return
  }

  const { payload } = pixel
  const payloadWithMetadata = { ...eventMetaContext, ...payload }
  return {
    ...pixel,
    payload: payloadWithMetadata,
  }
}
