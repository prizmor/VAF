const VAF = require('./../../lib/VAF');
const VAFDB = require('./../../lib/VAFDB');
const User = require('./../../lib/VAFDB/models/user');

const login = async (req, res) => {
    try {
        const { login, password } = req.body;

        let err = await VAF.sendBoolError(req, res, [login, password]);
        if (err) return;

        err = await VAF.userVisibilityError(req, res, login);
        if (err) return;

        err = await VAF.checkPasswordError(req, res, login, password);
        if (err) return;

        const token = VAF.generateToken({login});

        await VAF.send(req, res, {
            code: 'OK',
            token: token
        }, 200);
    } catch (e) {
        await VAF.sendServerError(req, res);
    }
};

module.exports = login;