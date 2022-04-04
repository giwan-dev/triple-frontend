import { createContext, PropsWithChildren, useContext } from 'react'

export interface MediaConfig {
  videoAutoPlay?: boolean
  hideVideoControls?: boolean
  optimized?: boolean
}

const MediaConfigContext = createContext<MediaConfig>({})

export function MediaConfigProvider({
  children,
  ...mediaConfig
}: PropsWithChildren<MediaConfig>) {
  return (
    <MediaConfigContext.Provider value={mediaConfig}>
      {children}
    </MediaConfigContext.Provider>
  )
}

export function useMediaConfig() {
  const context = useContext(MediaConfigContext)

  if (context === undefined) {
    throw new Error('MediaConfigProvider is not mounted')
  }

  return context
}
