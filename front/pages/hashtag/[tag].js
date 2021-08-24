import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import PostCard from '../../components/PostCard';
import wrapper from '../../store/configureStore';
import AppLayout from '../../components/AppLayout';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../../reducers/post';
import serverSideRender from '../../util/serverSideRender';

const Hashtag = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { tag } = router.query;
    const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);
    const noop = useCallback(() => {}, []);

    useEffect(() => {
        const onScroll = () => {
            if (loadPostsLoading || !hasMorePosts) return;

            const { pageYOffset } = window;
            const { documentElement } = document;

            if (pageYOffset + documentElement.clientHeight >= documentElement.scrollHeight - 400) {
                const lastId = mainPosts[mainPosts.length - 1]?.id || 0;

                dispatch({
                    type: LOAD_HASHTAG_POSTS_REQUEST,
                    data: tag,
                    lastId,
                });
            }
        };

        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [hasMorePosts, loadPostsLoading, mainPosts, tag]);

    return (
        <AppLayout>
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
        type: LOAD_HASHTAG_POSTS_REQUEST,
        data: context.params.tag,
    });
}));

export default Hashtag;
