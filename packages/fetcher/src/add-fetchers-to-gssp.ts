import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import { authFetcherize, ExtendFetcher, ssrFetcherize } from './factories'

import { get, post, put, del } from '.'

/**
 * 주어진 getServerSideProps 함수의 context에 fetcher를 추가하는 팩토리 함수
 * @param gssp
 * @param options 추가 옵션
 * @returns getServerSideProps로 전달할 수 있는 함수
 */
export function addFetchersToGSSP<Props, CustomContext = {}>(
  gssp: (
    ctx: GetServerSidePropsContext & {
      customContext: {
        fetchers: {
          get: ExtendFetcher<typeof get, 'NEED_LOGIN'>
          post: ExtendFetcher<typeof post, 'NEED_LOGIN'>
          put: ExtendFetcher<typeof put, 'NEED_LOGIN'>
          del: ExtendFetcher<typeof del, 'NEED_LOGIN'>
        }
      }
    },
  ) => Promise<GetServerSidePropsResult<Props>>,
  { apiUriBase }: { apiUriBase: string },
): (
  ctx: GetServerSidePropsContext & { customContext?: CustomContext },
) => Promise<GetServerSidePropsResult<Props>> {
  return async function fetchersAddedGSSP(ctx) {
    const ssrFetcherOptions = {
      apiUriBase,
      cookie: ctx.req.headers.cookie,
    }
    const ssrPost = ssrFetcherize(post, ssrFetcherOptions)
    const authGuardOptions = {
      refresh: () => ssrPost('/api/users/web-session/token'),
      handleNewCookie: (cookie: string) => {
        ctx.res.setHeader('set-cookie', cookie)
      },
    }
    return gssp({
      ...ctx,
      customContext: {
        ...ctx.customContext,
        fetchers: {
          get: authFetcherize(
            ssrFetcherize(get, ssrFetcherOptions),
            authGuardOptions,
          ),
          put: authFetcherize(
            ssrFetcherize(put, ssrFetcherOptions),
            authGuardOptions,
          ),
          post: authFetcherize(ssrPost, authGuardOptions),
          del: authFetcherize(
            ssrFetcherize(del, ssrFetcherOptions),
            authGuardOptions,
          ),
        },
      },
    })
  }
}
