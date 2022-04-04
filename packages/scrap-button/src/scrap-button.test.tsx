import { render, screen } from '@testing-library/react'
import { ScrapsProvider, EventMetadataProvider } from '@titicaca/react-contexts'

import { OutlineScrapButton, OverlayScrapButton } from './scrap-button'

describe('ScrapButton', () => {
  it('should render successfully.', () => {
    const { unmount } = render(
      <ScrapsProvider>
        <OverlayScrapButton
          resource={{
            id: 'MOCK_RESOURCE_ID',
            type: 'MOCK_TYPE',
            scraped: false,
          }}
          size={36}
        />
      </ScrapsProvider>,
      { wrapper: EventMetadataProvider },
    )

    expect(screen.getByRole('button')).not.toBeFalsy()

    unmount()

    render(
      <ScrapsProvider>
        <OutlineScrapButton
          resource={{
            id: 'MOCK_RESOURCE_ID',
            type: 'MOCK_TYPE',
            scraped: false,
          }}
          size={36}
        />
      </ScrapsProvider>,
      { wrapper: EventMetadataProvider },
    )
    expect(screen.getByRole('button')).not.toBeFalsy()
  })
})
