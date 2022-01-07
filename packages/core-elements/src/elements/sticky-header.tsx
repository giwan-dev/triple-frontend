import React from 'react'
import styled from 'styled-components'

import { layeringMixin, LayeringMixinProps } from '../mixins'

import Container from './container'

const StyledContainer = styled(Container)`
  position: sticky;
  top: 0;
  ${layeringMixin(0)}
`

export type StickyHeaderProps = React.PropsWithChildren<LayeringMixinProps>

function StickyHeader({
  zIndex = 3,
  zTier,
  children,
  ...props
}: StickyHeaderProps) {
  return (
    <StyledContainer as="header" zIndex={zIndex} zTier={zTier} {...props}>
      {children}
    </StyledContainer>
  )
}

export default StickyHeader
