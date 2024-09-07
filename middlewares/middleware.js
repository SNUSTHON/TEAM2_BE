// 로그인 확인
exports.isLoggedIn = (req, res, next) => {
    if(req.session.passport) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};