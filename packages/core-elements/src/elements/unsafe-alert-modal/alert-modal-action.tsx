import React from 'react'
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
  color: #368fff;
`

interface Props {
  children?: React.ReactNode
}

export function AlertModalAction({ children }: Props) {
  return (
    <AlertDialogPrimitive.Action asChild>
      {/* BaseButton? */}
      <StyledButton type="button">{children}</StyledButton>
    </AlertDialogPrimitive.Action>
  )
}
