import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST, OPEN_POST_COMMENT } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST, MOVE_MENU } from '../reducers/user';
import debounce from '../util/debounce';
import wrapper from '../store/configureStore';
import serverSideRender from '../util/serverSideRender';

const Home = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const {
        mainPosts,
        hasMorePosts,
        loadPostsLoading,
        openPostCommentIndex,
        retweetError } = useSelector((state) => state.post);
    const childRefs = useRef([]);

    const setChildRef = useCallback((index, child) => {
        childRefs.current[index] = child;
    });

    const openPostCommentForm = useCallback(() => {
        const { scrollY } = window;
        const { clientHeight } = document.documentElement;

        const childIndex = childRefs.current.findIndex(({ offsetTop, offsetHeight }) => (
            scrollY <= offsetTop && offsetTop + offsetHeight <= scrollY + clientHeight
        ));

        if (childIndex !== -1 && childIndex !== openPostCommentIndex) {
            dispatch({ type: OPEN_POST_COMMENT, data: childIndex });
        }
    }, [openPostCommentIndex]);

    useEffect(() => {
        if (mainPosts.length && mainPosts.length <= 10) {
            openPostCommentForm();
        }
    }, [mainPosts]);

    useEffect(() => {
        const onScroll = () => {
            if (loadPostsLoading || !hasMorePosts) return;

            const { pageYOffset } = window;
            const { documentElement } = document;

            if (pageYOffset + documentElement.clientHeight >= documentElement.scrollHeight - 400) {
                const lastId = mainPosts[mainPosts.length - 1]?.id || 0;

                dispatch({
                    type: LOAD_POSTS_REQUEST,
                    data: lastId,
                });
            }
        };

        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [loadPostsLoading, mainPosts, hasMorePosts]);

    useEffect(() => {
        const onScroll = debounce(openPostCommentForm, 3000);

        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [openPostCommentForm]);

    useEffect(() => {
        if (retweetError) {
            alert(retweetError);
        }
    }, [retweetError]);

    return (
        <AppLayout>
            {me && <PostForm />}
            {mainPosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} setChildRef={setChildRef} />
            ))}
        </AppLayout>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(serverSideRender((context) => {
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
        type: LOAD_POSTS_REQUEST,
        data: 0,
    });
    context.store.dispatch({
        type: MOVE_MENU,
        data: 'nodebird',
    });
}));

export default Home;
