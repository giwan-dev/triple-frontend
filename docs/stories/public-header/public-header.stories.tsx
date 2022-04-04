import { PublicHeader, PublicHeaderProps } from '@titicaca/public-header'
import { Meta, Story } from '@storybook/react'
import { EnvProvider } from '@titicaca/react-contexts'
import { TripleClientMetadataProvider } from '@titicaca/react-triple-client-interfaces'

import { eventMetadataDecorator } from '../../decorators'

export default {
  title: 'public-header / PublicHeader',
  component: PublicHeader,
  decorators: [eventMetadataDecorator],
  argTypes: {
    category: {
      control: { type: 'select' },
      options: ['air', 'hotels', 'tna'],
    },
  },
} as Meta

const Template: Story<PublicHeaderProps> = (args) => {
  return (
    <EnvProvider
      afOnelinkId=""
      afOnelinkPid=""
      afOnelinkSubdomain=""
      appUrlScheme=""
      defaultPageDescription=""
      defaultPageTitle=""
      facebookAppId=""
      webUrlBase=""
    >
      <TripleClientMetadataProvider
        {...TripleClientMetadataProvider.getInitialProps({})}
      >
        <PublicHeader {...args} />
      </TripleClientMetadataProvider>
    </EnvProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {
  deeplinkPath: 'https://triple.guide',
  category: undefined,
}

export const DisableAutoHide = Template.bind({})
DisableAutoHide.args = {
  ...Basic.args,
  disableAutoHide: true,
}
