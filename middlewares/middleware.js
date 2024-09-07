// 로그인 확인
exports.isLoggedIn = (req, res, next) => {
    if(req.session.passport) {
        next();
    } else {
        res.status(403).json({ message: '로그인이 필요합니다.' });
    }
};