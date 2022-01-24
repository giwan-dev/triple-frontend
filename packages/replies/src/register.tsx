import React, {
  Dispatch,
  ForwardedRef,
  forwardRef,
  SetStateAction,
} from 'react'
import styled from 'styled-components'
import { Container, FlexBox, HR1 } from '@titicaca/core-elements'

import { authorMessage } from './replies-api-clients'
import AutoResizingTextarea, { TextAreaHandle } from './auto-resizing-textarea'
import { useRepliesContext } from './context'
import { ResourceType, Reply } from './types'
import { checkUniqueReply } from './utils'

const RegisterButton = styled.button`
  width: 26px;
  padding: 0;
  margin-left: 20px;
  line-height: 1.2;
  font-size: 15px;
  font-weight: bold;
  color: ${(props) =>
    props.disabled ? 'var(--color-blue500)' : 'var(--color-blue)'};
  background: inherit;
  border: none;
  outline: none;
  cursor: pointer;
`

function Register(
  {
    resourceId,
    resourceType,
    registerPlaceholder,
    onChangeReplies,
  }: {
    resourceId: string
    resourceType: ResourceType
    registerPlaceholder?: string
    onChangeReplies: Dispatch<
      SetStateAction<{ replies: Reply[]; page: number }>
    >
  },
  ref: ForwardedRef<TextAreaHandle>,
) {
  const {
    parentMessageId,
    currentMessageId,
    content: { plaintext, mentioningUserUid },
    initializeEditingMessage,
    handleContentChange,
  } = useRepliesContext()

  const handleReplyWriteUpdate = (response: Reply) => {
    if (mentioningUserUid) {
      onChangeReplies((prev) => {
        const parentReply = prev.replies.filter(
          (reply) => reply.id === parentMessageId,
        )
        const newChildReply = checkUniqueReply([
          ...(parentReply[0].children || []),
          response,
        ])

        parentReply[0].children = newChildReply
        parentReply[0].childrenCount += 1

        return {
          ...prev,
          replies: checkUniqueReply([...prev.replies, ...parentReply]),
        }
      })
    } else {
      onChangeReplies((prev) => ({
        ...prev,
        replies: checkUniqueReply([...prev.replies, response]),
      }))
    }
  }

  const handleReplyEditUpdate = (response: Reply) => {
    if (mentioningUserUid) {
      onChangeReplies((prev) => {
        const parentReply = prev.replies.filter(
          (reply) => reply.id === parentMessageId,
        )
        const newChildReply = checkUniqueReply([
          ...(parentReply[0].children || []),
          response,
        ])

        parentReply[0].children = newChildReply

        return {
          ...prev,
          replies: checkUniqueReply([...prev.replies, ...parentReply]),
        }
      })
    } else {
      onChangeReplies((prev) => ({
        ...prev,
        replies: checkUniqueReply([...prev.replies, response]),
      }))
    }
  }

  const handleRegister = async () => {
    if (!plaintext) {
      return
    }

    const { response, authoringRequestType } = (await authorMessage({
      resourceId,
      resourceType,
      currentMessageId,
      parentMessageId,
      content: plaintext,
      mentionedUserUid: mentioningUserUid,
    })) as { response: Reply; authoringRequestType: string }

    if (authoringRequestType === 'editReply') {
      handleReplyEditUpdate(response)
    } else {
      handleReplyWriteUpdate(response)
    }

    initializeEditingMessage()

    handleContentChange('')
  }

  return (
    <Container cursor="pointer">
      <HR1 margin={{ top: 0 }} />

      <FlexBox
        flex
        alignItems="flex-end"
        padding={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <AutoResizingTextarea
          placeholder={
            registerPlaceholder || '이 일정에 궁금한 점은 댓글로 써주세요.'
          }
          minRows={1}
          maxRows={4}
          value={plaintext || ''}
          onChange={handleContentChange}
          ref={ref}
        />

        <RegisterButton
          onClick={() => {
            handleRegister()
          }}
          disabled={!plaintext}
        >
          등록
        </RegisterButton>
      </FlexBox>

      <HR1 margin={{ top: 0 }} />
    </Container>
  )
}

export default forwardRef(Register)
