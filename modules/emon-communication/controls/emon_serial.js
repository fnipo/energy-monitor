var EmonData = require('../models/emon_data');
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

function EmonSerial (_proccess) {
    var port = new SerialPort('COM6', {
        parser: serialport.parsers.readline('\r\n')
    });
    port.on('data', function (data) {
        var emonData = new EmonData();
        emonData.current = data;
        global.ipc.of.energymonitor.emit('emonserial:data', emonData);
    });
};

module.exports = EmonSerial;