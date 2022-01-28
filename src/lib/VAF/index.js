const express = require('express');
const cors = require('cors');
const axios = require('axios');
const VAFDB = require('./../VAFDB/index');
const User = require('./../VAFDB/models/user');
const errors = require('./../../lib/halpers/errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//VLADOS API FRAMEWORK
class VAF {

    server = null;
    port = null;

    create() {
        this.server = express();

        this.server.use(cors());
        this.server.use(express.json());

        this.server.use(function (req, res, next) {

            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            res.setHeader('Access-Control-Allow-Credentials', true);

            next();
        });
    }

    async start(port, callback) {
        this.port = port;

        try {
            await VAFDB.connect();
            this.server.listen(this.port, () => callback());
            //require('./websocket/index')(io);
        } catch (e) {
            callback(e);
        }
    }

    async send(req, res, data, status) {
        await res.status(status).json({
            data: data,
            status: status,
            url: req.url
        });
    }

    async getNews(req = {
        q: null,
        qInTitle: null,
        sources: null,
        domains: null,
        excludeDomains: null,
        from: null,
        to: null,
        language: null,
        sortBy: null,
        pageSize: null,
        page: null
    }) {
        let params = {
            q: req.q,
            qInTitle: req.qInTitle,
            sources: req.sources,
            domains: req.domains,
            excludeDomains: req.excludeDomains,
            from: req.from,
            to: req.to,
            language: req.language,
            sortBy: req.sortBy,
            pageSize: req.pageSize,
            page: req.page,
            apiKey: '4c06d2e84be44df5b43015e0be2844dc'
        }

        for (let propName in params) {
            if (params[propName] === null || params[propName] === undefined) {
                delete params[propName];
            }
        }

        return await axios.get('https://newsapi.org/v2/everything', {
            params: params
        }).then((data) => {
            return data.data;
        });

    }

    async sendBoolError(req, res, array) {
        for (let i = 0; i < array.length; i++) {
            if (!array[i]) {
               await this.send(req, res, errors.incorrectData, errors.incorrectData.status);
               return true;
            }
        }

        return false;
    }

    async sendDuplicateUserError(req, res, data) {
        let duplicate = await VAFDB.search(User, 'login', data);

        if (duplicate !== null) {
            await this.send(req, res, errors.duplicateUser, errors.duplicateUser.status);
            return true;
        }

        return false;
    }

    async sendServerError(req, res) {
        await this.send(req, res, errors.serverError, errors.serverError.status);
    }

    async sendMailError(req, res, email) {
        const re = /\S+@\S+\.\S+/;

        if (!re.test(email)) {
            await this.send(req, res, errors.incorrectData, errors.incorrectData.status);
            return true;
        }

        return false;
    }

    generateToken(data) {
        return jwt.sign(data, 'vlados', {expiresIn: '24h'});
    }

    async userVisibilityError(req, res, login) {
        let user = await VAFDB.search(User, 'login', login);

        if (!user) {
            await this.send(req, res, errors.incorrectData, errors.incorrectData.status);
            return true;
        }

        return false;
    }

    async checkPasswordError(req, res, login, password) {
        const user = await VAFDB.search(User, 'login', login);

        const Password = bcrypt.compareSync(password, user.password);

        if (!Password) {
            await this.send(req, res, errors.incorrectData, errors.incorrectData.status);
            return true;
        }

        return false;
    }
}

module.exports = new VAF();