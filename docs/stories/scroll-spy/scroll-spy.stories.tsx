import { useState } from 'react'
import { ComponentStoryObj, Meta } from '@storybook/react'
import { ScrollSpyContainer, ScrollSpyEntity } from '@titicaca/scroll-spy'
import { PoiListElement } from '@titicaca/poi-list-elements'
import { ListingPoi } from '@titicaca/type-definitions'

import { eventMetadataDecorator } from '../../decorators'
import POIS from '../__mocks__/pois.sample.json'

function ScrollSpy() {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <ScrollSpyContainer
      activeId={activeId}
      scrollOffset={30}
      onChange={setActiveId}
    >
      {POIS.map((poi) => {
        const {
          source: { id },
        } = poi

        return (
          <ScrollSpyEntity key={id} id={id}>
            <div onClick={() => setActiveId(id)}>
              <PoiListElement as="div" poi={poi as unknown as ListingPoi} />
            </div>
          </ScrollSpyEntity>
        )
      })}
    </ScrollSpyContainer>
  )
}

export default {
  title: 'Scroll Spy',
  component: ScrollSpy,
  decorators: [eventMetadataDecorator],
} as Meta

export const BaseScrollSpy: ComponentStoryObj<typeof ScrollSpy> = {
  storyName: '기본 스크롤 스파이',
}
