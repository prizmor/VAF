const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const { v4: uuidv4 } = require('uuid');

//VLADOS API FRAMEWORK DATA BASE
class VAFDB {
    async connect() {
        await mongoose.connect(`mongodb+srv://prizmor:prizmor@cluster0.4zktz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    }

    async search(model, field, data) {
        let obj = {};
        obj[field] = data;

        return await model.findOne(obj);
    }

    async createUser(login, password, email, firstName, lastName) {
        const Password = bcrypt.hashSync(password, 7);
        console.log(login, password, email, firstName, lastName);
        const user = new User({login: login, password: Password, email: email, firstName: firstName, lastName: lastName, uuid: uuidv4()});

        await user.save();
    }
}

module.exports = new VAFDB();