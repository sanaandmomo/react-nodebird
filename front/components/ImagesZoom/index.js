import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import Slick from 'react-slick';

import useInput from '../../hooks/useInput';
import { Overlay, Global, Header, CloseBtn, SlickWrapper, Indicator, ImgWrapper } from './styles';

const ImagesZoom = ({ images, onClose }) => {
    const [currentSlide, onChangeSlide] = useInput(0, (_, newIndex) => newIndex);

    useEffect(
        () => {
            const handleKeyPress = (e) => e.keyCode === 27 && onClose();

            window.addEventListener('keyup', handleKeyPress);

            return () => {
                window.removeEventListener('keyup', handleKeyPress);
            };
        },
        [],
    );

    return (
        <Overlay>
            <Global />
            <Header>
                <h1>상세 이미지</h1>
                <CloseBtn onClick={onClose}>X</CloseBtn>
            </Header>
            <SlickWrapper>
                <div>
                    <Slick
                        initialSlide={0}
                        beforeChange={onChangeSlide}
                        infinite
                        arrows={false}
                        slidesToShow={1}
                        slidesToScroll={1}
                    >
                        {images.map(({ id, src }) => (
                            <ImgWrapper key={id}>
                                <img src={`http://localhost:3065/${src}`} alt={src} />
                            </ImgWrapper>
                        ))}
                    </Slick>
                    <Indicator>
                        <div>
                            {currentSlide + 1}
                            {' '}
                            /
                            {' '}
                            {images.length}
                        </div>
                    </Indicator>
                </div>
            </SlickWrapper>
        </Overlay>
    );
};

ImagesZoom.propTypes = {
    images: propTypes.arrayOf(propTypes.object).isRequired,
    onClose: propTypes.func.isRequired,
};

export default ImagesZoom;
