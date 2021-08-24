import { all, fork, takeLatest, put, call, throttle } from 'redux-saga/effects';
import axios from 'axios';

import {
    ADD_POST_REQUEST,
    ADD_POST_SUCCESS,
    ADD_POST_FAILURE,
    ADD_COMMENT_REQUEST,
    ADD_COMMENT_SUCCESS,
    ADD_COMMENT_FAILURE,
    REMOVE_POST_REQUEST,
    REMOVE_POST_SUCCESS,
    REMOVE_POST_FAILURE,
    LOAD_POSTS_REQUEST,
    LOAD_POSTS_SUCCESS,
    LOAD_POSTS_FAILURE,
    LIKE_POST_REQUEST,
    UNLIKE_POST_REQUEST,
    LIKE_POST_SUCCESS,
    LIKE_POST_FAILURE,
    UNLIKE_POST_SUCCESS,
    UNLIKE_POST_FAILURE,
    UPLOAD_IMAGES_REQUEST,
    UPLOAD_IMAGES_SUCCESS,
    UPLOAD_IMAGES_FAILURE,
    RETWEET_REQUEST,
    RETWEET_SUCCESS,
    RETWEET_FAILURE,
    LOAD_POST_REQUEST,
    LOAD_POST_SUCCESS,
    LOAD_POST_FAILURE,
    LOAD_HASHTAG_POSTS_REQUEST,
    LOAD_USER_POSTS_REQUEST,
    LOAD_HASHTAG_POSTS_SUCCESS,
    LOAD_HASHTAG_POSTS_FAILURE,
    LOAD_USER_POSTS_SUCCESS,
    LOAD_USER_POSTS_FAILURE,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function retweetApi(data) {
    return axios.post(`/post/${data}/retweet`);
}

function* retweet(action) {
    try {
        const result = yield call(retweetApi, action.data);

        yield put({
            type: RETWEET_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: RETWEET_FAILURE,
            error: error.response.data,
        });
    }
}

function uploadImagesApi(data) {
    return axios.post('/post/images', data);
}

function* uploadImages(action) {
    try {
        const result = yield call(uploadImagesApi, action.data);

        yield put({
            type: UPLOAD_IMAGES_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: UPLOAD_IMAGES_FAILURE,
            error: error.response.data,
        });
    }
}

function likePostApi(data) {
    return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
    try {
        const result = yield call(likePostApi, action.data);

        yield put({
            type: LIKE_POST_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: LIKE_POST_FAILURE,
            error: error.response.data,
        });
    }
}

function unlikePostApi(data) {
    return axios.delete(`/post/${data}/unlike`);
}

function* unlikePost(action) {
    try {
        const result = yield call(unlikePostApi, action.data);

        yield put({
            type: UNLIKE_POST_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: UNLIKE_POST_FAILURE,
            error: error.response.data,
        });
    }
}

function loadHashtagPostsAPI(data, lastId) {
    return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`);
}

function* loadHashtagPosts(action) {
    try {
        const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);

        yield put({
            type: LOAD_HASHTAG_POSTS_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: LOAD_HASHTAG_POSTS_FAILURE,
            error: error.response.data,
        });
    }
}

function loadUserPostsAPI(data, lastId) {
    return axios.get(`/user/${data}/posts?lastId=${lastId}`);
}

function* loadUserPosts(action) {
    try {
        const result = yield call(loadUserPostsAPI, action.data, action.lastId);

        yield put({
            type: LOAD_USER_POSTS_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: LOAD_USER_POSTS_FAILURE,
            error: error.response.data,
        });
    }
}

function loadPostsAPI(data) {
    return axios.get(`/posts?lastId=${data}`);
}

function* loadPosts(action) {
    try {
        const result = yield call(loadPostsAPI, action.data);

        yield put({
            type: LOAD_POSTS_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: LOAD_POSTS_FAILURE,
            error: error.response.data,
        });
    }
}

function loadPostAPI(data) {
    return axios.get(`/post/${data}`);
}

function* loadPost(action) {
    try {
        const result = yield call(loadPostAPI, action.data);

        yield put({
            type: LOAD_POST_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: LOAD_POST_FAILURE,
            error: error.response.data,
        });
    }
}

function addPostAPI(data) {
    return axios.post('/post', data);
}

function* addPost(action) {
    try {
        const result = yield call(addPostAPI, action.data);

        yield put({
            type: ADD_POST_SUCCESS,
            data: result.data,
        });
        yield put({
            type: ADD_POST_TO_ME,
            data: result.data.id,
        });
    } catch (error) {
        yield put({
            type: ADD_POST_FAILURE,
            error: error.response.data,
        });
    }
}

function removePostAPI(data) {
    return axios.delete(`/post/${data}`);
}

function* removePost(action) {
    try {
        const result = yield call(removePostAPI, action.data);

        yield put({
            type: REMOVE_POST_SUCCESS,
            data: result.data,
        });
        yield put({
            type: REMOVE_POST_OF_ME,
            data: action.data,
        });
    } catch (error) {
        yield put({
            type: REMOVE_POST_FAILURE,
            error: error.response.data,
        });
    }
}

function addCommentAPI(data) {
    return axios.post(`/post/${data.postId}/comment`, data);
}

function* addComment(action) {
    try {
        const result = yield call(addCommentAPI, action.data);

        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        yield put({
            type: ADD_COMMENT_FAILURE,
            error: error.response.data,
        });
    }
}

function* watchRetweet() {
    yield takeLatest(RETWEET_REQUEST, retweet);
}

function* watchUploadImages() {
    yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchLikePost() {
    yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
    yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchLoadHashtagPosts() {
    yield throttle(5000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function* watchLoadUserPosts() {
    yield throttle(5000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function* watchLoadPosts() {
    yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchLoadPost() {
    yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

function* watchAddPost() {
    yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
    yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
    yield all([
        fork(watchRetweet),
        fork(watchUploadImages),
        fork(watchLikePost),
        fork(watchUnlikePost),
        fork(watchLoadUserPosts),
        fork(watchLoadHashtagPosts),
        fork(watchLoadPosts),
        fork(watchLoadPost),
        fork(watchAddPost),
        fork(watchRemovePost),
        fork(watchAddComment),
    ]);
}
