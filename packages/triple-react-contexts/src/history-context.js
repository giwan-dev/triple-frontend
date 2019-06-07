import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import Router from 'next/router'
import qs from 'qs'

const Context = createContext()

const EXTERNAL_BROWSER_HOSTS = ['play.google.com', 'itunes.apple.com']

function pathWithHash(hash) {
  const url = new URL(Router.asPath, 'https://triple.guide')
  url.hash = hash && `#${hash}`

  return `${url.pathname}${url.search}${hash ? url.hash : ''}`
}

function targetPageAvailable(path) {
  return path.match(
    /^\/regions\/.+\/(attractions|restaurants|hotels|articles)\/.+/,
  )
}

const HASH_HISTORIES = []

export function HistoryProvider({
  appUrlScheme,
  webUrlBase,
  transitionModalHash,
  isAndroid,
  isPublic,
  children,
}) {
  const [uriHash, setUriHash] = useState(null)

  const onHashChange = useCallback((url) => {
    const hash = new URL(url, 'https://triple.guide').hash.replace(/^#/, '')

    // We only need to check if onHashChange is triggered by native action.
    const { hash: previousHash } =
      HASH_HISTORIES[HASH_HISTORIES.length - 2] || {}

    if ((previousHash || '') === hash) {
      HASH_HISTORIES.pop()

      setUriHash(previousHash)
    }
  }, [])

  useEffect(() => {
    Router.events.on('routeChangeStart', onHashChange)
    Router.events.on('hashChangeStart', onHashChange)

    return () => {
      Router.events.off('routeChangeStart', onHashChange)
      Router.events.off('hashChangeStart', onHashChange)
    }
  }, [onHashChange])

  const replace = useCallback(
    (hash, { useRouter = isAndroid } = {}) => {
      HASH_HISTORIES.pop()
      HASH_HISTORIES.push({ hash, useRouter })

      setUriHash(hash)

      if (useRouter) {
        Router.replace(pathWithHash(hash))
      }
    },
    [isAndroid],
  )

  const push = useCallback(
    (hash, { useRouter = isAndroid } = {}) => {
      HASH_HISTORIES.push({ hash, useRouter })

      setUriHash(hash)

      if (useRouter) {
        Router.push(pathWithHash(hash))
      }
    },
    [isAndroid],
  )

  const back = useCallback(() => {
    const { useRouter } = HASH_HISTORIES.pop() || {}

    setUriHash((HASH_HISTORIES[HASH_HISTORIES.length - 1] || {}).hash)

    if (useRouter) {
      Router.back()
    }
  }, [])

  const navigateOnPublic = useCallback(
    ({ href, protocol, path }) => {
      if (protocol === 'http:' || protocol === 'https:') {
        window.location = href
      } else if (targetPageAvailable(path)) {
        window.location = `${webUrlBase}${path}`
      } else {
        transitionModalHash && push(transitionModalHash)
      }
    },
    [push, transitionModalHash, webUrlBase],
  )

  const navigateInApp = useCallback(
    ({ href, protocol, host, path }, params) => {
      if (protocol === `${appUrlScheme}:`) {
        window.location = href
      } else if (protocol === 'http:' || protocol === 'https:') {
        const outlinkParams = qs.stringify({
          url: href,
          ...(params || {}),
          target:
            (params || {}).target ||
            (EXTERNAL_BROWSER_HOSTS.includes(host) ? 'browser' : 'default'),
        })

        window.location = `${appUrlScheme}:///outlink?${outlinkParams}`
      } else {
        window.location = `${appUrlScheme}://${path}`
      }
    },
    [appUrlScheme],
  )

  const navigate = useCallback(
    (href, params) => {
      let url = {}

      try {
        url = new URL(href)
      } catch {
        // Do nothing
      }

      const protocol = url.protocol
      const host = url.host
      const [, , path] = (url.pathname || href).match(/(^\/\/)?(\/.*)/) || []
      const query = (url.search || '').substring(1)

      if (protocol === `${appUrlScheme}:` && (path || '').match(/^\/outlink/)) {
        const { url: targetUrl } = qs.parse(query)

        return navigate(targetUrl, params)
      } else if (isPublic) {
        return navigateOnPublic({ href, protocol, host, path, query }, params)
      } else {
        return navigateInApp({ href, protocol, host, path, query }, params)
      }
    },
    [appUrlScheme, isPublic, navigateInApp, navigateOnPublic],
  )

  const value = useMemo(
    () => ({
      uriHash,
      push,
      replace,
      back,
      navigate,
    }),
    [back, navigate, push, replace, uriHash],
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useHistoryContext() {
  return useContext(Context)
}

export function withHistory(Component) {
  return function HistoryComponent(props) {
    return (
      <Context.Consumer>
        {({ uriHash, push, replace, back, navigate }) => (
          <Component
            uriHash={uriHash}
            historyActions={{
              push,
              replace,
              back,
              navigate,
            }}
            {...props}
          />
        )}
      </Context.Consumer>
    )
  }
}
