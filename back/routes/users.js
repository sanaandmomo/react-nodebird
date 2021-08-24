const express = require('express');

const { User } = require('../models');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

// GET /users/followers
router.get('/followers', isLoggedIn, async (req, res, next) => {
    try {
        const followers = await req.user.getFollowers({
            limit: 3,
        });

        res.status(200).json(followers);
    } catch {
        console.error(error);
        next(error);
    }
});

// GET /users/followings
router.get('/followings', isLoggedIn, async (req, res, next) => {
    try {
        const followings = await req.user.getFollowings({
            limit: 3,
        });

        res.status(200).json(followings);
    } catch {
        console.error(error);
        next(error);
    }
});

module.exports = router;