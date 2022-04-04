import { useContext } from 'react'

import { Context } from './my-reviews-context'

export default function useMyReviewsContext() {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('MyReviewsProvider is not mounted')
  }

  return context
}
