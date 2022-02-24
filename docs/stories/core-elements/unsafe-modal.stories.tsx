import { ComponentMeta, ComponentStoryFn } from '@storybook/react'
import { UnsafeModal } from '@titicaca/core-elements'

export default {
  title: 'core-elements / UnsafeModal',
  component: UnsafeModal,
  subcomponents: {
    body: UnsafeModal.Body,
    content: UnsafeModal.Content,
    description: UnsafeModal.Description,
    title: UnsafeModal.Title,
    trigger: UnsafeModal.Trigger,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 1200, height: 800 }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof UnsafeModal>

export const Basic: ComponentStoryFn<typeof UnsafeModal> = () => {
  return (
    <UnsafeModal defaultOpen>
      <UnsafeModal.Trigger>Modal 열기</UnsafeModal.Trigger>
      <UnsafeModal.Content>
        <UnsafeModal.Body title="Modal title" description="Modal description" />
      </UnsafeModal.Content>
    </UnsafeModal>
  )
}
