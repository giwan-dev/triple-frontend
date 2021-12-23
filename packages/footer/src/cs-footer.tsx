import * as React from 'react'
import qs from 'qs'
import styled from 'styled-components'
import { Button, Container, Text } from '@titicaca/core-elements'
import { useHistoryFunctions, useEnv } from '@titicaca/react-contexts'

const SupportContainer = styled.footer`
  background-color: #f5f5f5;
  height: 311px;
  padding: 32px 30px 0 30px;
`

/**
 * @deprecated
 * https://triple.guide/cs-bridge/entry 트리플 고객센터를 이용해주세요.
 */
export default function CSFooter({
  service,
  type,
  identifier,
  csTime,
  csMessage,
  data,
  showCSButton = true,
  onFAQButtonClick = () => {},
  onCSButtonClick = () => {},
}: {
  service: string
  type?: string
  identifier?: string
  csTime: string
  csMessage?: string
  data?: { [key: string]: string | number | boolean | undefined }
  showCSButton?: boolean
  onFAQButtonClick?: () => void
  onCSButtonClick?: () => void
}) {
  const { appUrlScheme } = useEnv()
  const { navigate } = useHistoryFunctions()

  const movetoFAQ = () => {
    onFAQButtonClick()

    navigate(
      `${appUrlScheme}:///outlink?${qs.stringify({
        url: 'https://triple.oc.toast.com/triple/hc/mobile/article/',
        target: 'browser',
      })}`,
    )
  }

  const moveToCsInquiry = React.useCallback(async () => {
    onCSButtonClick()

    const response = await fetch('/api/users/me', {
      credentials: 'same-origin',
    })

    if (response.ok) {
      const { uid } = await response.json()

      const query = qs.stringify({
        service,
        identifier,
        type,
        data: {
          uid,
          ...data,
        },
      })

      navigate(
        `${appUrlScheme}:///inlink?path=${encodeURIComponent(
          `/cs-bridge/outlink?${query}`,
        )}`,
      )
    }
  }, [appUrlScheme, data, identifier, navigate, onCSButtonClick, service, type])

  return (
    <SupportContainer>
      <Container>
        <Text bold color="gray" size="huge">
          도움이 필요하신가요?
        </Text>
        <Text
          bold
          color="blue"
          size="huge"
          margin={{ bottom: 20 }}
          onClick={() => {
            window.location.href = 'tel:1588-2539'
          }}
        >
          1588-2539
        </Text>
        <Text
          size="small"
          color="gray"
          bold
          lineHeight={1.69}
          alpha={0.8}
          margin={{ bottom: 3 }}
        >
          해외에서 +82-2-1588-2539
          <br />
          {csTime}
        </Text>

        {csMessage ? (
          <Text lineHeight={1.54} color="gray" alpha={0.4} size="tiny">
            {csMessage}
          </Text>
        ) : null}

        <Button.Group
          margin={{ top: 20 }}
          horizontalGap={7}
          buttonCount={showCSButton ? 2 : 1}
        >
          <Button basic color="gray" onClick={movetoFAQ}>
            자주 묻는 질문
          </Button>
          {showCSButton ? (
            <Button basic color="gray" onClick={moveToCsInquiry}>
              1:1 문의
            </Button>
          ) : null}
        </Button.Group>
      </Container>
    </SupportContainer>
  )
}
