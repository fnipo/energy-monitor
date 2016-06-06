var app = angular.module('EnergyMonitor.Monitor');
app.controller('MonitorController', function ($scope) {
	
	var labelsArray = [];
	
	$scope.emonChart = {
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
						display: false,
					}
				}]
			}
		},
		
		chartObject: {},
		updateDataBuffer: function(value) {
			var dataBuffer = $scope.emonChart.data.datasets[0].data; 
			if (dataBuffer.length >= 500) {
				dataBuffer.shift();
			} else {
				labelsArray.push('');
			}
			dataBuffer.push(value);
			$scope.emonChart.chartObject.update();
		}
	};
	
    /** IPC CONFIGURATION */
	var ipc = load('node-ipc');
	ipc.config.id = 'energymonitor';
	ipc.config.retry = 1500;
	ipc.config.silent = true;
    ipc.serve(function () {        
		ipc.server.on('emonserial:data', function (data, socket) {
			$scope.emonChart.updateDataBuffer(data.current);
            $scope.$apply();
		});
	});

	ipc.server.start();
    
});