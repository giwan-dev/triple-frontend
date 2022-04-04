import { createContext, useContext } from 'react'

import { LinkEventHandler } from '../types'

const LinkClickHandlerContext = createContext<LinkEventHandler | undefined>(
  undefined,
)

export const LinkClickHandlerProvider = LinkClickHandlerContext.Provider

export function useLinkClickHandler() {
  const context = useContext(LinkClickHandlerContext)

  if (context === undefined) {
    throw new Error('LinkClickHandlerProvider is not mounted')
  }

  return context
}
