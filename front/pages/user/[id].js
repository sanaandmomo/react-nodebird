import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Card } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { LOAD_USER_POSTS_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from '../../reducers/user';
import PostCard from '../../components/PostCard';
import wrapper from '../../store/configureStore';
import AppLayout from '../../components/AppLayout';
import serverSideRender from '../../util/serverSideRender';

const User = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;
    const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);
    const { userInfo, me } = useSelector((state) => state.user);
    const noop = useCallback(() => {}, []);

    useEffect(() => {
        const onScroll = () => {
            if (loadPostsLoading || !hasMorePosts) return;

            const { pageYOffset } = window;
            const { documentElement } = document;

            if (pageYOffset + documentElement.clientHeight >= documentElement.scrollHeight - 400) {
                const lastId = mainPosts[mainPosts.length - 1]?.id || 0;

                dispatch({
                    type: LOAD_USER_POSTS_REQUEST,
                    data: id,
                    lastId,
                });
            }
        };

        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [hasMorePosts, loadPostsLoading, mainPosts, id]);

    return (
        <AppLayout>
            {userInfo && (
                <Head>
                    <title>
                        {userInfo.nickname}
                        님의 글
                    </title>
                    <meta name="description" content={`${userInfo.nickname}님의 게시글`} />
                    <meta property="og:title" content={`${userInfo.nickname}님의 게시글`} />
                    <meta property="og:description" content={`${userInfo.nickname}님의 게시글`} />
                    <meta property="og:image" content="https://nodebird.com/favicon.ico" />
                    <meta property="og:url" content={`https://nodebird.com/user/${id}`} />
                </Head>
            )}
            {userInfo && (userInfo.id !== me?.id) && (
                <Card
                    style={{ marginBottom: 20 }}
                    actions={[
                        <div key="twit">
                            짹짹
                            <br />
                            {userInfo.Posts}
                        </div>,
                        <div key="following">
                            팔로잉
                            <br />
                            {userInfo.Followings}
                        </div>,
                        <div key="follower">
                            팔로워
                            <br />
                            {userInfo.Followers}
                        </div>,
                    ]}
                >
                    <Card.Meta
                        avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                        title={userInfo.nickname}
                    />
                </Card>
            )}
            {mainPosts.map((c) => (
                <PostCard key={c.id} post={c} index={-1} setChildRef={noop} />
            ))}
        </AppLayout>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(serverSideRender((context) => {
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
        type: LOAD_USER_REQUEST,
        data: context.params.id,
    });
    context.store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: context.params.id,
    });
}));

export default User;
