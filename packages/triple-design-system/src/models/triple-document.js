import React from 'react'
import styled from 'styled-components'

import {
  HR1,
  HR2,
  HR3,
  Carousel,
  CarouselElementContainer,
  ImageFrame,
  ImageCarousel,
  ImageCarouselElementContainer,
  ImageCaption,
  ResourceList,
  PoiListElement,
  PoiCarouselElement,
  SimpleLink,
  Segment,
  RegionElement,
} from '../elements/content-elements'
import Button from '../elements/button'
import Text from '../elements/text'
import { H1, H2, H3, H4, Paragraph } from './text'

const MH1 = ({ children, ...props }) => (
  <H1 margin={{ top: 25, bottom: 20, left: 30, right: 30 }} {...props}>
    {children}
  </H1>
)

const MH2 = ({ children, ...props }) => (
  <H2 margin={{ top: 20, bottom: 20, left: 30, right: 30 }} {...props}>
    {children}
  </H2>
)

const MH3 = ({ compact, children, ...props }) => (
  <H3
    margin={compact ? { top: 13 } : { top: 20, left: 30, right: 30 }}
    compact={compact}
    {...props}
  >
    {children}
  </H3>
)

const MH4 = ({ children, ...props }) => (
  <H4 margin={{ top: 20, left: 30, right: 30 }} {...props}>
    {children}
  </H4>
)

const ELEMENTS = {
  heading1: Heading(MH1),
  heading2: Heading(MH2),
  heading3: Heading(MH3),
  heading4: Heading(MH4),
  text: TextElement,
  images: Images,
  hr1: HR1,
  hr2: HR2,
  hr3: HR3,
  pois: Pois,
  links: Links,
  embedded: Embedded,
  note: Note,
  regions: Regions,
}

const EMBEDDED_ELEMENTS = {
  heading3: Compact(Heading(MH3)),
  text: Compact(TextElement),
  links: Compact(Links),
  images: EmbeddedImages,
}

export function TripleDocument({
  children,
  onResourceClick,
  onResourceScrapedChange,
  onImageClick,
  onLinkClick,
  imageSourceComponent,
}) {
  return (
    <>
      {children.map(({ type, value }, i) => {
        const Element = ELEMENTS[type]

        return (
          Element && (
            <Element
              key={i}
              value={value}
              onResourceClick={onResourceClick}
              onImageClick={onImageClick}
              onLinkClick={onLinkClick}
              onResourceScrapedChange={onResourceScrapedChange}
              ImageSource={imageSourceComponent}
            />
          )
        )
      })}
    </>
  )
}

function Heading(Component) {
  return ({ value: { text, emphasize, headline }, ...props }) => (
    <Component emphasize={emphasize} headline={headline} {...props}>
      {text}
    </Component>
  )
}

function TextElement({ value: { text, rawHTML }, compact, ...props }) {
  if (rawHTML) {
    return (
      <Text.Html
        margin={compact ? { top: 4 } : { top: 10, left: 30, right: 30 }}
        dangerouslySetInnerHTML={{ __html: rawHTML }}
        {...props}
      />
    )
  }

  return (
    <Paragraph
      margin={compact ? { top: 4 } : { top: 10, left: 30, right: 30 }}
      {...props}
    >
      {text}
    </Paragraph>
  )
}

function Compact(Component) {
  return (props) => <Component compact {...props} />
}

function Images({ value: { images }, onImageClick, ImageSource }) {
  return (
    <ImageCarousel>
      {images.map((image, i) => (
        <ImageCarouselElementContainer key={i}>
          <ImageFrame
            image={image}
            onClick={onImageClick && ((e) => onImageClick(e, image))}
            ImageSource={ImageSource}
          />
          <ImageCaption>{image.title}</ImageCaption>
        </ImageCarouselElementContainer>
      ))}
    </ImageCarousel>
  )
}

function EmbeddedImages({
  value: {
    images: [image],
  },
  onImageClick,
  ImageSource,
}) {
  return (
    image && (
      <ImageFrame
        ratio={1.35}
        onClick={onImageClick && ((e) => onImageClick(e, image))}
        image={image}
        ImageSource={ImageSource}
      />
    )
  )
}

export function Pois({
  value: { display, pois },
  onResourceClick,
  onResourceScrapedChange,
}) {
  const Container = display === 'list' ? ResourceList : Carousel
  const Element = display === 'list' ? PoiListElement : PoiCarouselElement

  return (
    <Container>
      {pois.map((poi) => (
        <Element
          key={poi.id}
          value={poi}
          onClick={onResourceClick && ((e) => onResourceClick(e, poi))}
          onScrapedChange={onResourceScrapedChange}
        />
      ))}
    </Container>
  )
}

const LinksContainer = styled.div`
  margin: ${({ compact }) => (compact ? '0' : '0 30px')};

  a {
    display: inline-block;
    margin-top: ${({ compact }) => (compact ? '10px' : '20px')};
    margin-right: ${({ compact }) => (compact ? '10px' : '20px')};
  }
`

const DocumentButtonContainer = styled(Button.Container)`
  padding: 50px 0;
`

function Links({ value: { display, links }, onLinkClick, ...props }) {
  const Container =
    display === 'button' ? DocumentButtonContainer : LinksContainer
  const Element = display === 'button' ? Button : SimpleLink

  return (
    <Container {...props}>
      {links.map(({ label, href }, i) => (
        <Element
          key={i}
          href={href}
          onClick={onLinkClick && ((e) => onLinkClick(e))}
        >
          {label}
        </Element>
      ))}
    </Container>
  )
}

function Embedded({ value: { entries }, onImageClick, ImageSource }) {
  return (
    <Carousel>
      {entries.map((elements, i) => (
        <CarouselElementContainer key={i} size="medium">
          {elements.map(({ type, value }, j) => {
            const Element = EMBEDDED_ELEMENTS[type]

            return (
              Element && (
                <Element
                  key={j}
                  value={value}
                  onImageClick={onImageClick}
                  ImageSource={ImageSource}
                />
              )
            )
          })}
        </CarouselElementContainer>
      ))}
    </Carousel>
  )
}

function Note({ value: { title, body } }) {
  return (
    <Segment>
      <Text bold size="small" color="gray" alpha={1} lineHeight={1.43}>
        {title}
      </Text>
      <Text size="small" color="gray" alpha={0.7} lineHeight={1.43}>
        {body}
      </Text>
    </Segment>
  )
}

function Regions({ value: { regions }, onResourceClick }) {
  return (
    <ResourceList>
      {regions.map((region, index) => (
        <RegionElement
          key={index}
          value={region}
          onClick={onResourceClick && ((e) => onResourceClick(e, region))}
        />
      ))}
    </ResourceList>
  )
}
