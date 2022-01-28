const VAF = require('./../../lib/VAF');
const VAFDB = require('./../../lib/VAFDB');


const register = async (req, res) => {
    try {
        const { login, password, email, lastName, firstName } = req.body;

        let err = await VAF.sendBoolError(req, res, [login, password, email, lastName, firstName]);
        if (err) return;

        err = await VAF.sendMailError(req, res, email);
        if (err) return;

        err = await VAF.sendDuplicateUserError(req, res, login);
        if (err) return;

        await VAFDB.createUser(login, password, email, firstName, lastName);

        await VAF.send(req, res, {
            code: 'OK',
            message: 'User created.'
        }, 200);
    } catch (e) {
        await VAF.sendServerError(req, res);
    }
};

module.exports = register;