import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';
import { useSelector } from 'react-redux';
import Router from 'next/router';

import UserProfile from './UserProfile';
import LoginForm from './LoginForm';
import useInput from '../hooks/useInput';

const SearchInput = styled(Input.Search)`
    vertical-align: middle;
`;

const Global = createGlobalStyle`
    .ant-row {
        margin-right: 0 !important;
        margin-left: 0 !important;
    }

    .ant-col:first-child {
        padding-left: 0 !important;
    }

    .ant-col:last-child {
        padding-right: 0 !important;
    }
`;

const AppLayout = ({ children }) => {
    const [searchInput, onChangeSearchInput] = useInput('');
    const { me, currentMenu } = useSelector((state) => state.user);

    const onSearch = useCallback(() => {
        Router.push(`/hashtag/${searchInput}`);
    }, [searchInput]);

    return (
        <div>
            <Global />
            <Menu mode="horizontal" selectedKeys={[currentMenu]}>
                <Menu.Item key="nodebird">
                    <Link href="/"><a>노드 버드</a></Link>
                </Menu.Item>
                <Menu.Item key="profile">
                    <Link href="/profile"><a>프로필</a></Link>
                </Menu.Item>
                <Menu.Item key="searchInput">
                    <SearchInput
                        enterButton
                        value={searchInput}
                        onChange={onChangeSearchInput}
                        onSearch={onSearch}
                    />
                </Menu.Item>
                <Menu.Item key="signup">
                    <Link href="/signup"><a>회원가입</a></Link>
                </Menu.Item>
            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                    {me ? <UserProfile /> : <LoginForm />}
                </Col>
                <Col xs={24} md={12}>
                    {children}
                </Col>
                <Col xs={24} md={6}>
                    <a href="https://velog.io/@front" target="_blank" rel="noreferrer noopner">arnold</a>
                </Col>
            </Row>
        </div>
    );
};

AppLayout.propTypes = {
    children: propTypes.node.isRequired,
};

export default AppLayout;
