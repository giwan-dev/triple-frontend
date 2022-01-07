import qs from 'qs'
import { UrlElements } from '@titicaca/view-utilities'

import { createClipboardCopier } from './factories'

const ALERT_MESSAGE = '클립보드에 복사되었습니다.'

export default async function copyToClipboard({ path, query }: UrlElements) {
  if (path === '/web-action/copy-to-clipboard' && query) {
    const { text } = qs.parse(query || '')

    if (text) {
      const textClipboardCopier = createClipboardCopier()

      textClipboardCopier({ text: text as string, message: ALERT_MESSAGE })
    }

    return true
  }

  return false
}
