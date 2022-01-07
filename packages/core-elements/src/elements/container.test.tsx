import React from 'react'
import renderer from 'react-test-renderer'

import Container from './container'

import 'jest-styled-components'

it('should have default styles', () => {
  const tree = renderer.create(<Container />).toJSON()

  expect(tree).toHaveStyleRule('box-sizing', 'border-box')
})

it('should accept style shortcut props', () => {
  const tree = renderer
    .create(
      <Container
        position="absolute"
        textAlign="center"
        whiteSpace="pre"
        userSelect="none"
        display="inline-block"
        cursor="pointer"
        floated="none"
        backgroundColor="white"
      />,
    )
    .toJSON()

  expect(tree).toHaveStyleRule('position', 'absolute')
  expect(tree).toHaveStyleRule('text-align', 'center')
  expect(tree).toHaveStyleRule('white-space', 'pre')
  expect(tree).toHaveStyleRule('user-select', 'none')
  expect(tree).toHaveStyleRule('display', 'inline-block')
  expect(tree).toHaveStyleRule('cursor', 'pointer')
  expect(tree).toHaveStyleRule('float', 'none')
  expect(tree).toHaveStyleRule('background-color', 'rgba(255,255,255,1)')
})

it('should accept spacing props', () => {
  const tree = renderer
    .create(
      <Container
        margin={{ top: 10, right: 20, bottom: 30, left: 40 }}
        padding={{ top: 50, right: 60, bottom: 70, left: 80 }}
      />,
    )
    .toJSON()

  expect(tree).toHaveStyleRule('margin', '10px 20px 30px 40px')
  expect(tree).toHaveStyleRule('padding', '50px 60px 70px 80px')
})

it('should accept sizing props', () => {
  const tree = renderer
    .create(
      <Container
        width={10}
        height={20}
        minWidth={30}
        minHeight={40}
        maxWidth={50}
        maxHeight={60}
      />,
    )
    .toJSON()

  expect(tree).toHaveStyleRule('width', '10px')
  expect(tree).toHaveStyleRule('height', '20px')
  expect(tree).toHaveStyleRule('min-width', '30px')
  expect(tree).toHaveStyleRule('min-height', '40px')
  expect(tree).toHaveStyleRule('max-width', '50px')
  expect(tree).toHaveStyleRule('max-height', '60px')
})

it('should accept centered mixin', () => {
  const tree = renderer.create(<Container centered />).toJSON()

  expect(tree).toHaveStyleRule('margin-left', 'auto')
  expect(tree).toHaveStyleRule('margin-right', 'auto')
})

it('should accept borderRadius mixin', () => {
  const tree = renderer.create(<Container borderRadius={10} />).toJSON()

  expect(tree).toHaveStyleRule('border-radius', '10px')
})

it('should accept clearing mixin', () => {
  const tree = renderer.create(<Container clearing />).toJSON()

  expect(tree).toHaveStyleRule('content', "''", { modifier: '::after' })
  expect(tree).toHaveStyleRule('display', 'block', { modifier: '::after' })
  expect(tree).toHaveStyleRule('clear', 'both', { modifier: '::after' })
})

it('should accept horizontalScroll mixin', () => {
  const tree = renderer.create(<Container horizontalScroll />).toJSON()

  expect(tree).toHaveStyleRule('white-space', 'nowrap')
  expect(tree).toHaveStyleRule('overflow-x', 'auto')
  expect(tree).toHaveStyleRule('overflow-y', 'hidden')
})

it('should accept shadow mixin', () => {
  const tree = renderer.create(<Container shadow="large" />).toJSON()

  expect(tree).toHaveStyleRule('box-shadow', '0 0 30px 0 rgba(0,0,0,0.1)')
})

// it('should override style with css prop', () => {
//   const tree = renderer
//     .create(<Container position="absolute" css={{ position: 'fixed' }} />)
//     .toJSON()

//   expect(tree).toHaveStyleRule('position', 'fixed')
// })
