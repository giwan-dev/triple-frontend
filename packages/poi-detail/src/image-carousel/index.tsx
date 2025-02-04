import { useImagesContext } from '@titicaca/react-contexts'

import CarouselSection from './carousel-section'

export default function ImageCarousel(
  props: Pick<
    Parameters<typeof CarouselSection>['0'],
    | 'permanentlyClosed'
    | 'currentBusinessHours'
    | 'todayBusinessHours'
    | 'onBusinessHoursClick'
    | 'onImageClick'
    | 'onCtaClick'
    | 'onPlaceholderClick'
    | 'margin'
    | 'optimized'
    | 'padding'
    | 'borderRadius'
    | 'height'
  >,
) {
  const {
    images,
    loading,
    total,
    actions: { fetch },
  } = useImagesContext()

  return (
    <CarouselSection
      images={images}
      loading={loading}
      totalImagesCount={total}
      onImagesFetch={fetch}
      {...props}
    />
  )
}
