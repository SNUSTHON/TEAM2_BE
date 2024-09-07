const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    schedule_id: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() },
    mentee_id : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    date : { type: Date, required:true},
    reviews : { type: String, minlength:50},
    rating : { type: Number, required: true }, 
    iscompleted: { type: Boolean, default: false } 
});

const mentoringSchema = new mongoose.Schema({
    mentoring_id: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() },
    mentor_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    title : { type: String, maxlength:100},
    contents : { type: String, required: true }, //멘토링신청내용
    supplies : { type: String, minlength:50},
    topics : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }], 
    available_date : { type: [Date], required:true},
    token : {type: Number, required:true},
    schedule : [scheduleSchema]
});


const Mentoring = mongoose.model('Mentoring', mentoringSchema);
module.exports = { Mentoring };