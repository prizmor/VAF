const VAF = require('./lib/VAF/index');
const controller = require('./contrllers/index');

VAF.create();

VAF.server.use('/', controller);

VAF.start(5000, () => {
    console.log('start');
});