const passport = require('passport');
const kakao = require('./kakaoStrategy');

const User = require('../models/users').User;

module.exports = () => {

    passport.serializeUser((user, done) => {
        done(null, { id: user.user._id, accessToken: user.accessToken });  // user 객체와 accessToken을 세션에 저장
    });

    passport.deserializeUser((sessionData, done) => {
        const { id, accessToken } = sessionData;
        User.findById(id)
            .then(user => {
                if (user) {
                    done(null, { user, accessToken });  // 유저 객체와 accessToken을 req.user에 저장
                } else {
                    done(new Error('사용자를 찾을 수 없습니다.'));
                }
            })
            .catch(err => done(err));
    });

    kakao();  // 카카오 전략 설정
};