const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

// const connectDB = require('./configs/mongodb');
const db = process.env.MONGODB_URI;
mongoose.connect(db)
    .then(()=>{
        console.log("conected to mongodb");
    }).catch(error => {
        console.log("mongo error",error);
    }
);

//라우트 가져오기
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const mentoringRoutes = require('./routes/mentoringRoutes');


// 쿠키, 세션 설정
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// passport 설정
const passportConfig = require('./passport');
passportConfig();

app.use(passport.initialize());
app.use(passport.session());

let collections;
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res)=> {
    res.end("Hello Snust");
})

//라우트 정의
app.use('/api/user', userRouter);
app.use('/auth', authRouter);
app.use('/api/mentoring', mentoringRoutes);

app.listen(port, async() => {
    console.log(`Server running at http://localhost:${port}`);
});