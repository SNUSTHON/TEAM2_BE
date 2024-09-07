// 로그인, 로그아웃을 위한 라우터
const express = require('express');
const passport = require('passport');
const { isLoggedIn } = require('../middlewares/middleware');

const router = express.Router();

// 로그인
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',  // 로그인 실패 시
}), (req, res) => {
    const { user, accessToken } = req.user;
    res.cookie('accessToken', accessToken, {
        httpOnly: true,  // JavaScript로 접근 불가
        secure: process.env.NODE_ENV === 'production',  // HTTPS에서만 전송
        maxAge: 60 * 60 * 1000  // 1시간 유효
    });
    res.redirect('/');  // 로그인 성공 시
});


// 로그아웃
router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err);
        } else {
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                res.clearCookie('accessToken');
                res.redirect('/');
            })
        }
    })
});

module.exports = router;