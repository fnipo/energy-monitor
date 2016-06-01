var serialPort = require('serialport');
global.ipc = require('node-ipc');

function EmonSerial (_proccess) {
    var port = serialPort.SerialPort('COM3');
    port.on('data', function (data) {
        global.ipc.of.energymonitor.emit('emonserial:data', data);
    });
};

module.exports = EmonSerial;