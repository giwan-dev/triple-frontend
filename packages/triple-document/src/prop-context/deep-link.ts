import { createContext, useContext } from 'react'

const DeepLinkContext = createContext<string | undefined>(undefined)

export const DeepLinkProvider = DeepLinkContext.Provider

export function useDeepLink() {
  const context = useContext(DeepLinkContext)

  if (context === undefined) {
    throw new Error('DeepLinkProvider is not mounted')
  }

  return context
}
