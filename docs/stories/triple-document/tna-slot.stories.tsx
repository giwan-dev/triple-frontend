import React from 'react'
import { Meta } from '@storybook/react'
import { ELEMENTS, Slot } from '@titicaca/triple-document'

import {
  sessionContextProviderDecorator,
  userAgentProviderDecorator,
} from '../../decorators'
import SLOTS from '../__mocks__/slots.sample.json'

const { tnaProducts: TNAProducts } = ELEMENTS

export default {
  title: 'triple-document / T&A Slot',
  component: TNAProducts,
  decorators: [sessionContextProviderDecorator, userAgentProviderDecorator],
} as Meta

export function InTripleDocument() {
  return (
    <TNAProducts
      value={{
        slotId: 1546,
      }}
    />
  )
}
InTripleDocument.storyName = 'Triple-document에 포함된 Slot'

export function Slots() {
  return SLOTS.map((slot, i) => (
    <Slot key={i} id={slot.id} title={slot.title} products={slot.products} />
  ))
}

Slots.storyName = 'Slots'
