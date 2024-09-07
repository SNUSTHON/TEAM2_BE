const passport = require('passport');
const kakao = require('./kakaoStrategy');

const User = require('../models/users').User;

module.exports = () => {

    passport.serializeUser((users, done) => {
        console.log(users.user_id);
        done(null, users.user_id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({ where: {user_id : id} })
            .then(users => done(null, users))
            .catch(err => done(err));
    });

    kakao();
}