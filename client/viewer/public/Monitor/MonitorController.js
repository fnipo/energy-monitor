var app = angular.module('EnergyMonitor.Monitor');
app.controller('MonitorController', function ($scope) {
	
	var BUFFER_SIZE = 8192;
	
	var fftjs = load('fft-js');
	var fft = fftjs.fft;
	var fftUtil = fftjs.util;
	
	var labelsArray = [];
	
	$scope.data = 10;
	
	$scope.emonChart = [];
	$scope.emonChart[0] = {
		type: 'line',
		data: {
			labels: labelsArray,
			datasets: [{
				label: 'Current (mA)',
				data: [],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)'
				],
				borderColor: [
					'rgba(255,99,132,1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
				],
				borderWidth: 3,
				fill: false,
				lineTension: 0,
				pointRadius: 0
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}],
				xAxes: [{
					gridLines: {
						display: false
					}
				}]
			}
		},
		
		chartObject: {},
		updateDataBuffer: function(value) {
			var dataBuffer = this.data.datasets[0].data; 
			if (dataBuffer.length >= BUFFER_SIZE) {
				dataBuffer.shift();
			} else {
				labelsArray.push(dataBuffer.length);
			}
			dataBuffer.push(value);
			this.chartObject.update();
		}
	};
	
	$scope.emonChart[1] = {
		type: 'line',
		data: {
			labels: labelsArray,
			datasets: [{
				label: 'FFT',
				data: [],
				baseData: [],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)'
				],
				borderColor: [
					'rgba(255,99,132,1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
				],
				borderWidth: 3,
				fill: false,
				lineTension: 0,
				pointRadius: 0
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}],
				xAxes: [{
					gridLines: {
						display: false
					},
					ticks: {
						beginAtZero: true
					}
				}]
			}
		},
		
		chartObject: {},
		updateFFTBuffer: function(value) {
			var dataBuffer = this.data.datasets[0].baseData; 
			if (dataBuffer.length >= BUFFER_SIZE) {
				dataBuffer.shift();
			}
			dataBuffer.push(value);
			
			if (isPowerOf2(dataBuffer.length))
			{
				var phasors = fft(dataBuffer.slice());
				// sampleRate: 3.79 samples per second, 1 sample each 264ms
				var frequencies = fftUtil.fftFreq(phasors, 3.79);
				var magnitudes = fftUtil.fftMag(phasors);
				magnitudes = magnitudes.slice().map(function(val, i) {
					return isNaN(val) ? 0 : val; 
				});
				
				this.data.labels = frequencies.slice();
				this.data.datasets[0].data = magnitudes;
				
				this.chartObject.update();
			}
		}
	};
	
    /** IPC CONFIGURATION */
	var ipc = load('node-ipc');
	ipc.config.id = 'energymonitor';
	ipc.config.retry = 1500;
	ipc.config.silent = true;
    ipc.serve(function () {        
		ipc.server.on('emonserial:data', function (data, socket) {
			$scope.emonChart[0].updateDataBuffer(data.current);
			$scope.emonChart[1].updateFFTBuffer(data.current);
			$scope.data = data.current;
            $scope.$apply();
		});
	});

	ipc.server.start();
	
	var isPowerOf2 = function(value) {
		return ((value & (value - 1)) == 0);
	}
	
});