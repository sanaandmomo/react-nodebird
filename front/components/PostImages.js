import React, { useCallback, useState } from 'react';
import propTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';

import ImagesZoom from './ImagesZoom';

const PostImages = ({ images }) => {
    const [showImagesZoom, setShowImagesZoom] = useState(false);

    const onZoom = useCallback(
        () => {
            setShowImagesZoom(true);
        },
        [],
    );

    const onClose = useCallback(
        () => {
            setShowImagesZoom(false);
        },
        []
    )

    if (images.length <= 2) {
        return images.map((image, i) => (
            <>
                <img 
                    key={`${image.src}-${i}`} 
                    role="presentation" 
                    style={{ width: `${100 / images.length}%`, display: 'inline-block' }} 
                    src={`http://localhost:3065/${image.src}`} 
                    alt={image.src} 
                    onClick={onZoom} 
                />
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        ));
    }

    return (
        <>
            <div>
                <img 
                    role="presentation" 
                    style={{ width: '50%' }} 
                    src={`http://localhost:3065/${images[0].src}`}  
                    alt={images[0].src} 
                />
                <div
                    role="presentation"
                    style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }}
                    onClick={onZoom}
                >
                    <PlusOutlined />
                    <br />
                    {images.length - 1}
                    개의 사진 더보기
                </div>
            </div>
            {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
        </>
    );
};

PostImages.propTypes = {
    images: propTypes.arrayOf(propTypes.object)
}

export default PostImages;