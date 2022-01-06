import { VerificationRequest } from '@titicaca/user-verification'
import { Meta, StoryObj } from '@storybook/react'

import {
  envProviderDecorator,
  sessionContextProviderDecorator,
  userAgentProviderDecorator,
} from '../../decorators'

export default {
  title: 'user-verification / VerificationRequest',
  component: VerificationRequest,
  decorators: [
    userAgentProviderDecorator,
    envProviderDecorator,
    sessionContextProviderDecorator,
  ],
} as Meta

export const ExampleVerificationRequest: StoryObj = {
  storyName: '기본',
}
