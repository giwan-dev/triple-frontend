import React from 'react'
import { Text } from '@titicaca/core-elements'
import { Modal, Alert } from '@titicaca/modals'
import styled from 'styled-components'
import { useURIHash, useHistoryFunctions } from '@titicaca/react-contexts'
import { ExternalLink } from '@titicaca/router'

type HashKeyValue = {
  [hash: string]: string
}

export const HASH_COMPLETE_DOWNLOAD_COUPON = 'coupon.download-complete.modal'
export const HASH_COMPLETE_DOWNLOAD_COUPON_GROUP =
  'coupon.group-download-complete.modal'
export const HASH_COMPLETE_DOWNLOAD_PART_OF_COUPON_GROUP =
  'coupon.part-of-group-download-complete.modal'
export const HASH_ALREADY_DOWNLOAD_COUPON = 'coupon.download-already.modal'
export const HASH_ERROR_COUPON = 'coupon.error.modal'

const MODAL_HASHES = [
  HASH_COMPLETE_DOWNLOAD_COUPON,
  HASH_COMPLETE_DOWNLOAD_COUPON_GROUP,
  HASH_COMPLETE_DOWNLOAD_PART_OF_COUPON_GROUP,
  HASH_ALREADY_DOWNLOAD_COUPON,
]

const TITLE_TYPES: HashKeyValue = {
  [HASH_ALREADY_DOWNLOAD_COUPON]: '이미 받은 쿠폰입니다.',
  [HASH_COMPLETE_DOWNLOAD_COUPON]: '쿠폰 받기 완료',
  [HASH_COMPLETE_DOWNLOAD_COUPON_GROUP]: '쿠폰 받기 완료',
  [HASH_COMPLETE_DOWNLOAD_PART_OF_COUPON_GROUP]: '쿠폰 받기 완료',
}

const MESSAGE_TYPES: HashKeyValue = {
  [HASH_COMPLETE_DOWNLOAD_COUPON]:
    '쿠폰을 받았습니다!\n쿠폰함에서 확인할 수 있어요~!',
  [HASH_COMPLETE_DOWNLOAD_COUPON_GROUP]:
    '쿠폰을 모두 받았습니다.\n쿠폰함에서 확인할 수 있어요~!',
  [HASH_ALREADY_DOWNLOAD_COUPON]: '쿠폰함에서 쿠폰을 확인하세요.',
  [HASH_COMPLETE_DOWNLOAD_PART_OF_COUPON_GROUP]:
    '쿠폰을 모두 받았습니다.\n(이미 받은 쿠폰 제외)\n쿠폰함에서 확인할 수 있어요~!',
}

const ICON_TYPES: HashKeyValue = {
  [HASH_COMPLETE_DOWNLOAD_COUPON]:
    'https://assets.triple.guide/images/img-popup-coupon@3x.png',
  [HASH_COMPLETE_DOWNLOAD_COUPON_GROUP]:
    'https://assets.triple.guide/images/img-popup-coupon@3x.png',
  [HASH_COMPLETE_DOWNLOAD_PART_OF_COUPON_GROUP]:
    'https://assets.triple.guide/images/img-popup-coupon@3x.png',
}

const CONFIRM_MESSAGE_TYPES: HashKeyValue = {
  [HASH_ALREADY_DOWNLOAD_COUPON]: '쿠폰함 가기',
  [HASH_COMPLETE_DOWNLOAD_COUPON]: '쿠폰 확인',
  [HASH_COMPLETE_DOWNLOAD_COUPON_GROUP]: '쿠폰 확인',
  [HASH_COMPLETE_DOWNLOAD_PART_OF_COUPON_GROUP]: '쿠폰 확인',
}

const CouponIcon = styled.img`
  display: block;
  width: 60px;
  height: 60px;
  margin: 40px auto 10px auto;
`

export function CouponModal({ identifier }: { identifier: string }) {
  const uriHash = useURIHash()
  const { back } = useHistoryFunctions()

  const modalHash = uriHash.replace(`${identifier}.`, '')

  return (
    <Modal
      open={uriHash.includes(identifier) && MODAL_HASHES.includes(modalHash)}
      onClose={back}
    >
      {ICON_TYPES[modalHash] ? (
        <CouponIcon src={ICON_TYPES[modalHash]} />
      ) : null}
      <Text
        center
        bold
        size="big"
        lineHeight={1.38}
        color="gray"
        margin={{
          top: ICON_TYPES[modalHash] ? 0 : 40,
          left: 30,
          right: 30,
          bottom: 10,
        }}
      >
        {TITLE_TYPES[modalHash]}
      </Text>
      <Text
        center
        size="small"
        lineHeight={1.43}
        color="gray"
        padding={{
          bottom: 40,
          left: 30,
          right: 30,
        }}
        alpha={0.7}
      >
        {MESSAGE_TYPES[modalHash]}
      </Text>

      <Modal.Actions>
        <Modal.Action color="gray" onClick={back}>
          취소
        </Modal.Action>
        <Modal.Action color="blue">
          <ExternalLink
            href="/benefit/coupons/my?_triple_no_navbar"
            target="new"
            allowSource="app-with-session"
            onClick={() => {
              back()
            }}
          >
            <a>{CONFIRM_MESSAGE_TYPES[uriHash]}</a>
          </ExternalLink>
        </Modal.Action>
      </Modal.Actions>
    </Modal>
  )
}

export function CouponAlertModal({
  identifier,
  errorMessage,
}: {
  identifier: string
  errorMessage?: string
}) {
  const uriHash = useURIHash()
  const { back } = useHistoryFunctions()

  return (
    <Alert
      title="쿠폰 다운로드 안내"
      open={uriHash === `${identifier}.${HASH_ERROR_COUPON}`}
      onConfirm={back}
    >
      {errorMessage}
    </Alert>
  )
}
