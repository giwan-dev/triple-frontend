import {
  createContext,
  useContext,
  PropsWithChildren,
  useMemo,
  useCallback,
  ComponentType,
  useReducer,
  useEffect,
} from 'react'
import qs from 'qs'
import fetch from 'isomorphic-fetch'
import { ImageMeta } from '@titicaca/type-definitions'
import { DeepPartial } from 'utility-types'

import reducer, {
  loadImagesRequest,
  loadImagesSuccess,
  loadImagesFail,
  reinitializeImages,
} from './reducer'

interface ImagesContextValue {
  images: ImageMeta[]
  total: number
  loading: boolean
  actions: {
    fetch: (cb?: () => void) => Promise<void>
    reFetch: (cb?: () => void) => Promise<void>
    indexOf: (target: { id: string }) => Promise<number>
  }
}

interface ImagesProviderProps {
  fetchImages?: (
    target: { type: string; id: string },
    query: { from: number; size: number },
  ) => Promise<Response>
  source: {
    id: string
    type: 'attraction' | 'restaurant' | 'hotel'
  }
  images?: ImageMeta[]
  total?: number
}

const ImagesContext = createContext<ImagesContextValue>({
  images: [],
  total: 0,
  loading: false,
  actions: {
    fetch: () => Promise.resolve(),
    reFetch: () => Promise.resolve(),
    indexOf: () => Promise.resolve(-1),
  },
})

const TYPE_MAPPING = {
  attraction: 'poi',
  restaurant: 'poi',
  hotel: 'hotel',
}

export function ImagesProvider({
  images: initialImages,
  total: initialTotal,
  fetchImages = defaultFetchImages,
  source: { id, type },
  children,
}: PropsWithChildren<ImagesProviderProps>) {
  const [{ loading, images, total, hasMore }, dispatch] = useReducer(reducer, {
    loading: !initialImages,
    images: initialImages || [],
    total: initialTotal || 0,
    hasMore: true,
  })

  const sendFetchRequest = useCallback(
    async (size = 15) => {
      const response = await fetchImages(
        { type: TYPE_MAPPING[type] || type, id },
        { from: images.length, size },
      )

      if (response.ok) {
        const result = await response.json()

        return result
      }

      return {}
    },
    [fetchImages, id, images.length, type],
  )

  const reFetch = useCallback(async () => {
    if (loading) {
      return
    }

    dispatch(loadImagesRequest())

    try {
      const response = await fetchImages(
        { type: TYPE_MAPPING[type] || type, id },
        { from: 0, size: 15 },
      )

      if (response.ok) {
        const { data: fetchedImages, total } = await response.json()
        dispatch(
          reinitializeImages({
            images: fetchedImages,
            total,
          }),
        )
      }
    } catch (error) {
      dispatch(loadImagesFail(error))
    }
  }, [loading, fetchImages, id, type])

  const fetch = useCallback(
    async (onFetchAfter?: () => void, force?: boolean) => {
      if (!force && (loading || !hasMore)) {
        return
      }

      dispatch(loadImagesRequest())

      try {
        const { data: fetchedImages, total } = await sendFetchRequest()

        if (fetchedImages) {
          dispatch(loadImagesSuccess({ images: fetchedImages, total }))
        } else {
          throw new Error('Response has no data property')
        }
      } catch (error) {
        dispatch(loadImagesFail(error))
      }

      onFetchAfter && onFetchAfter()
    },
    [hasMore, loading, sendFetchRequest],
  )

  const indexOf = useCallback(
    async ({ id: targetId }: { id: string }) => {
      const index = images.findIndex(({ id }) => id === targetId)
      if (index >= 0) {
        return index
      }

      // Just fetch 30 more images to check index of clicked image.
      // Ignore the case of unfindable image in these 45(15 + 30) images.
      const { data: fetchedImages } = await sendFetchRequest(30)

      return fetchedImages
        ? [...images, ...fetchedImages].findIndex(({ id }) => id === targetId)
        : -1
    },
    [images, sendFetchRequest],
  )

  useEffect(() => {
    fetch(undefined, true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({
      images,
      total,
      actions: {
        fetch,
        reFetch,
        indexOf,
      },
      loading,
    }),
    [fetch, images, indexOf, total, loading, reFetch],
  )

  return (
    <ImagesContext.Provider value={value}>{children}</ImagesContext.Provider>
  )
}

async function defaultFetchImages(
  target: { type: string; id: string },
  query: { from: number; size: number },
): Promise<Response> {
  const querystring = qs.stringify({
    resourceType: target.type,
    resourceId: target.id,
    from: query.from,
    size: query.size,
  })

  return fetch(`/api/content/images?${querystring}`)
}

export function useImagesContext() {
  const context = useContext(ImagesContext)

  if (context === undefined) {
    throw new Error('ImagesProvider is not mounted')
  }

  return context
}

export interface WithImagesBaseProps {
  images: ImagesContextValue['images']
  totalImagesCount: ImagesContextValue['total']
  imagesActions: ImagesContextValue['actions']
}

export function withImages<P extends DeepPartial<WithImagesBaseProps>>(
  Component: ComponentType<P>,
) {
  return function ImagesComponent(
    props: Omit<P, 'images' | 'totalImagesCount' | 'imagesActions'>,
  ) {
    return (
      <ImagesContext.Consumer>
        {({ images, total, actions }) => {
          return (
            <Component
              {...({
                ...props,
                images,
                totalImagesCount: total,
                imagesActions: actions,
              } as P)}
            />
          )
        }}
      </ImagesContext.Consumer>
    )
  }
}
