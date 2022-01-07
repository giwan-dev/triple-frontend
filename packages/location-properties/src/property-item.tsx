import React, { useCallback } from 'react'
import { List, Text, longClickable, FlexBox } from '@titicaca/core-elements'
import {
  useEventTrackingContext,
  useUserAgentContext,
  useHistoryFunctions,
} from '@titicaca/react-contexts'
import styled from 'styled-components'

export const ACTION_SHEET_PREFIX = 'location-properties.copy-action-sheet'

const TitleText = styled(Text)`
  flex-shrink: 1;
`

const ContentText = styled(Text)`
  flex: 1;
`

export interface PropertyItemProps {
  title: string
  value?: string
  singleLine?: boolean
  identifier: string
  eventActionFragment?: string
  onClick?: () => void
}

const LongClickableItemContainer = longClickable(FlexBox)

export default function PropertyItem({
  identifier,
  title,
  value,
  singleLine,
  onClick,
  eventActionFragment,
}: PropertyItemProps) {
  const { isPublic } = useUserAgentContext()

  const { push } = useHistoryFunctions()
  const { trackSimpleEvent } = useEventTrackingContext()

  const handleLongClick = useCallback(() => {
    if (eventActionFragment) {
      trackSimpleEvent({ action: `${eventActionFragment}_복사하기_실행` })
    }

    push(`${ACTION_SHEET_PREFIX}.${identifier}`)
  }, [push, identifier, trackSimpleEvent, eventActionFragment])

  return (
    <List.Item>
      <LongClickableItemContainer
        flex
        alignItems="flex-start"
        onLongClick={!isPublic ? handleLongClick : undefined}
        onClick={onClick}
      >
        <TitleText bold size="small" lineHeight={1.43}>
          {title}
        </TitleText>
        <ContentText
          size="small"
          alpha={0.7}
          ellipsis={singleLine}
          margin={{ left: 10 }}
          wordBreak="break-all"
          lineHeight={1.43}
        >
          {value}
        </ContentText>
      </LongClickableItemContainer>
    </List.Item>
  )
}
