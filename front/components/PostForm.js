import React, { useCallback, useRef, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import useInput from '../hooks/useInput';
import { UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE, ADD_POST_REQUEST } from '../reducers/post';
import backUrl from '../config/config';

const PostForm = () => {
    const dispatch = useDispatch();
    const { imagePaths, addPostDone, addPostLoading } = useSelector((state) => state.post);
    const [text, onChangeText, setText] = useInput('');

    useEffect(() => {
        if (addPostDone) {
            setText('');
        }
    }, [addPostDone]);

    const onSubmit = useCallback(() => {
        if (!text.trim()) return alert('게시글을 작성하세요.');

        const formData = new FormData();

        imagePaths.forEach((p) => {
            formData.append('image', p);
        });
        formData.append('content', text);

        dispatch({
            type: ADD_POST_REQUEST,
            data: formData,
        });

        return () => {};
    }, [text, imagePaths]);

    const imageInput = useRef();
    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, []);

    const onChangeImages = useCallback((e) => {
        console.log('images', e.target.files);
        const imageFormData = new FormData();

        Object.values(e.target.files).forEach((f) => {
            imageFormData.append('image', f);
        });

        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imageFormData,
        });
    }, []);

    const onClickRemoveImage = useCallback((index) => () => {
        dispatch({
            type: REMOVE_IMAGE,
            data: index,
        });
    }, []);

    return (
        <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
            <Input.TextArea
                value={text}
                onChange={onChangeText}
                maxLength={140}
                placeholder="어떤 신기한 일이 있었나요?"
            />
            <div>
                <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages} />
                <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                <Button type="primary" loading={addPostLoading} style={{ float: 'right' }} htmlType="submit">짹짹</Button>
            </div>
            <div>
                {imagePaths.map((v, i) => (
                    <div key={v} style={{ display: 'inline-block' }}>
                        <img src={`${backUrl}/${v}`} style={{ width: '200px' }} alt={v} />
                        <div>
                            <Button onClick={onClickRemoveImage(i)}>제거</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Form>
    );
};

export default PostForm;
