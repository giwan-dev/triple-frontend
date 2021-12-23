import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Container, Card, Text, FlexBox, Button } from '@titicaca/core-elements'
import { gray100, white } from '@titicaca/color-palette'
import { useUserAgentContext } from '@titicaca/react-contexts'
import type {
  TransportationType,
  Itinerary,
  ItineraryItemType,
} from '@titicaca/content-type-definitions'
import { ExternalLink } from '@titicaca/router'

import ItineraryMap from './itinerary/itinerary-map'
import useItinerary from './itinerary/use-computed-itineraries'
import {
  HotelCircleBadge,
  AttractionCircleBadge,
  RestaurantCircleBadge,
} from './itinerary/badge'
import { TagLabel } from './itinerary/tag-label'
import {
  Bus,
  Walk,
  Car,
  Train,
  Tram,
  Cable,
  Plane,
  Ship,
  Download,
} from './itinerary/icons'
import useHandleAddPoisToTrip from './itinerary/use-handle-add-pois-to-trip'

interface Props {
  value: {
    itinerary: Itinerary
  }
}

const Timeline = styled(FlexBox)`
  position: relative;
  min-width: 55px;

  :before {
    content: '';
    position: absolute;
    z-index: -1;
    border-right: 1px solid ${gray100};
    width: 50%;
    height: 100%;
    right: 50%;
  }
`

const PoiCard = styled(Card)`
  flex: 1;
`

const CardWrapper = styled(FlexBox)`
  min-width: 200px;

  > ${PoiCard} {
    padding: 16px 15px;
  }
`
const Stack = styled(Container)`
  div:first-child ${Timeline} {
    :before {
      margin-top: 5px;
    }
  }
`

const Time = styled(Text)`
  background-color: ${white};
`

const Duration = styled(Container)`
  position: relative;
  bottom: -10px;
  left: -5px;
  flex-shrink: 0;
`

const SaveToItineraryButton = styled(Button)`
  > * {
    vertical-align: middle;
  }
`

export default function ItineraryElement({ value }: Props) {
  const { isPublic } = useUserAgentContext()

  const {
    courses,
    regionId,
    poiIds,
    hasItineraries,
    hideAddButton,
  } = useItinerary(value)
  const addPoisToTrip = useHandleAddPoisToTrip(regionId || '')

  const handleSaveToItinerary = useCallback(() => {
    addPoisToTrip(poiIds)
    /** TODO: event tracking */
  }, [poiIds, addPoisToTrip])

  return (
    <Container margin={{ top: 10, bottom: 10 }}>
      <ItineraryMap {...value.itinerary} />
      <Container margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <Stack>
          {courses.map((course, index) => {
            const {
              id,
              regionId,
              name,
              type,
              description,
              transportation,
              duration,
              memo,
              schedule,
              isLast,
            } = course
            const hasDuration = !isLast && transportation !== undefined
            const CircleBadge = PoiCircleBadge(type)
            const TransportIcon = TransportationIcon(transportation)

            return (
              <FlexBox flex key={index}>
                <Timeline flex>
                  <FlexBox
                    flex
                    flexGrow={1}
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                  >
                    <FlexBox
                      flex
                      flexGrow={1}
                      alignItems="center"
                      flexDirection="column"
                      padding={{ top: 20 }}
                    >
                      <CircleBadge>{index + 1}</CircleBadge>
                      {schedule ? (
                        <Time
                          bold
                          size={11}
                          color="gray300"
                          padding={{ top: 5, bottom: 5 }}
                          letterSpacing={-0.3}
                        >
                          {schedule}
                        </Time>
                      ) : null}
                    </FlexBox>
                    {hasDuration ? (
                      <Duration>
                        <TagLabel>
                          <TransportIcon />
                          {duration}
                        </TagLabel>
                      </Duration>
                    ) : null}
                  </FlexBox>
                </Timeline>

                <CardWrapper flexGrow={1} as="a">
                  <PoiCard
                    shadow="medium"
                    radius={6}
                    margin={{ top: 5, bottom: 8 }}
                  >
                    <ExternalLink
                      href={`${
                        regionId ? `/regions/${regionId}` : ''
                      }/${type}s/${id}`}
                      target={isPublic ? 'current' : 'new'}
                      allowSource="all"
                    >
                      <a>
                        <Text size={16} bold ellipsis>
                          {name}
                        </Text>
                        <Text
                          size={13}
                          color="gray500"
                          lineHeight={1.4}
                          padding={{ top: 6 }}
                        >
                          {description}
                        </Text>
                        {memo ? (
                          <Text
                            size={14}
                            margin={{ top: 10 }}
                            maxLines={2}
                            lineHeight="18px"
                          >
                            {memo}
                          </Text>
                        ) : null}
                      </a>
                    </ExternalLink>
                  </PoiCard>
                </CardWrapper>
              </FlexBox>
            )
          })}
        </Stack>
        {!hideAddButton ? (
          <SaveToItineraryButton
            fluid
            basic
            bold
            inverted
            margin={{ top: 20 }}
            onClick={handleSaveToItinerary}
            disabled={!hasItineraries}
          >
            <Download />
            <Text inline size={14} margin={{ left: 3 }} color="white">
              내 일정으로 담기
            </Text>
          </SaveToItineraryButton>
        ) : null}
      </Container>
    </Container>
  )
}

function PoiCircleBadge(type: ItineraryItemType['poi']['type']) {
  switch (type) {
    case 'hotel':
      return HotelCircleBadge
    case 'attraction':
      return AttractionCircleBadge

    case 'restaurant':
      return RestaurantCircleBadge
  }

  throw new Error(`Unknown card type of poi "${type}"`)
}

function TransportationIcon(type?: TransportationType) {
  switch (type) {
    case 'car':
      return Car
    case 'bus':
      return Bus
    case 'walk':
      return Walk
    case 'plane':
      return Plane
    case 'train':
      return Train
    case 'tram':
      return Tram
    case 'cable':
      return Cable
    case 'ship':
      return Ship
    default:
      return () => null
  }
}
