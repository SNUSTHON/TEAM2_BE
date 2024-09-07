const mongoose = require('mongoose');

const answerSchema = new new mongoose.Schema({
    answer_id: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() },
    answer_userid : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    answer_date : { type: Date, required:true},
    contents : { type: String, required: true, minlength:50 },
    checked : { type: Boolean, default: false }
});


const questionSchema = new mongoose.Schema({
    question_id: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() },
    question_userid :{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    question_date : { type: Date, required:true} ,
    contents : { type: String, required: true },
    answers : [answerSchema]
});


const Question = mongoose.model('question', questionSchema);
module.exports = { Question };