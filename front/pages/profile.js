import React, { useEffect } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import useSWR from 'swr';
import axios from 'axios';

import AppLayout from '../components/AppLayout';
import NickNameEditForm from '../components/NickNameEditForm';
import FollowList from '../components/FollowList';
import { LOAD_MY_INFO_REQUEST, MOVE_MENU } from '../reducers/user';
import wrapper from '../store/configureStore';
import serverSideRender from '../util/serverSideRender';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const { data: followers, error: followerError } = useSWR('http://localhost:3065/users/followers', fetcher);
    const { data: followings, error: followingError } = useSWR('http://localhost:3065/users/followings', fetcher);

    console.log('profile render, followings: ', followings, followingError);

    useEffect(() => {
        if (!me || !me.id) {
            dispatch({ type: MOVE_MENU, data: 'nodebird' });
            Router.push('/');
        }
    }, [me]);

    if (!me) return '내 정보 로딩중...';

    if (followerError || followingError) {
        console.error(followerError || followingError);
        return '팔로잉/팔로워 로딩 중 에러 발생..';
    }

    return (
        <>
            <Head>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <NickNameEditForm />
                <FollowList header="팔로잉" data={followings} />
                <FollowList header="팔로워" data={followers} />
            </AppLayout>
        </>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(serverSideRender((context) => {
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
        type: MOVE_MENU,
        data: 'profile',
    });
}));

export default Profile;
