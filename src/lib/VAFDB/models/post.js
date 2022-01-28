const {Schema, model} = require('mongoose');

const Post = new Schema({
    uuid: {type: String, required: true},
    text: {type: String, default: ''},
    photo: {type: Array, default: []},
    author: [{type: String, required: true}]
});

module.exports = model('Post', Post);