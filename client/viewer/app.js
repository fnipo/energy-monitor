var path = require('path');

global.modulesPath = path.resolve(__dirname, '..', 'modules/');

global.ipc = require('node-ipc');
global.ipc.config.id = 'energymonitor-client';
global.ipc.config.retry = 1500;
global.ipc.config.silent = true;
global.ipc.connectTo('energymonitor', null);

require('../modules/emon-communication/app.js').emon_serial()

module.exports = {
    emon_communication: require('../modules/emon-communication/app.js')
}