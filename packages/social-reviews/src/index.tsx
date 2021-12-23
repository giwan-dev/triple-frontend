import React from 'react'
import {
  Section,
  Container,
  List,
  Text,
  Image,
  H1,
  H3,
} from '@titicaca/core-elements'
import {
  useEventTrackingContext,
  useUserAgentContext,
} from '@titicaca/react-contexts'
import { useI18n } from '@titicaca/i18n'
import { ExternalLink } from '@titicaca/router'

export interface SocialReview {
  imageUrl?: string
  publisher?: string
  title?: string
  url: string
}

export default function SocialReviews({
  placeholderImageUrl,
  socialReviews,
  ...props
}: {
  placeholderImageUrl?: string
  socialReviews?: SocialReview[]
} & Parameters<typeof Section>['0']) {
  const { trackSimpleEvent } = useEventTrackingContext()
  const { isPublic } = useUserAgentContext()
  const { t } = useI18n()

  if (!socialReviews || socialReviews.length === 0) {
    return null
  }

  return (
    <Section anchor="external-links" {...props}>
      <H1>{t('common:externalLinks', '소셜 리뷰')}</H1>
      <List divided clearing margin={{ top: 10 }}>
        {socialReviews.map(
          ({ imageUrl, publisher, title, url }: SocialReview, i) => (
            <List.Item key={`external-link-${i}`} minHeight={106}>
              <ExternalLink
                href={url}
                target={isPublic ? 'current' : 'new'}
                allowSource="all"
                title={title}
                onClick={() => {
                  trackSimpleEvent({ action: '소셜리뷰선택' })
                }}
              >
                <a>
                  <Container
                    floated="right"
                    width={60}
                    margin={{ left: 20 }}
                    padding={{ top: 20, bottom: 20 }}
                  >
                    <Image borderRadius={4}>
                      <Image.FixedRatioFrame frame="big">
                        <Image.Img src={imageUrl} alt={`${title} 썸네일`} />
                      </Image.FixedRatioFrame>
                    </Image>
                  </Container>

                  <Container padding={{ top: 20 }}>
                    <H3 maxLines={2}>{title}</H3>
                    <Text
                      size="small"
                      alpha={0.5}
                      margin={{ top: 8 }}
                      maxLines={1}
                    >
                      {publisher}
                    </Text>
                  </Container>
                </a>
              </ExternalLink>
            </List.Item>
          ),
        )}
      </List>
    </Section>
  )
}
