const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema ({
    topic_id: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() },
    topic_name: { type: String, required: true, unique: true }
})

const Topic = mongoose.model('Topic', topicSchema);

