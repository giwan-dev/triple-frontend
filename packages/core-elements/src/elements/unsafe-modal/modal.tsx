import * as DialogPrimitive from '@radix-ui/react-dialog'

import { ModalBody } from './modal-body'
import { ModalContent } from './modal-content'
import { ModalDescription } from './modal-description'
import { ModalTitle } from './modal-title'

const Modal = DialogPrimitive.Root
const ModalTrigger = DialogPrimitive.Trigger

type CompoundedModal = typeof Modal & {
  Body: typeof ModalBody
  Content: typeof ModalContent
  Description: typeof ModalDescription
  Title: typeof ModalTitle
  Trigger: typeof ModalTrigger
}
;(Modal as CompoundedModal).Body = ModalBody
;(Modal as CompoundedModal).Content = ModalContent
;(Modal as CompoundedModal).Description = ModalDescription
;(Modal as CompoundedModal).Title = ModalTitle
;(Modal as CompoundedModal).Trigger = ModalTrigger

export default Modal as CompoundedModal
