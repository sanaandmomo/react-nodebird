import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { Form, Input, Checkbox, Button } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';

import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import { LOAD_MY_INFO_REQUEST, MOVE_MENU, SIGN_UP_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import serverSideRender from '../util/serverSideRender';

const ErrorMessage = styled.div`
    color: red;
`;

const Signup = () => {
    const dispatch = useDispatch();
    const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);

    const [email, onChangeEmail] = useInput('');
    const [nickname, onChangeNickname] = useInput('');
    const [password, onChangePassword] = useInput('');

    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const onChangePasswordCheck = useCallback((e) => {
        const { value } = e.target;
        setPasswordCheck(value);
        setPasswordError(value !== password);
    }, [password]);

    const [term, setTerm] = useState('');
    const [termError, setTermError] = useState(false);
    const onChangeTerm = useCallback((e) => {
        setTerm(e.target.checked);
        setTermError(false);
    }, []);

    const onSubmit = useCallback(() => {
        if (password !== passwordCheck) return setPasswordError(true);

        if (!term) return setTermError(true);

        dispatch({
            type: SIGN_UP_REQUEST,
            data: { email, password, nickname },
        });

        return () => {};
    }, [password, passwordCheck, term]);

    useEffect(() => {
        if (signUpDone) {
            dispatch({ type: MOVE_MENU, data: 'nodeBird' });
            Router.replace('/');
        }
    }, [signUpDone]);

    useEffect(() => {
        if (signUpError) {
            alert(signUpError);
        }
    }, [signUpError]);

    useEffect(() => {
        if (me && me.id) {
            dispatch({ type: MOVE_MENU, data: 'nodeBird' });
            Router.replace('/');
        }
    }, [me && me.id]);

    return (
        <>
            <AppLayout>
                <Head>
                    <title>회원가입  | NodeBird</title>
                </Head>
                <Form onFinish={onSubmit}>
                    <div>
                        <label htmlFor="user-email">아이디</label>
                        <br />
                        <Input name="user-email" type="email" value={email} onChange={onChangeEmail} required />
                    </div>
                    <div>
                        <label htmlFor="user-nickname">닉네임</label>
                        <br />
                        <Input name="user-nickname" value={nickname} onChange={onChangeNickname} required />
                    </div>
                    <div>
                        <label htmlFor="user-password">비밀번호</label>
                        <br />
                        <Input name="user-password" type="password" value={password} onChange={onChangePassword} required />
                    </div>
                    <div>
                        <label htmlFor="user-password-check">비밀번호 체크</label>
                        <br />
                        <Input
                            name="user-password-check"
                            type="password"
                            value={passwordCheck}
                            onChange={onChangePasswordCheck}
                            required
                        />
                        {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
                    </div>
                    <div>
                        <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>아놀드 말을 잘 들을 것을 동의합니다.</Checkbox>
                        {termError && <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>}
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
                    </div>
                </Form>
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
        data: 'signup',
    });
}));

export default Signup;
