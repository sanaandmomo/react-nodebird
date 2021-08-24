import React, { useCallback, useEffect } from 'react';
import propTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';

import useInput from '../hooks/useInput';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = ({ post }) => {
    const dispatch = useDispatch();
    const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);
    const [commentText, onChangeCommentText, setCommentText] = useInput('');

    useEffect(
        () => {
            if (addCommentDone) {
                setCommentText('');
            }
        },
        [addCommentDone],
    );

    const onSubmitComment = useCallback(() => {
        dispatch({
            type: ADD_COMMENT_REQUEST,
            data: { content: commentText, postId: post.id },
        });
    }, [commentText]);

    return (
        <Form onFinish={onSubmitComment}>
            <Form.Item style={{ position: 'relative', margin: 0 }}>
                <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
                <Button
                    style={{ position: 'absolute', right: 0, bottom: -40, zIndex: 1 }}
                    type="primary"
                    htmlType="submit"
                    loading={addCommentLoading}
                >
                    삐약
                </Button>
            </Form.Item>
        </Form>
    );
};

CommentForm.propTypes = {
    post: propTypes.object.isRequired,
};

export default CommentForm;
