import { useEffect } from 'react'
import { Meta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import TripleDocument, { ELEMENTS } from '@titicaca/triple-document'
import { useScrollToAnchor } from '@titicaca/react-hooks'
import { TripleElementData } from '@titicaca/triple-document/src/types'

import SAMPLE from '../__mocks__/triple-document.sample.json'
import MOCK_REGIONS from '../__mocks__/triple-document.regions.json'
import MOCK_EMBEDDED from '../__mocks__/triple-document.embedded.json'
import MOCK_ITINERARY from '../__mocks__/triple-document.itinerary.json'
import {
  envProviderDecorator,
  eventMetadataDecorator,
  sessionContextProviderDecorator,
  tripleClientMetadataDecorator,
} from '../../decorators'

const {
  text: Text,
  note: Note,
  video: Video,
  table: Table,
  regions: Regions,
  embedded: Embedded,
  anchor: Anchor,
  itinerary: Itinerary,
} = ELEMENTS

export default {
  title: 'triple-document',
  decorators: [
    envProviderDecorator,
    sessionContextProviderDecorator,
    tripleClientMetadataDecorator,
    eventMetadataDecorator,
  ],
} as Meta

export function Sample() {
  return (
    <TripleDocument>
      {SAMPLE as TripleElementData<string, unknown>[]}
    </TripleDocument>
  )
}
Sample.storyName = '샘플'

export function TextExample() {
  return (
    <>
      <Text value={{ text: '텍스트: medium 16 80%' }} />
      <Text
        value={{
          rawHTML: '텍스트 <a href="/regions/:regionId">Inline link</a>',
        }}
        onLinkClick={action('onLinkClick')}
      />
      <Text bold value={{ text: '강조 텍스트: bold 16 100%' }} alpha={1} />
    </>
  )
}
TextExample.storyName = '텍스트'

export function NoteExample() {
  return (
    <Note
      value={{
        body: '목적지로 바로 가지 않고, 중간 지점에서 잠시 머무는 단기 체류를 뜻한다. 보통 경유 시간인 3-4시간 정도가 아니라 24시간 이상을 뜻하기 때문에 관광과 숙박이 가능한 것이 특징. 일부 항공사는 스탑오버시 무료 관광을 제공하니 참고할것!',
        title: '잠깐! 스탑오버(Stopover)란?',
      }}
    />
  )
}
NoteExample.storyName = '노트'

export function VideoExample() {
  return (
    <Video
      value={{
        provider: 'youtube',
        identifier: 'hYIe4VrfHoA',
      }}
    />
  )
}
VideoExample.storyName = '비디오'

export function TableExample() {
  return (
    <Table
      value={{
        table: {
          type: 'horizontal',
          head: [{ text: '취소 시점' }, { text: '취소 수수료' }],
          body: [
            [{ text: '구매 당일 (No-show 제외)' }, { text: '0원' }],
            [{ text: '구매 익일 ~ 출발 61일 전' }, { text: '1,000원' }],
            [{ text: '출발 60일 전 ~ 출발 31일 전' }, { text: '3,000원' }],
            [{ text: '출발 30일 전 ~ 출발 8일 전' }, { text: '4,000원' }],
            [{ text: '출발 7일 전 ~ 출발 2일 전' }, { text: '6,000원' }],
            [{ text: '출발 1일 전 ~ 출발시간 전' }, { text: '12,000원' }],
            [{ text: '출발시간 이후 (No-show)' }, { text: '15,000원' }],
          ],
        },
      }}
    />
  )
}
TableExample.storyName = '표'

export function Region() {
  return <Regions value={{ regions: MOCK_REGIONS }} />
}
Region.storyName = '리전'

export function EmbeddedExample() {
  return <Embedded value={MOCK_EMBEDDED} />
}
EmbeddedExample.storyName = '임베딩'

export function AnchorExample() {
  useEffect(() => {
    window.history.pushState(null, '', '#android')
  }, [])

  useScrollToAnchor({ delayTime: 0 })

  return (
    <div>
      <div style={{ height: '200vh' }} />
      <div>Android</div>
      <Anchor value={{ href: 'android' }} />
      <div style={{ height: '200vh' }} />
      <div>ios</div>
      <Anchor value={{ href: 'ios' }} />
    </div>
  )
}
AnchorExample.storyName = 'Anchor'

export function DocumentItinerary() {
  return (
    <Itinerary
      value={MOCK_ITINERARY.article.source.body[1].value}
      onClickSaveToItinerary={action('onClickSaveToItinerary')}
    />
  )
}

DocumentItinerary.storyName = '추천코스 기본'
DocumentItinerary.decorators = [sessionContextProviderDecorator]
