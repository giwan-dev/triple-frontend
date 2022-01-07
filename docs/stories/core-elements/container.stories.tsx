import { Container } from '@titicaca/core-elements'
import { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Core-Elements / Container',
  component: Container,
} as Meta

export const Basic: StoryObj = {
  args: {
    children: 'Basic Container',
  },
}
