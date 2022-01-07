import React from 'react'
import renderer, { ReactTestRendererJSON } from 'react-test-renderer'

import Section from './section'

import 'jest-styled-components'

it('should render null if children is empty', () => {
  const tree = renderer.create(<Section />).toJSON()

  expect(tree).toBeNull()
})

it('should accept anchor prop', () => {
  const tree = renderer
    .create(<Section anchor="anchorValue">Sectioon</Section>)
    .toJSON()

  expect(tree).toHaveProperty('props.id', 'anchorValue')
})

it('should show top divider', () => {
  const tree = renderer
    .create(<Section divider="top">Section</Section>)
    .toJSON()

  expect(tree).toHaveLength(2)
  expect((tree as ReactTestRendererJSON[])[0].children).toBeNull()
  expect((tree as ReactTestRendererJSON[])[1].children).toContain('Section')
})

it('should show bottom divider', () => {
  const tree = renderer
    .create(<Section divider="bottom">Section</Section>)
    .toJSON()

  expect(tree).toHaveLength(2)
  expect((tree as ReactTestRendererJSON[])[0].children).toContain('Section')
  expect((tree as ReactTestRendererJSON[])[1].children).toBeNull()
})

// it('should override style with css prop', () => {
//   const tree = renderer
//     .create(
//       <Section position="absolute" css={{ position: 'fixed' }}>
//         Section
//       </Section>,
//     )
//     .toJSON()

//   expect(tree).toHaveStyleRule('position', 'fixed')
// })
