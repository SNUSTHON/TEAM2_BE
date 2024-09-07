const express = require('express');
const app = express();

const connectDB = require('./configs/mongodb');
//라우트 가져오기
/*
//
const userRoutes = require('./routes/userRoutes');
*/
require('dotenv').config();
const port = process.env.PORT || 5000;

let collections;
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res)=> {
    res.end("Heollo Snust");
})

//라우트 정의
/*
app.use('api/users', userRoutes);
*/

app.listen(port, async() => {
    console.log(`Server running at http://localhost:${port}`);


    try {
        const mongoClient = await connectDB();
        const collection = mongoClient.db().collection('users'); 
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
});