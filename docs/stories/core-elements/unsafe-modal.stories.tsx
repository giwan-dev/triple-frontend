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
} as ComponentMeta<typeof UnsafeModal>

export const Basic: ComponentStoryFn<typeof UnsafeModal> = () => {
  return (
    <UnsafeModal defaultOpen>
      <UnsafeModal.Trigger>
        <button>Modal 열기</button>
      </UnsafeModal.Trigger>
      <UnsafeModal.Content>
        <UnsafeModal.Body title="Modal title" description="Modal description" />
      </UnsafeModal.Content>
    </UnsafeModal>
  )
}
