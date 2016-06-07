var app = angular.module('EnergyMonitor.Monitor');
app.directive('emonChart', ['$templateCache', function($templateCache) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var chart = new Chart(elem, scope.emonChart[attrs.id]);
            scope.emonChart[attrs.id].chartObject = chart;
        }
    }
}]);