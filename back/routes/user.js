const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');

const { User, Post, Image, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

const router = express.Router();

// GET /user 내 정보 얻기
router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        if (req.user) {
            const fullUserWithoutPassword = await User.findOne({
                attributes: {
                    exclude: ['password'],
                },
                where: { id: req.user.id },
                include: [
                    {
                        attributes: ['id'],
                        model: Post,
                    },
                    {
                        attributes: ['id'],
                        model: User,
                        as: 'Followings',
                    },
                    {
                        attributes: ['id'],
                        model: User, 
                        as: 'Followers',
                    },
                ],
            });

        
            return res.status(200).json(fullUserWithoutPassword);
        }
 
        res.status(200).json(null);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// GET /user/1 유저 정보 얻기 
router.get('/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const fullUserWithoutPassword = await User.findOne({
            attributes: {
                exclude: ['password'],
            },
            where: { id: req.params.userId },
            include: [
                {
                    attributes: ['id'],
                    model: Post,
                },
                {
                    attributes: ['id'],
                    model: User,
                    as: 'Followings',
                },
                {
                    attributes: ['id'],
                    model: User, 
                    as: 'Followers',
                },
            ],
        });

        if (fullUserWithoutPassword) {
            const data = fullUserWithoutPassword.toJSON();
            data.Posts = data.Posts.length;
            data.Followers = data.Followers.length;
            data.Followings = data.Followings.length;
            return res.status(200).json(data);
        }
 
        res.status(404).send('존재하지 않는 사용자입니다.');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST /user/login 로그인
router.post('/login', isNotLoggedIn, (req, res, next) => (
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            console.error(error);
            next(error);
        }

        if (info) {
            return res.status(401).send(info.reason);
        }

        req.login(user, async (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }

            const fullUserWithoutPassword = await User.findOne({
                attributes: {
                    exclude: ['password'],
                },
                where: { id: user.id },
                include: [
                    {
                        model: Post,
                    },
                    {
                        model: User,
                        as: 'Followings',
                    },
                    {
                        model: User, 
                        as: 'Followers',
                    },
                ],
            });

            res.status(200).json(fullUserWithoutPassword);
        });
    })(req, res, next)
));

// POST /user/ 회원 가입
router.post('/', isNotLoggedIn, async (req, res, next) => { 
    try {
        const { email, nickname, password } = req.body;

        const exUser = await User.findOne({
            where: { email }
        });

        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디입니다.');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
    
        await User.create({
            email,
            nickname,
            password: hashedPassword,
        });
    
        res.status(201).send('ok');
    } catch (error) {
        console.error(error);
        next(error); // status 500
    }
});

// POST /user/logout
router.post('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
});

// PATCH /user/nickname
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try {
        await User.update(
            {
                nickname: req.body.nickname,
            },
            {
                where: { id: req.user.id },
            },
        );

        res.status(200).json({ nickname: req.body.nickname });
    } catch {
        console.error(error);
        next(error);
    }
});

// PATCH /user/1/follow
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
    try {
        const userId = Number(req.params.userId);
        const user = await User.findOne({ where: { id: userId }});

        if (!user) return res.status(403).send('없는 사람을 팔로우하려고 하시네요?');

        if (userId === req.user.id) return res.status(403).send('자기 자신을 팔로잉할 수 없습니다.');

        await req.user.addFollowings(userId);

        res.status(200).json({ UserId: userId });
    } catch {
        console.error(error);
        next(error);
    }
});

// DELETE /user/1/unfollow
router.delete('/:userId/unfollow', isLoggedIn, async (req, res, next) => {
    try {
        const userId = Number(req.params.userId);
        const user = await User.findOne({ where: { id: userId } });

        if (!user) return res.status(403).send('없는 사람을 언팔로우하려고 하시네요?');

        await req.user.removeFollowings(userId);

        res.status(200).json({ UserId: userId });
    } catch {
        console.error(error);
        next(error);
    }
});

// DELETE /user/1/follower
router.delete('/:userId/follower', isLoggedIn, async (req, res, next) => {
    try {
        const userId = Number(req.params.userId);
        const user = await User.findOne({ where: { id: userId } });

        if (!user) return res.status(403).send('없는 사람을 차단하려고 하시네요?');

        await req.user.removeFollowers(userId);

        res.status(200).json({ UserId: userId });
    } catch {
        console.error(error);
        next(error);
    }
});

// GET /user/1/posts 유저의 포스트 가져오기
router.get('/:userId/posts', async (req, res, next) => {
    try {
        const lastId = Number(req.query.lastId);
        const where = { UserId: req.params.userId };

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