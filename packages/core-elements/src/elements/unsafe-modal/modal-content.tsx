import styled from 'styled-components'
import * as DialogPrimitive from '@radix-ui/react-dialog'

const StyledOverlay = styled(DialogPrimitive.Overlay)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(58, 58, 58, 0.5);
`

const StyledContent = styled(DialogPrimitive.Content)<{ $width: number }>`
  position: fixed;
  top: 50%;
  left: 50%;
  width: ${({ $width }) => `${$width}px`};
  transform: translate(-50%, -50%);
  border-radius: 6px;
  background-color: #fff;
  user-select: none;
`

interface ModalContentProps {
  children?: React.ReactNode
  width?: number
}

export function ModalContent({
  children,
  width = 295,
  ...props
}: ModalContentProps) {
  return (
    <DialogPrimitive.Portal>
      <StyledOverlay />
      <StyledContent {...props} $width={width}>
        {children}
      </StyledContent>
    </DialogPrimitive.Portal>
  )
}
