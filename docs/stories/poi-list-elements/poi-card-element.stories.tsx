import { PoiCardElement } from '@titicaca/poi-list-elements'
import { ComponentStoryObj, Meta } from '@storybook/react'

import { eventMetadataDecorator } from '../../decorators'

export default {
  title: 'poi-list-elements / PoiCardElement',
  component: PoiCardElement,
  decorators: [eventMetadataDecorator],
} as Meta

export const Hotel: ComponentStoryObj<typeof PoiCardElement> = {
  args: {
    id: 'f72d2f50-2efb-4469-a903-47ad6b0c0740',
    type: 'hotel',
    names: {
      ko: '아일랜드 퍼시픽 호텔',
      en: 'Island Pacific Hotel',
      local: '港岛太平洋饭店',
    },
    regionId: '84685a5a-a0ee-47b5-b84c-4d76dffad76d',
    image: {
      id: '',
      title: null,
      description: null,
      sourceUrl: '',
      sizes: {
        large: {
          url: 'https://triple-cms-development.s3-ap-northeast-1.amazonaws.com/pictures/large/883a655b-adf0-4dd5-a350-3dd12852dd52.jpg',
        },
        smallSquare: {
          url: 'https://triple-cms-development.s3-ap-northeast-1.amazonaws.com/pictures/small_square/883a655b-adf0-4dd5-a350-3dd12852dd52.jpg',
        },
        full: {
          url: 'https://triple-cms-development.s3-ap-northeast-1.amazonaws.com/pictures/full/883a655b-adf0-4dd5-a350-3dd12852dd52.jpg',
        },
      },
    },
    comment: '아시아부터 서양 요리까지 준비된 가성비 좋은 호텔',
    reviewsRating: 5,
    reviewsCount: 1,
    nightlyPrice: 120094,
    scraped: false,
    scrapsCount: 0,
    distance: '300m',
  },
}

export const Poi: ComponentStoryObj<typeof PoiCardElement> = {
  args: {
    id: 'f72d2f50-2efb-4469-a903-47ad6b0c0740',
    type: 'attraction',
    names: {
      ko: '왓 포 사원',
      en: 'Temple of the Reclining Buddha (Wat Pho)',
      local: 'วัดโพธิ์',
    },
    regionId: 'edf1982d-c835-43a7-b06b-af43acbb6f38',
    image: {
      sourceUrl:
        'http://www.our-thailand-vacations.com/reclining-buddha-bangkok.html',
      sizes: {
        large: {
          url: 'https://triple-cms-development.s3-ap-northeast-1.amazonaws.com/pictures/large/f9ff3ed6-990e-4270-a810-d9409befa31f.jpg',
        },
        smallSquare: {
          url: 'https://triple-cms-development.s3-ap-northeast-1.amazonaws.com/pictures/small_square/f9ff3ed6-990e-4270-a810-d9409befa31f.jpg',
        },
        full: {
          url: 'https://triple-cms-development.s3-ap-northeast-1.amazonaws.com/pictures/full/f9ff3ed6-990e-4270-a810-d9409befa31f.jpg',
        },
      },
      description: null,
      id: 'f9ff3ed6-990e-4270-a810-d9409befa31f',
      title: null,
    },
    comment: '아유타야 양식으로 지어진 방콕 최대 규모의 유서깊은 사원',
    reviewsRating: 5,
    reviewsCount: 1,
    scraped: false,
    scrapsCount: 0,
    categoryName: '관광명소',
    areaName: '올드시티',
  },
}
