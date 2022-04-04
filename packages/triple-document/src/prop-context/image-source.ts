import { createContext, useContext } from 'react'
import { ImageSourceType } from '@titicaca/core-elements'

const ImageSourceContext = createContext<ImageSourceType | undefined>(undefined)

export const ImageSourceProvider = ImageSourceContext.Provider

export function useImageSource() {
  const context = useContext(ImageSourceContext)

  if (context === undefined) {
    throw new Error('ImageSourceProvider is not mounted')
  }

  return context
}
