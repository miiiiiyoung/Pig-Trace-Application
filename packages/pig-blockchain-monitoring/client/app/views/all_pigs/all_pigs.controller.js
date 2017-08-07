angular.module('bc-vda')

.controller('AllPigsCtrl', ['$scope', '$http', function ($scope, $http) {

  var transactionData = [];

  $http.get('transactions').then(function(response, err) {
    console.log(response);
    if (err) {
      console.log(err);
    } else if (response.data.error) {
      console.log(response.data.error.message);
    } else {
      console.log(response.data);
      if (Array.isArray(response.data)) {
        $scope.orders = response.data.map(function(o) {
          
          var order = {
            process: {
              pig: o.pig.substring(32),
              newOwner: o.newOwner.substring(35),
              purchaseDate: o.purchaseDate,
              grade: o.grade,
              purchaseName: o.purchaseName,
              passFlag: o.passFlag,
              weight: o.weight,
              timestamp: o.timestamp,
              transactionId: o.transactionId
            }
          };

          transactionData.push({
              pig: o.pig.substring(32),
              timestamp: o.timestamp,
              transactionId: o.transactionId,
              newOwner: o.purchaseName
            });
          

          return order;
        });
        console.log($scope.orders);
      }
    }
  })

  $http.get('pigs').then(function(response, err) {
    console.log(response);
    if (err) {
      console.log(err);
    } else if (response.data.error) {
      console.log(response.data.error.message);
    } else {
      console.log(response.data);
      if (Array.isArray(response.data)) {
        $scope.pigs = response.data.map(function(p) {
          var pig = {
            pigId: p.pigId,
            birthDate: p.birthDate,
            kind: p.kind,
            color: p.color,
            sex: p.sex,
            importType: p.importType,
            owner: p.owner,
            transactionData: transactionData
          };

          return pig;
        });
        console.log($scope.pigs);
      }
    }
  })

}]);
