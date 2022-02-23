import styled from 'styled-components'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

import Container from '../container'

import { AlertModalDescription } from './alert-modal-description'
import { AlertModalTitle } from './alert-modal-title'

const Actions = styled.div`
  display: flex;
  height: 50px;
  border-top-style: solid;
  border-width: 1px;
  border-color: #f5f5f5;
`

const ActionSeparator = styled(SeparatorPrimitive.Root)`
  background-color: #f5f5f5;
  width: 1px;
  height: 100%;
`

interface ModalBodyProps {
  title?: React.ReactText
  description?: React.ReactText
  cancel?: React.ReactNode
  confirm?: React.ReactNode
}

export function AlertModalBody({
  title,
  description,
  cancel,
  confirm,
}: ModalBodyProps) {
  return (
    <>
      <Container padding={{ top: 40, bottom: 40, left: 30, right: 30 }}>
        {title ? <AlertModalTitle>{title}</AlertModalTitle> : null}
        {description ? (
          <AlertModalDescription>{description}</AlertModalDescription>
        ) : null}
      </Container>
      {cancel || confirm ? (
        <Actions>
          {cancel || null}
          {cancel && confirm && (
            <ActionSeparator orientation="vertical" decorative />
          )}
          {confirm || null}
        </Actions>
      ) : null}
    </>
  )
}
