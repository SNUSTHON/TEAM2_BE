// 로그인, 로그아웃을 위한 라우터
const express = require('express');
const passport = require('passport');

const router = express.Router();

// 로그인
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',  // 로그인 실패 시
}), (req, res) => {
    res.redirect('/');  // 로그인 성공 시
});


// 로그아웃
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err);
        } else {
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                res.redirect('/');
            })
        }
    })
});

module.exports = router;