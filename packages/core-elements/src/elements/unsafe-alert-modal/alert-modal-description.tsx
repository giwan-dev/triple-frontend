import { Description as PrimitiveDescription } from '@radix-ui/react-alert-dialog'

import Text, { TextProps } from '../text'

export function AlertModalDescription({
  children,
}: Pick<TextProps, 'children'>) {
  return (
    <PrimitiveDescription asChild>
      <Text center size="large" lineHeight={1.38} color="gray">
        {children}
      </Text>
    </PrimitiveDescription>
  )
}
