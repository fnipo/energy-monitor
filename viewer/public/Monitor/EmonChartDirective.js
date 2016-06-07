var app = angular.module('EnergyMonitor.Monitor');
app.directive('emonChart', ['$templateCache', function($templateCache) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var plot = $.plot($(attrs.id), 
                scope.chart[attrs.id].data, 
                scope.chart[attrs.id].options);
            scope.chart[attrs.id].chartObject = plot;
        }
    }
}]);