const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/users').User;

module.exports = () => {

    passport.use(new kakaoStrategy({
        callbackURL: '/auth/kakao/callback',
        clientID: process.env.KAKAO_ID,
    }, 
    async (accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        try {
            const exUser = await User.findOne({
                email: profile._json.kakao_account.email // 이메일로 중복 확인
            });
        
            if (exUser) {
                // 이전에 가입한 유저
                console.log('이전에 가입한 유저입니다.');
                done(null, exUser);
            } else {
                // 새로운 유저
                console.log('새로운 유저입니다.');
                const newUser = new User({
                    username: profile.displayName,
                    email: profile._json && profile._json.kakao_account.email,
                    token: 0,
                    temperature: 36.5,
                    user_img: profile._json.properties.profile_image || null,
                });
                await newUser.save();
                done(null, newUser);
            }
        } catch (error) {
            console.log(error);
            done(error);
        }        
    }))
};