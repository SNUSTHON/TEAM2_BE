const passport = require('passport');
const kakao = require('./kakaoStrategy');

const User = require('../models/users').User;

module.exports = () => {

    passport.serializeUser((user, done) => {
        done(null, { id: user._id, accessToken: user.accessToken });
    });

    passport.deserializeUser((sessionData, done) => {
        const { id, accessToken } = sessionData;
        User.findById(id)
            .then(user => done(null, { user, accessToken }))
            .catch(err => done(err));
    });

    kakao();
}