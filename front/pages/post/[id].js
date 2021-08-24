import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Head from 'next/head';

import serverSideRender from '../../util/serverSideRender';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST, MOVE_MENU } from '../../reducers/user';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';

const Post = () => {
    const router = useRouter();
    const { id } = router.query;
    const { singlePost } = useSelector((state) => state.post);
    const noop = useCallback(() => {}, []);

    return (
        <AppLayout>
            <Head>
                <title>
                    {singlePost.User.nickname}님의 글
                </title>
                <meta name="description" content={singlePost.content} />
                <meta name="og:title" content={`${singlePost.content.nickname}님의 게시글`} />
                <meta name="og:description" content={singlePost.content} />
                <meta name="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'http://nodebird.com/favicon.ico'} />
                <meta name="og:url" content={`https:/nodebird.com/post/${id}`} />
            </Head>
            <PostCard post={singlePost} index={-1} setChildRef={noop} />
        </AppLayout>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(serverSideRender((context) => {
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
        type: LOAD_POST_REQUEST,
        data: context.params.id,
    });
    context.store.dispatch({
        type: MOVE_MENU,
        data: context.store.getState().user.currentMenu,
    });
}));

export default Post;
