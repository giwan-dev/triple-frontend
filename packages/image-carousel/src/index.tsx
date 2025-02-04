import {
  createRef,
  PureComponent,
  ReactNode,
  RefObject,
  SyntheticEvent,
} from 'react'
import styled from 'styled-components'
import { ImageSourceType, Image } from '@titicaca/core-elements'
import {
  ImageMeta as OriginalImageMeta,
  GlobalSizes,
  FrameRatioAndSizes,
} from '@titicaca/type-definitions'
import Flicking from '@egjs/react-flicking'

import Carousel, { CarouselProps } from './carousel'

export interface CarouselImageMeta extends OriginalImageMeta {
  size?: GlobalSizes
}

const PageLabelText = styled.div`
  font-size: 12px;
  font-weight: bold;
`

const PageLabelContainer = styled.div`
  margin: 10px;
  padding: 5px 7px;
  color: #ffffff;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.2);
`

export interface RendererProps {
  currentIndex: number
  totalCount: number
}

interface ImageCarouselProps extends Omit<CarouselProps, 'pageLabelRenderer'> {
  images: CarouselImageMeta[]
  size?: GlobalSizes
  height?: number
  frame?: FrameRatioAndSizes
  ImageSource?: ImageSourceType
  onImageClick?: (e?: SyntheticEvent, image?: CarouselImageMeta) => void
  showMoreRenderer?: (params: RendererProps) => ReactNode
  pageLabelRenderer?: (params: RendererProps) => ReactNode
  displayedTotalCount?: number
  optimized?: boolean
}

export default class ImageCarousel extends PureComponent<ImageCarouselProps> {
  private flickingRef: RefObject<Flicking>

  public static defaultProps: Partial<ImageCarousel['props']> = {
    pageLabelRenderer: (props) => PageLabel(props),
  }

  public constructor(props: ImageCarouselProps) {
    super(props)
    this.flickingRef = createRef<Flicking>()
  }

  public get carouselProps(): CarouselProps {
    const {
      margin,
      borderRadius,
      defaultIndex,
      images,
      height,
      onMoveStart,
      onMove,
      onMoveEnd,
      pageLabelRenderer,
      displayedTotalCount,
    } = this.props

    const totalCount = displayedTotalCount ?? images.length

    return {
      margin,
      height,
      borderRadius,
      defaultIndex,
      onMoveStart,
      onMove,
      onMoveEnd,
      pageLabelRenderer: ({ currentIndex }) =>
        // HACK: defaultProps로 지정해주었기 때문에 존재가 보장됨
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pageLabelRenderer!({
          currentIndex,
          totalCount,
        }) || null,
      flickingRef: this.flickingRef,
    }
  }

  public render() {
    const {
      size: globalSize,
      frame: globalFrame,
      height,
      images,
      onImageClick,
      ImageSource,
      showMoreRenderer,
      displayedTotalCount,
      optimized,
    } = this.props

    const { carouselProps } = this

    const totalCount = displayedTotalCount ?? images.length

    return (
      <Carousel {...carouselProps}>
        {images.map((image, i) => {
          const {
            frame: imageFrame,
            size: imageSize,
            sizes,
            sourceUrl = '',
            title,
            description,
          } = image
          const size = globalSize || imageSize
          const frame = size ? undefined : globalFrame || imageFrame

          const renderContent = () => {
            const overlayContent = showMoreRenderer
              ? showMoreRenderer({
                  currentIndex: i,
                  totalCount,
                })
              : null

            return (
              <>
                <Image.SourceUrl>
                  {ImageSource ? (
                    <ImageSource sourceUrl={sourceUrl} />
                  ) : (
                    sourceUrl
                  )}
                </Image.SourceUrl>

                {overlayContent ? (
                  <Image.Overlay overlayType="dark" zTier={1}>
                    {overlayContent}
                  </Image.Overlay>
                ) : null}

                {optimized ? (
                  <Image.OptimizedImg
                    cloudinaryId={image.cloudinaryId as string}
                    cloudinaryBucket={image.cloudinaryBucket}
                    alt={title || description || undefined}
                  />
                ) : (
                  <Image.Img
                    src={sizes.large.url}
                    alt={title || description || undefined}
                  />
                )}
              </>
            )
          }

          return (
            <Image key={i} borderRadius={0}>
              {size || height ? (
                <Image.FixedDimensionsFrame
                  size={size}
                  height={height}
                  onClick={
                    onImageClick &&
                    ((e) =>
                      !this.flickingRef.current?.isPlaying() &&
                      onImageClick(e, image))
                  }
                >
                  {renderContent()}
                </Image.FixedDimensionsFrame>
              ) : (
                <Image.FixedRatioFrame
                  frame={frame}
                  onClick={
                    onImageClick &&
                    ((e) =>
                      !this.flickingRef.current?.isPlaying() &&
                      onImageClick(e, image))
                  }
                >
                  {renderContent()}
                </Image.FixedRatioFrame>
              )}
            </Image>
          )
        })}
      </Carousel>
    )
  }
}

export function PageLabel({ currentIndex, totalCount }: RendererProps) {
  return (
    <PageLabelContainer>
      <PageLabelText>{`${currentIndex + 1} / ${totalCount}`}</PageLabelText>
    </PageLabelContainer>
  )
}
