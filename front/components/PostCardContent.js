import React from 'react';
import propTypes from 'prop-types';
import Link from 'next/link';

const hashtagRegex = /(#[^\s#]+)/g;

const PostCardContent = ({ postData }) => (
    <div>
        {postData.split(hashtagRegex).map((word, i) => {
            if (hashtagRegex.test(word)) {
                return <Link href={`/hashtag/${word.slice(1)}`} key={i}><a>{word}</a></Link>;
            }

            return word;
        })}
    </div>
);

PostCardContent.propTypes = {
    postData: propTypes.string.isRequired,
};

export default PostCardContent;
