import {
  createContext,
  ComponentType,
  useContext,
  PropsWithChildren,
  useState,
} from 'react'
import { DeepPartial, Optional } from 'utility-types'

import { DeviceState, DEFAULT_DEVICE_STATE } from './device-state'

interface DeviceContextValue {
  inRegion: boolean
  latitude: number | null
  longitude: number | null
  deviceState: DeviceState
}

const DeviceContext = createContext<DeviceContextValue>({
  inRegion: false,
  latitude: null,
  longitude: null,
  deviceState: DEFAULT_DEVICE_STATE,
})

export function DeviceProvider({
  value: initialValue,
  children,
}: PropsWithChildren<{
  value: Optional<DeviceContextValue, 'deviceState'>
}>) {
  const [deviceContext] = useState<DeviceContextValue>({
    ...initialValue,
    deviceState: initialValue.deviceState || DEFAULT_DEVICE_STATE,
  })
  return (
    <DeviceContext.Provider value={deviceContext}>
      {children}
    </DeviceContext.Provider>
  )
}

export interface WithDeviceContextBaseProps {
  deviceContext: DeviceContextValue
}

export function withDeviceContext<
  P extends DeepPartial<WithDeviceContextBaseProps>,
>(Component: ComponentType<P>) {
  return function WithDeviceComponent(props: Omit<P, 'deviceContext'>) {
    return (
      <DeviceContext.Consumer>
        {(context) => {
          const componentProps = {
            ...props,
            deviceContext: context,
          } as P

          return <Component {...componentProps} />
        }}
      </DeviceContext.Consumer>
    )
  }
}

export function useDeviceContext() {
  const context = useContext(DeviceContext)

  if (context === undefined) {
    throw new Error('DeviceProvier is not mounted')
  }

  return context
}
