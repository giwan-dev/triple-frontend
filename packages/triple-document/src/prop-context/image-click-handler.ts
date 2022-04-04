import { createContext, useContext } from 'react'

import { ImageEventHandler } from '../types'

const ImageClickHandlerContext = createContext<ImageEventHandler | undefined>(
  undefined,
)

export const ImageClickHandlerProvider = ImageClickHandlerContext.Provider

export function useImageClickHandler() {
  const context = useContext(ImageClickHandlerContext)

  if (context === undefined) {
    throw new Error('ImageClickHandlerProvider is not mounted')
  }

  return context
}
