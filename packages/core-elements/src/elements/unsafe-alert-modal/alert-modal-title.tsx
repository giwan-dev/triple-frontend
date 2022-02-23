import { Title as PrimitiveTitle } from '@radix-ui/react-alert-dialog'

import Text, { TextProps } from '../text'

export function AlertModalTitle({ children }: Pick<TextProps, 'children'>) {
  return (
    <PrimitiveTitle asChild>
      <Text bold center size="big" color="gray" margin={{ bottom: 10 }}>
        {children}
      </Text>
    </PrimitiveTitle>
  )
}
