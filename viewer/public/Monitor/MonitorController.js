var app = angular.module('EnergyMonitor.Monitor');
app.controller('MonitorController', function ($scope) {
	
	var fft = load('fft-js').fft;
	var fftUtil = load('fft-js').util;
	
	var labelsArray = [];
	
	$scope.chart = [];
	$scope.chart[0] = {
		data: [],
		options: {
			
		},
		
		chartObject: {},
		updateDataBuffer: function(value) {
			this.data.datasets[0].data; 
			if (this.data.length >= 300) {
				this.data.shift();
			}
			this.data.push(value);
			this.chartObject.draw();
		}
	};
	
	$scope.chart[1] = {
		data: [],
		options: {
			
		},
		
		// updateFFTBuffer: function(value) {
		// 	var dataBuffer = this.data.datasets[0].baseData; 
		// 	if (dataBuffer.length >= 300) {
		// 		dataBuffer.shift();
		// 	}
		// 	dataBuffer.push(value);
			
		// 	var phasors = fft(dataBuffer);
		// 	// sampleRate: 100 samples per second
		// 	var frequencies = fftUtil.fftFreq(phasors, 100);
    	// 	var magnitudes = fftUtil.fftMag(phasors);
			
		// 	this.data.labels = frequencies.slice();
		// 	this.data.datasets[0].data = magnitudes.slice();
			
		// 	this.chartObject.update();
		// }
	};
	
    /** IPC CONFIGURATION */
	var ipc = load('node-ipc');
	ipc.config.id = 'energymonitor';
	ipc.config.retry = 1500;
	ipc.config.silent = true;
    ipc.serve(function () {        
		ipc.server.on('emonserial:data', function (data, socket) {
			$scope.emonChart[0].updateDataBuffer(data.current);
			// $scope.emonChart[1].updateFFTBuffer(data.current);
            $scope.$apply();
		});
	});

	ipc.server.start();
    
});