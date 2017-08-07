angular.module('bc-vda')

.directive('bcAllPigsTable', [function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/directives/all-pigs-table/all-pigs-table.html',
		scope: {
			pigs: '='
		},
		controller: ['$scope', function($scope) {

			var openEntries = [];
			$scope.toggleEntries = function (index) {
				var open = openEntries.indexOf(index) > -1;
				var overflow = open ? 'hidden' : 'auto';
				var maxHeight = open ? '0px' : '1000px';
				var backgroundColor = open ? '#fff' : '#dfe9ee';

				var row = d3.select('.bc-vda-transaction-details-table-container-' + index)
					.selectAll('td')
					.select('div');

				row.style('overflow', overflow)
					.transition().duration(1000)
					.style('max-height', maxHeight);

				var parentRow = d3.select('.bc-vda-all-pig-row-'+index)
					.transition().duration(1000)
					.style('background-color', backgroundColor);

				if (open) {
					openEntries.splice(openEntries.indexOf(index), 1);

				} else {
					openEntries.push(index);
				}
			};
		}]
	};
}]);