var app = angular.module('EnergyMonitor.Monitor');
app.directive('emonChart', function() {
    return {
        restrict: 'A',
        template: '<canvas></canvas>',
        link: function(scope, elem, attrs) {
            var canvas = $(elem).children('canvas')[0];
            canvas.attr('width', scope.emonChart.canvasConfig.width);
            canvas.attr('height', scope.emonChart.canvasConfig.height);
            
            var chart = new Chart(elem, scope.emonChart.chartConfig);
        }
    }
});