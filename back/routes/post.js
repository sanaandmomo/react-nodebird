const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Comment, Image, User, Hashtag } = require('../models');
const { isLoggedIn, isExistPost } = require('../middlewares');

const router = express.Router();

try {
    fs.accessSync('uploads');
} catch (error) {
    console.log('uploads 폴더가 없으므로 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) { // arnold.png
            const ext = path.extname(file.originalname); // 확장자 추출(.png)
            const basename = path.basename(file.originalname, ext); // arnold
            done(null, `${basename}_${new Date().getTime()}${ext}`); // arnold_151846789451.png
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// GET /post/1 게시글 조회
router.get('/:postId', isExistPost, async (req, res, next) => {
    try {
        const fullPost = await Post.findOne({
            where: { id: req.params.postId },
            include: [
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
                {   // 게시글 작성자
                    attributes: ['id', 'nickname'],
                    model: User, 
                },
                {   // 게시글 이미지
                    model: Image,
                },
                {
                    // 댓글
                    model: Comment,
                    include: [
                        {   // 댓글 작성자
                            attributes: ['id', 'nickname'],
                            model: User,
                        }
                    ]
                },
                {   // 좋아요 누른 사람
                    attributes: ['id'],
                    as: 'Likers', 
                    model: User, 
                },
            ],
        });

        res.status(200).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST /post 게시글 작성 
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { 
    try {
        // 게시글 생성
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });

        // 해시 태그
        const hashtags = req.body.content.match(/#[^\s#]+/g);

        if (hashtags) {
            const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({ 
                where: { name: tag.slice(1).toLowerCase() },
            })));
            await post.addHashtags(result.map((v) => v[0]));
        }

        // 이미지를 업로드했을 때
        if (req.body.image) {
            const images = Array.isArray(req.body.image) ? req.body.image : [req.body.image];
            const createImages = await Promise.all(images.map(image => Image.create({ src: image })));
            await post.addImages(createImages);
        }

        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [
                {
                    model: Image,
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User, 
                            attributes: ['id', 'nickname'],
                        },
                    ],
                },
                {   // 게시글 작성자
                    model: User, 
                    attributes: ['id', 'nickname'],
                },
                {   // 좋아요 누른 사람
                    model: User, 
                    as: 'Likers', 
                    attributes: ['id'],
                },
            ]
        });

        res.status(201).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST /post/images 이미지 업로드
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => { 
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
});

// POST /post/${postId}/retweet 리트윗
router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
            include: [
                {
                    model: Post,
                    as: 'Retweet',
                },
            ],
        });

        if (!post) return res.status(403).send('존재하지 않는 게시글입니다.');

        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
        }

        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await Post.findOne({
            where: {
                UserId: req.user.id, 
                RetweetId: retweetTargetId,
            },
        });

        if (exPost) return res.status(403).send('이미 리트윗 했습니다.');

        const retweet = await Post.create({
            UserId: req.user.id, 
            RetweetId: retweetTargetId, 
            content: 'retweet',
        });
        const retweetWithPrevPost = await Post.findOne({
            where: { id: retweet.id },
            include: [
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
                {   // 게시글 작성자
                    attributes: ['id', 'nickname'],
                    model: User, 
                },
                {   // 게시글 이미지
                    model: Image,
                },
                {
                    // 댓글
                    model: Comment,
                    include: [
                        {   // 댓글 작성자
                            attributes: ['id', 'nickname'],
                            model: User,
                        }
                    ]
                },
                {   // 좋아요 누른 사람
                    attributes: ['id'],
                    as: 'Likers', 
                    model: User, 
                },
            ],
        });

        res.status(201).json(retweetWithPrevPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST /post/${postId}/comment 댓글 작성 
router.post('/:postId/comment', isLoggedIn, isExistPost, async (req, res, next) => {
    try {
        const comment = await Comment.create({
            content: req.body.content,
            PostId: Number(req.params.postId),
            UserId: req.user.id,
        });
        const fullComment = await Comment.findOne({
            where: { id: comment.id },
            include: [
                {
                    model: User,
                    attributes: ['id', 'nickname'],
                },
            ],
        });

        res.status(201).json(fullComment);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// PATCH /post/1/like 좋아요 등록
router.patch('/:postId/like', isLoggedIn, isExistPost, async (req, res, next) => {
    try {
        const { post } = res.locals;

        await post.addLikers(req.user.id);

        res.status(200).json({ PostId: post.id, UserId: req.user.id });
    } catch(error) {
        console.error(error);
        next(error);
    }
});

// DELETE /post/1/unlike 좋아요 삭제
router.delete('/:postId/unlike', isLoggedIn, isExistPost, async (req, res, next) => {
    try {
        const { post } = res.locals;

        await post.removeLikers(req.user.id);

        res.status(200).json({ PostId: post.id, UserId: req.user.id });
    } catch(error) {
        console.error(error);
        next(error);
    }
});

// DELETE /post/1 포스트 삭제
router.delete('/:postId', isLoggedIn, async (req, res) => {
    try {
        await Post.destroy({
            where: { 
                id: req.params.postId,
                UserId: req.user.id, 
            },
        });

        res.status(200).json({ PostId: Number(req.params.postId) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;