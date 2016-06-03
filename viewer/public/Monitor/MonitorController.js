var app = angular.module('EnergyMonitor.Monitor');
app.controller('MonitorController', function ($scope) {
        
    $scope.test = 'Monitor!! :)';
    $scope.data = 'null';
    $scope.chartData = [12, 19, 3, 5, 2, 3, 5, 20, 30, 1, 10];
	
	$scope.emonChart = {};
	$scope.emonChart.canvasConfig = {
		width: 400,
		height: 400
	};
	$scope.emonChart.chartConfig = {
		type: 'line',
		data: {
			labels: [
				"0ms", 
				"0.1s", 
				"0.2s", 
				"0.3s", 
				"0.4s", 
				"0.5s",
				"0.6s",
				"0.7s",
				"0.8s",
				"0.9s",
				"1s"
			],
			datasets: [{
				label: 'Current',
				data: [12, 19, 3, 5, 2, 3, 5, 20, 30, 1, 10],
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
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}]
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
            $scope.data = data.current;
            $scope.$apply();
		});
	});

	ipc.server.start();
    
});