const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    profile_id: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() },
    content : { type: String, unique: true, required: true },
    photo : { type: Buffer},
    upload_time : {type : Date}
});

const userSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() },  
    username: { type: String, required: true },
    email: { type: String, unique: true },
    token: { type: Number, required: true },
    my_topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],  // Topic 참조
    favorite_topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    temperature: { type: Number, required: true },
    description: { type: String },
    about_url: { type: String },
    user_img: { type: Buffer},
    profiles : [profileSchema]
});

const User = mongoose.model('User', userSchema);
module.exports = { User };