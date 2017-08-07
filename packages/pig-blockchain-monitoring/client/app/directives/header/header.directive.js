angular.module('bc-vda')

.directive('bcVdaHeader', ['$location', '$http', function (location, $http) {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/header/header.html',
    link: function (scope) {
      scope.registered_vehicles = 0;
      scope.vin_assigned = 0;
      scope.v5c_issued = 0;
      scope.suspicious_vehicles = 0;
      scope.all_pigs = 0;

      $http.get('/pigs').then(function(response) {
        console.log(response);

        if (response && response.data) {
          for (var i = 0; i < response.data.length; ++i) {
            var pig = response.data[i];

            scope.all_pigs++;

          }
        }
      });

      scope.isActive = function(route) {
        return route === location.path();
      }
    }
  };
}])
