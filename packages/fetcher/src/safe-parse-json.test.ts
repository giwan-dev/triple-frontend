import safeParseJson from './safe-parse-json'

it('JSON 파싱 에러를 조용히 넘깁니다.', async () => {
  const response = new Response('', {
    headers: {
      'content-type': 'application/json',
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json = await safeParseJson(response as any)
  expect(json).toBe(undefined)
})
