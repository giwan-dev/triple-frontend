import { ComponentMeta, ComponentStoryFn } from '@storybook/react'
import { UnsafeAlertModal } from '@titicaca/core-elements'

export default {
  title: 'core-elements / UnsafeAlertModal',
  component: UnsafeAlertModal,
  subcomponents: {
    body: UnsafeAlertModal.Body,
    content: UnsafeAlertModal.Content,
    description: UnsafeAlertModal.Description,
    title: UnsafeAlertModal.Title,
    trigger: UnsafeAlertModal.Trigger,
  },
} as ComponentMeta<typeof UnsafeAlertModal>

export const Alert: ComponentStoryFn<typeof UnsafeAlertModal> = () => {
  return (
    <UnsafeAlertModal defaultOpen>
      <UnsafeAlertModal.Trigger>
        <button>AlertModal 열기</button>
      </UnsafeAlertModal.Trigger>
      <UnsafeAlertModal.Content>
        <UnsafeAlertModal.Body
          description="삭제하겠습니까? 삭제하면 적립된 리뷰 포인트도 함께 사라집니다."
          cancel={<UnsafeAlertModal.Cancel>취소</UnsafeAlertModal.Cancel>}
          confirm={<UnsafeAlertModal.Action>확인</UnsafeAlertModal.Action>}
        />
      </UnsafeAlertModal.Content>
    </UnsafeAlertModal>
  )
}

export const Confirm: ComponentStoryFn<typeof UnsafeAlertModal> = () => {
  return (
    <UnsafeAlertModal defaultOpen>
      <UnsafeAlertModal.Trigger>
        <button>AlertModal 열기</button>
      </UnsafeAlertModal.Trigger>
      <UnsafeAlertModal.Content>
        <UnsafeAlertModal.Body
          title={`장애공지\n타이틀이 두줄일수도`}
          description="실시간 객실정보가 변경되어 안내드려요."
          confirm={<UnsafeAlertModal.Action>확인</UnsafeAlertModal.Action>}
        />
      </UnsafeAlertModal.Content>
    </UnsafeAlertModal>
  )
}
