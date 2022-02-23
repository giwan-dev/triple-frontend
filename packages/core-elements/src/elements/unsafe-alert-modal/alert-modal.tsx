import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import { AlertModalAction } from './alert-modal-action'
import { AlertModalBody } from './alert-modal-body'
import { AlertModalCancel } from './alert-modal-cancel'
import { AlertModalContent } from './alert-modal-content'
import { AlertModalDescription } from './alert-modal-description'
import { AlertModalTitle } from './alert-modal-title'

const AlertModal = AlertDialogPrimitive.Root
const AlertModalTrigger = AlertDialogPrimitive.Trigger

type CompoundedAlertModal = typeof AlertModal & {
  Action: typeof AlertModalAction
  Body: typeof AlertModalBody
  Cancel: typeof AlertModalCancel
  Content: typeof AlertModalContent
  Description: typeof AlertModalDescription
  Title: typeof AlertModalTitle
  Trigger: typeof AlertModalTrigger
}
;(AlertModal as CompoundedAlertModal).Action = AlertModalAction
;(AlertModal as CompoundedAlertModal).Body = AlertModalBody
;(AlertModal as CompoundedAlertModal).Cancel = AlertModalCancel
;(AlertModal as CompoundedAlertModal).Content = AlertModalContent
;(AlertModal as CompoundedAlertModal).Description = AlertModalDescription
;(AlertModal as CompoundedAlertModal).Title = AlertModalTitle
;(AlertModal as CompoundedAlertModal).Trigger = AlertModalTrigger

export default AlertModal as CompoundedAlertModal
