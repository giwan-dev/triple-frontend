import { OverlayScrapButton } from '@titicaca/scrap-button'
import { ScrapsProvider } from '@titicaca/react-contexts'
import { Meta, StoryObj } from '@storybook/react'

import { eventMetadataDecorator } from '../../decorators'

export default {
  title: 'ScrapButton / OverlayScrapButton',
  component: OverlayScrapButton,
  decorators: [
    (Story) => (
      <ScrapsProvider>
        <Story />
      </ScrapsProvider>
    ),
    eventMetadataDecorator,
  ],
} as Meta

export const Basic: StoryObj = {
  args: {
    resource: {
      id: 'scrapable_id',
      type: 'scrapable_type',
      scraped: false,
    },
    size: 36,
  },
}
