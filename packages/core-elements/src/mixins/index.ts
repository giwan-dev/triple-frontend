import { css } from 'styled-components'
import { MarginPadding } from './../commons'

export * from './text-style'

const unit = (value: number | string, suffix = 'px') =>
  typeof value === 'string' ? value : value !== 0 ? `${value}${suffix}` : value

export function formatMarginPadding(
  marginPadding: MarginPadding | undefined,
  key: 'margin' | 'padding',
) {
  if (!marginPadding) {
    return ''
  }

  return css`
    ${key}: ${unit(marginPadding.top || 0)} ${unit(marginPadding.right || 0)}
      ${unit(marginPadding.bottom || 0)} ${unit(marginPadding.left || 0)};
  `
}

export const marginMixin = css<{ margin?: MarginPadding }>`
  ${({ margin }) => formatMarginPadding(margin, 'margin')}
`

export const paddingMixin = css<{ padding?: MarginPadding }>`
  ${({ padding }) => formatMarginPadding(padding, 'padding')}
`
