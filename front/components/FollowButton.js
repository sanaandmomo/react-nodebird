import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';

const FollowButton = ({ post }) => {
    const dispatch = useDispatch();
    const { me, followLoading, unfollowLoading } = useSelector((state) => state.user);
    const isFollowing = me?.Followings.some((v) => v.id === post.User.id);

    const onClickButton = useCallback(() => {
        const type = isFollowing ? UNFOLLOW_REQUEST : FOLLOW_REQUEST;
        dispatch({ type, data: post.User.id });
    }, [isFollowing]);

    return (
        <Button loading={followLoading || unfollowLoading} onClick={onClickButton}>{isFollowing ? '언팔로우' : '팔로우'}</Button>
    );
};

FollowButton.propTypes = {
    post: propTypes.object.isRequired,
};

export default FollowButton;
