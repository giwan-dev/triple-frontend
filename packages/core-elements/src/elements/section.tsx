import React from 'react'

import Container, { ContainerProps } from './container'
import { HR2 } from './hr'

export interface SectionProps extends ContainerProps {
  divider?: string
  anchor?: string
}

function Section({
  children,
  divider,
  anchor,
  minWidth = 320,
  maxWidth = 768,
  padding = { left: 30, right: 30 },
  ...props
}: SectionProps) {
  if (!children) {
    return null
  }

  return (
    <>
      {divider === 'top' && <HR2 compact />}
      <Container
        id={anchor}
        centered
        clearing
        minWidth={minWidth}
        maxWidth={maxWidth}
        padding={padding}
        position="relative"
        {...props}
      >
        {children}
      </Container>
      {divider === 'bottom' && <HR2 compact />}
    </>
  )
}

export default Section
