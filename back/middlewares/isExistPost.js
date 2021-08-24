const { Post } = require('../models');

module.exports = async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.postId }});

        if (!post) return res.status(404).send('게시글이 존재하지 않습니다.');

        res.locals.post = post;
        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
};