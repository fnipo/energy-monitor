var app = angular.module('EnergyMonitor.Monitor');
app.controller('MonitorController', function ($scope) {
	
	var fft = load('fft-js').fft;
	var fftUtil = load('fft-js').util;
	
	var labelsArray = [];
	
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
						beginAtZero: true,
						suggestedMax: 200
					}
				}],
				xAxes: [{
					gridLines: {
						display: false
					},
					ticks: {
						//display: false,
						suggestedMax: 300
					}
				}]
			}
		},
		
		chartObject: {},
		updateDataBuffer: function(value) {
			var dataBuffer = this.data.datasets[0].data; 
			if (dataBuffer.length >= 300) {
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
						beginAtZero: true,
						suggestedMax: 15e62
					}
				}],
				xAxes: [{
					gridLines: {
						display: false
					},
					ticks: {
						beginAtZero: true,
						suggestedMax: 4000
					}
				}]
			}
		},
		
		chartObject: {},
		updateFFTBuffer: function(value) {
			var dataBuffer = this.data.datasets[0].baseData; 
			if (dataBuffer.length >= 300) {
				dataBuffer.shift();
			}
			dataBuffer.push(value);
			
			var phasors = fft(dataBuffer);
			// sampleRate: 100 samples per second
			var frequencies = fftUtil.fftFreq(phasors, 100);
    		var magnitudes = fftUtil.fftMag(phasors);
			
			this.data.labels = frequencies.slice();
			this.data.datasets[0].data = magnitudes.slice();
			
			this.chartObject.update();
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
            $scope.$apply();
		});
	});

	ipc.server.start();
    
});