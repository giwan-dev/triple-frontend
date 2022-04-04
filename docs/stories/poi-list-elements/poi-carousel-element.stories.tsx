import { PoiCarouselElement } from '@titicaca/poi-list-elements'
import { ComponentStoryObj, Meta } from '@storybook/react'

import POIS from '../__mocks__/pois.sample.json'
import { eventMetadataDecorator } from '../../decorators'

export default {
  title: 'poi-list-elements / PoiCarouselElement',
  component: PoiCarouselElement,
  decorators: [eventMetadataDecorator],
} as Meta

const [POI] = POIS

export const TripleDocument: ComponentStoryObj<typeof PoiCarouselElement> = {
  args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    poi: POI as any,
    titleTopSpacing: 10,
  },
}
