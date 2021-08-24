import React, { useCallback, useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import { EllipsisOutlined, HeartOutlined, MessageOutlined, RetweetOutlined, HeartTwoTone } from '@ant-design/icons';
import { Button, Card, Popover, Avatar, List, Comment } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import moment from 'moment';

import PostImages from './PostImages';
import useToggle from '../hooks/useToggle';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import { LIKE_POST_REQUEST, REMOVE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';
import FollowButton from './FollowButton';

moment.locale('ko');

const PostCard = ({ post, index, setChildRef }) => {
    const dispatch = useDispatch();
    const {
        removePostLoading,
        openPostCommentIndex } = useSelector((state) => state.post);
    const [commentFormOpened, onToggleComment, setCommentFormOpened] = useToggle(false);
    const id = useSelector((state) => state.user.me?.id);
    const liked = post.Likers.some((v) => v.id === id);
    const componentRef = useRef();

    const onLike = useCallback(
        () => {
            if (!id) return alert('로그인이 필요합니다.');

            dispatch({
                type: LIKE_POST_REQUEST,
                data: post.id,
            });

            return () => {};
        },
        [],
    );

    const onUnLike = useCallback(
        () => {
            if (!id) return alert('로그인이 필요합니다.');

            dispatch({
                type: UNLIKE_POST_REQUEST,
                data: post.id,
            });

            return () => {};
        },
        [],
    );

    const onRemovePost = useCallback(
        () => {
            if (!id) return alert('로그인이 필요합니다.');

            dispatch({
                type: REMOVE_POST_REQUEST,
                data: post.id,
            });

            return () => {};
        },
        [],
    );

    const onClickRetweet = useCallback(
        () => {
            if (!id) return alert('로그인이 필요합니다.');

            dispatch({
                type: RETWEET_REQUEST,
                data: post.id,
            });

            return () => {};
        },
        [id],
    );

    useEffect(() => {
        setChildRef(index, componentRef.current);
    }, []);

    useEffect(() => {
        if (openPostCommentIndex === index) {
            setCommentFormOpened(true);
        }
    }, [openPostCommentIndex]);

    return (
        <div style={{ marginBottom: 20 }} ref={componentRef}>
            <Card
                cover={post.Images[0] && <PostImages images={post.Images} />}
                actions={[
                    <RetweetOutlined key="retweet" onClick={onClickRetweet} />,
                    (
                        liked
                            ? <HeartTwoTone key="heart" twoToneColor="#eb2f96" onClick={onUnLike} />
                            : <HeartOutlined key="heart" onClick={onLike} />
                    ),
                    <MessageOutlined key="comment" onClick={onToggleComment} />,
                    <Popover
                        key="more"
                        content={(
                            <Button.Group>
                                {
                                    post.User.id === id
                                        ? (
                                            <>
                                                <Button>수정</Button>
                                                <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
                                            </>
                                        )
                                        : <Button>신고</Button>
                                }
                            </Button.Group>
                        )}
                    >
                        <EllipsisOutlined />
                    </Popover>,
                ]}
                title={post.RetweetId && `${post.User.nickname}님이 리트윗하셨습니다`}
                extra={post.User.id !== id && <FollowButton post={post} />}
            >
                {
                    post.RetweetId && post.Retweet
                        ? (
                            <>
                                <Card
                                    cover={post.Retweet.Images[0] && (
                                        <PostImages images={post.Retweet.Images} />
                                    )}
                                >
                                    <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
                                    <Card.Meta
                                        avatar={(
                                            <Link href={`/user/${post.Retweet.User.id}`}>
                                                <a>
                                                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                                                </a>
                                            </Link>
                                        )}
                                        title={post.Retweet.User.nickname}
                                        description={
                                            <PostCardContent postData={post.Retweet.content} />
                                        }
                                    />
                                </Card>
                            </>
                        )
                        : (
                            <>
                                <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
                                <Card.Meta
                                    avatar={(
                                        <Link href={`/user/${post.User.id}`}>
                                            <a>
                                                <Avatar>{post.User.nickname[0]}</Avatar>
                                            </a>
                                        </Link>
                                    )}
                                    title={post.User.nickname}
                                    description={<PostCardContent postData={post.content} />}
                                />
                            </>
                        )
                }
            </Card>
            {
                commentFormOpened && (
                    <div>
                        <CommentForm post={post} />
                        <List
                            header={`${post.Comments.length}개의 댓글`}
                            itemLayout="horizontal"
                            dataSource={post.Comments}
                            renderItem={(item) => (
                                <li>
                                    <Comment
                                        author={item.User.nickname}
                                        avatar={(
                                            <Link href={`/user/${item.User.id}`}>
                                                <a>
                                                    <Avatar>{item.User.nickname[0]}</Avatar>
                                                </a>
                                            </Link>
                                        )}
                                        content={item.content}
                                    />
                                </li>
                            )}
                        />
                    </div>
                )
            }
        </div>
    );
};

PostCard.propTypes = {
    post: propTypes.shape({
        id: propTypes.number,
        User: propTypes.shape({
            id: propTypes.number,
            nickname: propTypes.string,
        }),
        content: propTypes.string,
        createdAt: propTypes.string,
        Comments: propTypes.arrayOf(propTypes.object),
        Images: propTypes.arrayOf(propTypes.object),
        Likers: propTypes.arrayOf(propTypes.object),
        RetweetId: propTypes.number,
        Retweet: propTypes.object,
    }).isRequired,
    setChildRef: propTypes.func.isRequired,
    index: propTypes.number.isRequired,
};

export default PostCard;
