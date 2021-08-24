module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) return next();

    res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
};
