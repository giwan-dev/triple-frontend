import React, { PureComponent } from 'react'
import styled, { css } from 'styled-components'

import List from '../elements/list'
import Container from '../elements/container'
import Text from '../elements/text'
import Rating from '../elements/rating'

const UserPhoto = styled.img`
  margin-right: 9px;
  width: 38px;
  height: 38px;
  float: left;
  background-color: #efefef;
  border-radius: 19px;
  object-fit: cover;
`

const Badge = styled.img`
  position: absolute;
  top: 22px;
  left: 25px;
  width: 18px;
  height: 18px;
`

const MoreIcon = styled.img`
  margin-top: -3px;
  margin-left: 5px;
  width: 30px;
  height: 30px;
  vertical-align: middle;
`

function Name({ onClick, children }) {
  return (
    <Text bold size="large" color="gray" onClick={onClick}>
      {children}
    </Text>
  )
}

function UserExtra({ onClick, children }) {
  return (
    <Text
      margin={{ top: 4 }}
      bold
      size="mini"
      color="gray"
      alpha={0.3}
      onClick={onClick}
    >
      {children}
    </Text>
  )
}

function Score({ score }) {
  return (
    <Container floated="right">
      <Rating size="tiny" score={score} />
    </Container>
  )
}

function Comment({ children }) {
  return (
    <Text size="large" color="gray" alpha={0.8} lineHeight={1.5}>
      {children}
    </Text>
  )
}

function Content({ children }) {
  return (
    <Container margin={{ top: 17 }} clearing>
      <Comment>{children}</Comment>
    </Container>
  )
}

const Images = styled.div`
  margin-top: 17px;
  white-space: nowrap;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;

  ::-webkit-scrollbar {
    display: none;
  }

  img {
    width: 80px;
    height: 80px;
    border-radius: 3px;
    object-fit: cover;

    &:not(:first-child) {
      margin-left: 9px;
    }
  }
`

function Meta({ children }) {
  return (
    <Text margin={{ top: 20 }} bold size="mini" color="gray" alpha={0.3}>
      {children}
    </Text>
  )
}

const LikeButton = styled.a`
  display: inline-block;
  font-family: sans-serif;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  box-sizing: border-box;

  margin-right: 8px;
  padding: 5px 7px;
  border-radius: 3px;

  ${({ liked }) => css`
    color: ${liked ? '#ffffff' : 'rgba(58, 58, 58, 0.8)'};
    background-color: ${liked ? '#368fff' : '#fafafa'};
  `};
`

function Date({ floated, children }) {
  return <Container floated={floated}>{children}</Container>
}

const ItemContainer = styled(Container)`
  padding-bottom: 2px;
`

class ReviewItem extends PureComponent {
  render() {
    const {
      props: { children },
    } = this

    return (
      <List.Item>
        <ItemContainer>{children}</ItemContainer>
      </List.Item>
    )
  }
}

class Review extends PureComponent {
  render() {
    const {
      props: { children, ...props },
    } = this

    return (
      <List divided verticalGap={60} {...props}>
        {children}
      </List>
    )
  }
}

const MAX_COMMENT_LINES = 6
const CHARACTERS_PER_LINE = 25

function findFoldedPosition(comment) {
  const lines = (comment || '').split('\n')

  let linesCount = 0
  let foldedIndex = 0
  for (const line of lines) {
    const rest = (MAX_COMMENT_LINES - linesCount) * CHARACTERS_PER_LINE

    if (line.length > rest) {
      return foldedIndex + rest
    }

    foldedIndex = foldedIndex + line.length
    linesCount = linesCount + 1 + Math.floor(line.length / CHARACTERS_PER_LINE)
  }

  return null
}

const Unfold = styled.a`
  display: inline-block;
  color: #2987f0;
  text-decoration: none;
`

function FoldedComment({ children, onUnfoldButtonClick }) {
  return (
    <Comment>
      {`${children} …`}
      <Unfold onClick={onUnfoldButtonClick}>더보기</Unfold>
    </Comment>
  )
}

function FoldableComment({ children, onUnfoldButtonClick }) {
  const foldedPosition = findFoldedPosition(children)

  return foldedPosition ? (
    <FoldedComment onUnfoldButtonClick={onUnfoldButtonClick}>
      {children.slice(0, foldedPosition)}
    </FoldedComment>
  ) : (
    <Comment>{children}</Comment>
  )
}

class ReviewElement extends PureComponent {
  state = { unfolded: false }

  render() {
    const {
      props: {
        review,
        onUserClick,
        onUnfoldButtonClick,
        onLikeButtonClick,
        onLikesCountClick,
        onMenuClick,
        onImageClick,
        likeVisible,
        menuVisible,
        DateFormatter,
      },
      state: { unfolded },
    } = this

    const {
      user: {
        photo,
        name,
        userBoard: { reviews: reviewsCount },
        mileage,
      },
      blind,
      thanks,
      liked,
      comment,
      createdAt,
      rating,
      attachments,
    } = review
    const badge = mileage && mileage.badges && mileage.badges[0]

    return (
      <ReviewItem>
        <Container>
          <UserPhoto src={photo} onClick={(e) => onUserClick(e, review)} />
          {badge && <Badge src={badge.icon.imageUrl} />}
          <Name onClick={(e) => onUserClick(e, review)}>{name}</Name>
          <UserExtra>
            <span onClick={(e) => onUserClick(e, review)}>
              {badge
                ? `${badge.label} / ${reviewsCount}개의 리뷰`
                : `${reviewsCount}개의 리뷰`}
            </span>
            {!blind && !!rating ? <Score score={rating} /> : null}
          </UserExtra>
        </Container>
        <Content>
          {blind ? (
            '신고가 접수되어 블라인드 처리되었습니다.'
          ) : unfolded ? (
            comment
          ) : (
            <FoldableComment
              onUnfoldButtonClick={(e) => {
                this.setState({ unfolded: true })

                onUnfoldButtonClick && onUnfoldButtonClick(e, review)
              }}
            >
              {comment}
            </FoldableComment>
          )}
          {!blind && (
            <Images>
              {(attachments || []).map((attachment, i) => (
                <img
                  key={i}
                  src={attachment.smallThumbnail}
                  onClick={(e) => onImageClick(e, review, attachment)}
                />
              ))}
            </Images>
          )}
        </Content>
        {!blind && (
          <Meta>
            {likeVisible !== false ? (
              <>
                <LikeButton
                  liked={liked}
                  onClick={(e) => onLikeButtonClick(e, review)}
                >
                  Thanks
                </LikeButton>
                {thanks && thanks > 0 ? (
                  <span onClick={(e) => onLikesCountClick(e, review)}>
                    {thanks}명
                  </span>
                ) : null}
              </>
            ) : null}
            <Date floated={likeVisible !== false && 'right'}>
              {DateFormatter ? (
                <DateFormatter>{createdAt}</DateFormatter>
              ) : (
                createdAt
              )}
              {menuVisible !== false && (
                <MoreIcon
                  src="https://assets.triple.guide/images/btn-review-more@4x.png"
                  onClick={(e) => onMenuClick(e, review)}
                />
              )}
            </Date>
          </Meta>
        )}
      </ReviewItem>
    )
  }
}

export function ReviewsList({
  margin,
  reviews,
  onUserClick,
  onLikeButtonClick,
  onLikesCountClick,
  onMenuClick,
  onImageClick,
  likeVisible,
  menuVisible,
  likes,
  DateFormatter,
}) {
  return (
    <Review margin={margin} divided verticalGap={60}>
      {(reviews || []).map((review) => (
        <ReviewElement
          key={review.id}
          review={
            typeof (likes || {})[review.id] === 'boolean'
              ? {
                  ...review,
                  liked: likes[review.id],
                  thanks:
                    review.liked === likes[review.id]
                      ? review.thanks
                      : review.thanks + (likes[review.id] ? 1 : -1),
                }
              : review
          }
          onUserClick={onUserClick}
          onLikeButtonClick={onLikeButtonClick}
          onLikesCountClick={onLikesCountClick}
          onMenuClick={onMenuClick}
          onImageClick={onImageClick}
          likeVisible={likeVisible}
          menuVisible={menuVisible}
          DateFormatter={DateFormatter}
        />
      ))}
    </Review>
  )
}
