import * as React from 'react'
import styled, { css } from 'styled-components'

import Text from './text'
import { withField } from '../utils/form-field'

type RadioValue = string | null

interface Option {
  text: string
  value: RadioValue
}

const RadioFrame = styled.div`
  position: relative;
  margin-bottom: 20px;
  line-height: 26px;
  padding-right: 26px;

  &:last-child {
    margin-bottom: 0;
  }
`

const RadioText = styled(Text)`
  width: 100%;
  vertical-align: middle;
`

const RadioInput = styled.input.attrs({ type: 'radio' })<{
  selected?: boolean
}>`
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  width: 26px;
  height: 26px;
  border: 0;
  padding: 0;
  background-size: 26px 26px;
  background-repeat: no-repeat;
  transition: all 0.3s ease;
  appearance: none;
  outline: none;

  ${({ selected }) =>
    selected
      ? css`
          opacity: 1;
          background-image: url('https://assets.triple.guide/images/btn-filter-radio-check.svg');
        `
      : css`
          opacity: 0.5;
          background-image: url('https://assets.triple.guide/images/btn-filter-radio.svg');
        `};
`

interface RadioProps {
  name?: string
  value?: RadioValue
  onChange?: (e: React.SyntheticEvent, value: RadioValue) => void
  options: Option[]
}

function Radio({ name, value, onChange, options }: RadioProps) {
  return (
    <>
      {options.map(({ text, value: optionValue }, idx) => (
        <RadioFrame
          key={idx}
          onClick={(e) => onChange && onChange(e, optionValue)}
        >
          <RadioText inlineBlock size="large" ellipsis>
            {text}
          </RadioText>

          <RadioInput name={name} selected={optionValue === value} />
        </RadioFrame>
      ))}
    </>
  )
}

export default withField(Radio)
