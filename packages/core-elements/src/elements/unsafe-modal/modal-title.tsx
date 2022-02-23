import * as DialogPrimitive from '@radix-ui/react-dialog'

import Text, { TextProps } from '../text'

export function ModalTitle({ children }: Pick<TextProps, 'children'>) {
  return (
    <DialogPrimitive.Title asChild>
      <Text bold center size="big" color="gray" margin={{ bottom: 10 }}>
        {children}
      </Text>
    </DialogPrimitive.Title>
  )
}
