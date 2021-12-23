import React from 'react'
import {
  TransitionModal,
  TransitionType,
  useTransitionModal,
} from '@titicaca/modals'
import { select } from '@storybook/addon-knobs'

import {
  historyProviderDecorator,
  sessionContextProviderDecorator,
} from '../../decorators'

export default {
  title: 'modals / TransitionModal',
  decorators: [sessionContextProviderDecorator],
}

export function BaseTransitionModal() {
  return (
    <div>
      <UriHashHistoryManipulator
        uriHash={select(
          'Hash',
          Object.keys(TransitionType).map(
            (key) => TransitionType[key as keyof typeof TransitionType],
          ),
          TransitionType.General,
        )}
      />
      <TransitionModal deepLink="" />
    </div>
  )
}

BaseTransitionModal.storyName = 'TransitionModal'
BaseTransitionModal.decorators = [historyProviderDecorator]

function UriHashHistoryManipulator({ uriHash }: { uriHash: string }) {
  const { show } = useTransitionModal()

  return (
    <button onClick={() => uriHash && show(uriHash as TransitionType)}>
      Show [{uriHash}] type
    </button>
  )
}
