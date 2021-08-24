const express = require('express');
const { Op } = require('sequelize');

const { Post, Hashtag, Image, Comment, User } = require('../models');

const router = express.Router();

// GET /hashtag/node 해시태그의 포스트 가져오기
router.get('/:hashtag', async (req, res, next) => {
    try {
        const lastId = Number(req.query.lastId);
        const where = {};

        if (lastId) {
            where.id = { [Op.lt]: lastId };
        }

        const posts = await Post.findAll({
            include: [
                {
                    // 작성자
                    model: User,
                    attributes: ['id', 'nickname'],
                },
                {
                    model: Image,
                },
                {
                    model: Comment,
                    include: [
                        {   // 댓글 단 사람
                            model: User, 
                            attributes: ['id', 'nickname'],
                        }
                    ],
                },
                {   // 좋아요 누른 사람
                    model: User, 
                    as: 'Likers', 
                    attributes: ['id'],
                },
                {   // 리트윗 게시글
                    model: Post,
                    as: 'Retweet',
                    include: [
                        {   // 리트윗 게시글 작성자
                            attributes: ['id', 'nickname'],
                            model: User,
                        },
                        {   // 리트윗 게시글 이미지
                            model: Image,
                        }
                    ]
                },
                {   // 해시태그 검색
                    model: Hashtag,
                    where: { name: decodeURIComponent(req.params.hashtag) },
                },
            ],
            where: where,
            order: [['createdAt', 'DESC'], [Comment, 'createdAt', 'DESC']],
            limit: 10,
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;