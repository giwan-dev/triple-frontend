import { ReactNode } from 'react'
import styled from 'styled-components'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

const StyledButton = styled.button`
  flex: 1;
  display: inline-block;
  white-space: nowrap;
  height: 50px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: rgba(58, 58, 58, 0.5);
`

interface Props {
  children?: ReactNode
}

export function AlertModalCancel({ children }: Props) {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      {/* BaseButton? */}
      <StyledButton type="button">{children}</StyledButton>
    </AlertDialogPrimitive.Cancel>
  )
}
