angular.module("EnergyMonitor")
	.config(function ($routeProvider) {
		$routeProvider
			.when("/monitor", {
				controller: "MonitorController",
				templateUrl: "./Monitor/monitor.html"
			})
	});

angular.module("EnergyMonitor")
	.config(function ($routeProvider) {
		$routeProvider
			.otherwise({
				redirectTo: "/monitor"
			});
	});