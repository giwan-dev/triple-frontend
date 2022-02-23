import Container from '../container'

import { ModalDescription } from './modal-description'
import { ModalTitle } from './modal-title'

interface ModalBodyProps {
  title?: React.ReactText
  description?: React.ReactText
}

export function ModalBody({ title, description }: ModalBodyProps) {
  return (
    <Container padding={{ top: 40, bottom: 40, left: 30, right: 30 }}>
      {title ? <ModalTitle>{title}</ModalTitle> : null}
      {description ? <ModalDescription>{description}</ModalDescription> : null}
    </Container>
  )
}
