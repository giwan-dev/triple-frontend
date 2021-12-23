import React from 'react'
import SocialReviews from '@titicaca/social-reviews'

import {
  sessionContextProviderDecorator,
  userAgentProviderDecorator,
} from '../../decorators'

export default {
  title: 'Social-Reviews / SocialReviews',
  decorators: [sessionContextProviderDecorator, userAgentProviderDecorator],
}

export function BaseSocialReviews() {
  return (
    <SocialReviews
      placeholderImageUrl="https://assets.triple-dev.titicaca-corp.com/images/img-empty-contents@3x.png"
      socialReviews={[
        {
          imageUrl:
            'http://blogthumb2.naver.net/MjAxNjExMDJfMTg5/MDAxNDc4MDkyMDQ0Nzgx.RSVFZBvGK1R6PZ8lKI48lszxcDPSTgbmzPXkhWUKWXkg.pBzoIKizCnBCwa8I4iHkgH_VXkGKXv_MROGWl1_ykbkg.JPEG.maron0505/NaverBlog_20161102_220724_10.jpg?type=w2',
          publisher: 'maron0505.blog.me',
          title: '10월 할로윈 도쿄 디즈니 리조트',
          url: 'http://maron0505.blog.me/220851987631',
        },
        {
          imageUrl:
            'http://blogthumb2.naver.net/MjAxNzAxMDhfMjI5/MDAxNDgzODc3MDYxNTg4.uIZEmtluXxDr1FCMOl-Jw4UooHbWSxTm7cQDoTUf8lIg.QTa8i9r1x5f7OJKd01iWmyZiptVfdFhhvPdOqOxgsxMg.JPEG.annatomo/IMG_5261.JPG?type=w2',
          publisher: 'blog.naver.com',
          title: '도쿄 디즈니랜드 후기 및 꿀팁 ! (2편)',
          url: 'http://blog.naver.com/annatomo/220905940459',
        },
        {
          imageUrl:
            'http://blogthumb2.naver.net/MjAxNzAxMDlfMTQy/MDAxNDgzODkwNjAxMjM4.7NCd9Fz2JM1POxwdni37vyFFpYtUrpwp8tqah8w4RDMg.GLcluxHpLHDTdFVRuQvwUQBU8zuSw0juQKSDkicyvvYg.JPEG.the_saeng/se3_image_2676960158.jpg?type=w2',
          publisher: 'blog.naver.com',
          title:
            '[2017 일본 도쿄 자유여행] 4박 5일 도쿄 자유여행 3일차! / 도쿄 디즈니랜드 가는 법 , 도쿄 디즈니랜드 후기',
          url: 'http://blog.naver.com/the_saeng/220907041546',
        },
        {
          imageUrl:
            'http://blogthumb2.naver.net/MjAxNzAzMjJfMTIg/MDAxNDkwMTkyMDg1MTU1.i7O0IdvyyhMt9V3GXUsYSBhZdTmSNkBZsGrbm0knqxcg.V6snrTTAshB2bRBXjFm8fzP--UWL1n7mN2jF5xKDMLcg.JPEG.ttttt10/P1010918.JPG?type=w2',
          publisher: 'blog.naver.com',
          title: '도쿄자유여행: 도쿄 디즈니랜드 후기',
          url: 'http://blog.naver.com/ttttt10/220964776844',
        },
        {
          imageUrl:
            'http://blogthumb2.naver.net/MjAxNzAzMjhfNiAg/MDAxNDkwNjU3MTcwNDQy.kqd2jsXjsLT6UVB6PPI7cow8I-CtC0cAuVueh0ff5VEg.xvNKPFnXScAWq-2O4tCPLLUANb7jnbxur9KHIxrYCaMg.JPEG.sheepo1234/attachImage_3526602166.jpeg?type=w2',
          publisher: 'blog.naver.com',
          title: '도쿄 2박3일 자유여행 : 도쿄 디즈니랜드 퍼레이드 후기',
          url: 'http://blog.naver.com/sheepo1234/220969523448',
        },
      ]}
    />
  )
}

BaseSocialReviews.storyName = '기본 SocialReviews'
