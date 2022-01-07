import React from 'react'
import styled from 'styled-components'
import { Property } from 'csstype'
import { Color, getColor } from '@titicaca/color-palette'

import { BaseSizes, MarginPadding } from '../commons'
import {
  borderRadiusMixin,
  positioningMixin,
  shadowMixin,
  marginMixin,
  paddingMixin,
  centeredMixin,
  clearingMixin,
  horizontalScrollMixin,
} from '../mixins'

export type ContainerProps = React.PropsWithChildren<{
  position?: Property.Position
  textAlign?: Property.TextAlign
  whiteSpace?: Property.WhiteSpace
  userSelect?: Property.UserSelect
  display?: Property.Display
  cursor?: Property.Cursor
  width?: number | string
  height?: number | string
  minWidth?: number | string
  maxWidth?: number | string
  minHeight?: number | string
  maxHeight?: number | string

  margin?: MarginPadding
  padding?: MarginPadding
  positioning?: MarginPadding

  centered?: boolean
  borderRadius?: number
  clearing?: boolean
  floated?: Property.Float
  horizontalScroll?: boolean
  shadow?: BaseSizes
  backgroundColor?: Color
}>

const Container = styled.div<ContainerProps>(
  (props) => ({
    boxSizing: 'border-box',
    position: props.position,
    textAlign: props.textAlign,
    whiteSpace: props.whiteSpace,
    userSelect: props.userSelect,
    display: props.display,
    cursor: props.cursor,
    float: props.floated ?? 'none',
    width: props.width,
    height: props.height,
    minWidth: props.minWidth,
    maxWidth: props.maxWidth,
    minHeight: props.minHeight,
    maxHeight: props.maxHeight,
    backgroundColor: props.backgroundColor
      ? `rgba(${getColor(props.backgroundColor)})`
      : undefined,
  }),
  marginMixin,
  paddingMixin,
  centeredMixin,
  clearingMixin,
  horizontalScrollMixin,
  shadowMixin,
  positioningMixin,
  borderRadiusMixin,
)

export default Container
