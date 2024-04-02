const mongoose = require('mongoose');

const usertrk =new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    imageurl: String,
    type: String,
    check: Boolean,
    url: String,
    count: Number,
    badgecount: Number,
});
const trackschema = new mongoose.Schema({
    email: String,
    track: [usertrk]
});

const usertrackmodal = mongoose.model("usertrack", trackschema);

module.exports = usertrackmodal;
