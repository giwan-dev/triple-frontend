import React from 'react'
import styled from 'styled-components'
import { brightGray } from '@titicaca/color-palette'

import { useContentAbsolute } from './fixed-ratio-frame'

const Placeholder = styled.div<{
  src: string
  absolute: boolean
}>`
  width: 100%;
  height: 100%;
  background-color: ${brightGray};
  background-repeat: no-repeat;
  background-position: center;
  background-size: 40px 40px;
  background-image: url(${({ src }) => src});

  ${({ absolute }) =>
    absolute
      ? `
  position: absolute;
  top: 0;
  left: 0;
`
      : ''}
`

export default function ImagePlaceholder({ src }: { src: string }) {
  const absolute = useContentAbsolute()

  return <Placeholder src={src} absolute={absolute} />
}
