var app = angular.module('EnergyMonitor.Monitor');
app.controller('MonitorController', function ($scope) {
        
    $scope.test = 'Monitor!! :)';
    $scope.data = 'null';
    
    /** IPC CONFIGURATION */
	var ipc = load('node-ipc');

	ipc.config.id = 'energymonitor';
	ipc.config.retry = 1500;
	ipc.config.silent = true;
    
    ipc.serve(function () {
		//modules.loadSerial();
        
		// $('#viewer').removeClass('hideLoad');
		// $('#bigLoading').addClass('hideLoad');

		ipc.server.on('emonserial:data', function (data, socket) {
            $scope.data = data;
            
			// modules.server.printer_hardware.getByVidPid(data.vendorId, data.productId, function (hardware, error) {
			// 	if (hardware) {
			// 		ipc.server.emit(socket, 'printer:discover', hardware);
			// 	} else {
			// 		ipc.server.emit(socket, 'printer:discover', null);

			// 		$scope.dialog = {
			// 			title: 'Print error',
			// 			message: 'Unknown printer.'
			// 		};
			// 		$scope.$apply();
			// 	}
			// });
		});
	});

	ipc.server.start();
    
});