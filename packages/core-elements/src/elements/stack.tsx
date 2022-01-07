import React from 'react'
import styled, { css } from 'styled-components'

import Container, { ContainerProps } from './container'

const veritcalStyle = css`
  & > :first-child {
    margin-top: 0;
    padding-top: 0;
  }

  & > :last-child {
    margin-bottom: 0;
    padding-top: 0;
  }
`

const horizontalStyle = css`
  & > :first-child {
    margin-left: 0;
    padding-left: 0;
  }

  & > :last-child {
    margin-right: 0;
    padding-right: 0;
  }
`

const StyledContainer = styled(Container)<{ $horizontal?: boolean }>`
  ${({ $horizontal }) => ($horizontal ? horizontalStyle : veritcalStyle)}
`

export interface StackProps extends ContainerProps {
  vertical?: boolean
  horizontal?: boolean
}

/**
 * 나열형 컴포넌트의 상하, 좌우 여백을 리셋하기 위한 컴포넌트
 *
 * - 새로형
 * <Stack>...</Stack>
 * <Stack vertical>...</Stack>
 *
 * - 가로형
 * <Stack horizontal>...</Stack>
 */
function Stack({ children, horizontal, ...props }: StackProps) {
  return (
    <StyledContainer $horizontal={horizontal} {...props}>
      {children}
    </StyledContainer>
  )
}

export default Stack
