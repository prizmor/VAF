const {Schema, model} = require('mongoose');

const User = new Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    searchHistory: [{type: String}],
    status: {type: String, default: ''},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    friends: [{type: String}],
    posts: [{type: String}],
    uuid: {type: String, required: true},
    blackList: [{type: String}]
});

module.exports = model('User', User);