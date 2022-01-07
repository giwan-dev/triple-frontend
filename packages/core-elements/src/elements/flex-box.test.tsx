import React from 'react'
import renderer from 'react-test-renderer'

import FlexBox from './flex-box'

import 'jest-styled-components'

it('should accept style shortcut props', () => {
  const tree = renderer
    .create(
      <FlexBox
        flex
        flexGrow={1}
        flexShrink={1}
        flexBasis="auto"
        flexDirection="column"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        alignSelf="center"
        order={1}
      />,
    )
    .toJSON()

  expect(tree).toHaveStyleRule('display', 'flex')
  expect(tree).toHaveStyleRule('flex-grow', '1')
  expect(tree).toHaveStyleRule('flex-shrink', '1')
  expect(tree).toHaveStyleRule('flex-basis', 'auto')
  expect(tree).toHaveStyleRule('flex-direction', 'column')
  expect(tree).toHaveStyleRule('flex-wrap', 'wrap')
  expect(tree).toHaveStyleRule('justify-content', 'center')
  expect(tree).toHaveStyleRule('align-items', 'center')
  expect(tree).toHaveStyleRule('align-content', 'center')
  expect(tree).toHaveStyleRule('align-self', 'center')
  expect(tree).toHaveStyleRule('order', '1')
})

// it('should override style with css prop', () => {
//   const tree = renderer
//     .create(
//       <FlexBox justifyContent="center" css={{ justifyContent: 'flex-end' }} />,
//     )
//     .toJSON()

//   expect(tree).toHaveStyleRule('justify-content', 'flex-end')
// })
