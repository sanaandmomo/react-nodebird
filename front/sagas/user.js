import { all, fork, takeLatest, put, call } from 'redux-saga/effects';
import axios from 'axios';

import {
    LOG_IN_REQUEST,
    LOG_IN_SUCCESS,
    LOG_IN_FAILURE,
    LOG_OUT_REQUEST,
    LOG_OUT_SUCCESS,
    LOG_OUT_FAILURE,
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAILURE,
    UNFOLLOW_SUCCESS,
    UNFOLLOW_FAILURE,
    FOLLOW_REQUEST,
    UNFOLLOW_REQUEST,
    FOLLOW_SUCCESS,
    FOLLOW_FAILURE,
    LOAD_MY_INFO_REQUEST,
    LOAD_MY_INFO_SUCCESS,
    LOAD_MY_INFO_FAILURE,
    CHANGE_NICKNAME_REQUEST,
    CHANGE_NICKNAME_SUCCESS,
    CHANGE_NICKNAME_FAILURE,
    LOAD_FOLLOWINGS_REQUEST,
    LOAD_FOLLOWERS_REQUEST,
    LOAD_FOLLOWERS_SUCCESS,
    LOAD_FOLLOWERS_FAILURE,
    LOAD_FOLLOWINGS_SUCCESS,
    LOAD_FOLLOWINGS_FAILURE,
    REMOVE_FOLLOWER_SUCCESS,
    REMOVE_FOLLOWER_FAILURE,
    REMOVE_FOLLOWER_REQUEST,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAILURE,
} from '../reducers/user';

function removeFollowerAPI(data) {
    return axios.delete(`/user/${data}/follower`);
}

function* removeFollower(action) {
    try {
        const result = yield call(removeFollowerAPI, action.data);

        yield put({
            type: REMOVE_FOLLOWER_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: REMOVE_FOLLOWER_FAILURE,
            error: error.response.data,
        });
    }
}

function loadFollowingsAPI(data) {
    return axios.get('/users/followings', data);
}

function* loadFollowings(action) {
    try {
        const result = yield call(loadFollowingsAPI, action.data);

        yield put({
            type: LOAD_FOLLOWINGS_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: LOAD_FOLLOWINGS_FAILURE,
            error: error.response.data,
        });
    }
}

function loadFollowersAPI(data) {
    return axios.get('/users/followers', data);
}

function* loadFollowers(action) {
    try {
        const result = yield call(loadFollowersAPI, action.data);

        yield put({
            type: LOAD_FOLLOWERS_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: LOAD_FOLLOWERS_FAILURE,
            error: error.response.data,
        });
    }
}

function changeNicknameAPI(data) {
    return axios.patch('/user/nickname', { nickname: data });
}

function* changeNickname(action) {
    try {
        const result = yield call(changeNicknameAPI, action.data);

        yield put({
            type: CHANGE_NICKNAME_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: CHANGE_NICKNAME_FAILURE,
            error: error.response.data,
        });
    }
}

function loadMyInfoAPI() {
    return axios.get('/user');
}

function* loadMyInfo() {
    try {
        const result = yield call(loadMyInfoAPI);

        yield put({
            type: LOAD_MY_INFO_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: LOAD_MY_INFO_FAILURE,
            error: error.response.data,
        });
    }
}

function loadUserAPI(data) {
    return axios.get(`/user/${data}`);
}

function* loadUser(action) {
    try {
        const result = yield call(loadUserAPI, action.data);

        yield put({
            type: LOAD_USER_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: LOAD_USER_FAILURE,
            error: error.response.data,
        });
    }
}

function followAPI(data) {
    return axios.patch(`/user/${data}/follow`);
}

function* follow(action) {
    try {
        const result = yield call(followAPI, action.data);

        yield put({
            type: FOLLOW_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: FOLLOW_FAILURE,
            error: error.response.data,
        });
    }
}

function unfollowAPI(data) {
    return axios.delete(`/user/${data}/unfollow`);
}

function* unfollow(action) {
    try {
        const result = yield call(unfollowAPI, action.data);

        yield put({
            type: UNFOLLOW_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: UNFOLLOW_FAILURE,
            error: error.response.data,
        });
    }
}

function logInAPI(data) {
    return axios.post('/user/login', data);
}

function* logIn(action) {
    try {
        const result = yield call(logInAPI, action.data);

        yield put({
            type: LOG_IN_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: LOG_IN_FAILURE,
            error: error.response.data,
        });
    }
}

function logOutAPI() {
    return axios.post('/user/logout');
}

function* logOut() {
    try {
        yield call(logOutAPI);
        yield put({
            type: LOG_OUT_SUCCESS,
        });
    } catch (error) {
        yield put({
            type: LOG_OUT_FAILURE,
            error: error.response.data,
        });
    }
}

function signUpAPI(data) {
    return axios.post('/user', data);
}

function* signUp(action) {
    try {
        yield call(signUpAPI, action.data);
        yield put({
            type: SIGN_UP_SUCCESS,
        });
    } catch (error) {
        yield put({
            type: SIGN_UP_FAILURE,
            error: error.response.data,
        });
    }
}

function* watchRemoveFollower() {
    yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function* watchLoadFollowings() {
    yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function* watchLoadFollowers() {
    yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function* watchChangeNickname() {
    yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function* watchLoadMyInfo() {
    yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchLoadUser() {
    yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

function* watchFollow() {
    yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnFollow() {
    yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchLogIn() {
    yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
    yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
    yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
    yield all([
        fork(watchRemoveFollower),
        fork(watchLoadFollowings),
        fork(watchLoadFollowers),
        fork(watchChangeNickname),
        fork(watchLoadMyInfo),
        fork(watchLoadUser),
        fork(watchFollow),
        fork(watchUnFollow),
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchSignUp),
    ]);
}
