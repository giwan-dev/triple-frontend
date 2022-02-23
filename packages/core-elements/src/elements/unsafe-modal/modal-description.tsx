import * as DialogPrimitive from '@radix-ui/react-dialog'

import Text, { TextProps } from '../text'

export function ModalDescription({ children }: Pick<TextProps, 'children'>) {
  return (
    <DialogPrimitive.Description asChild>
      <Text center size="large" lineHeight={1.38} color="gray">
        {children}
      </Text>
    </DialogPrimitive.Description>
  )
}
