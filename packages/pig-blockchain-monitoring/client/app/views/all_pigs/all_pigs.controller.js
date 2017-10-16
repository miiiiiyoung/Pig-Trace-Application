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

          var newOwner, pig, purchaseDate, grade, purchaseName, passFlag, weight;
          /*if(o.pig) {
            o.newOwner = o.newOwner.substring(35);
            o.pig = o.pig.substring(32);
          }*/
          if(o.eventsEmitted.length > 0){
            pig = o.eventsEmitted[0].pig.pigId;
            newOwner = o.eventsEmitted[0].newOwner.memberId;
            purchaseDate = o.eventsEmitted[0].purchaseDate;
            grade = o.eventsEmitted[0].grade;
            purchaseName = o.eventsEmitted[0].purchaseName;
            passFlag = o.eventsEmitted[0].passFlag;
            weight = o.eventsEmitted[0].weight;
          }
          
          var order = {
            /*process: {
              class: o.$class,
              pig: o.pig,
              newOwner: o.newOwner,
              purchaseDate: o.purchaseDate,
              grade: o.grade,
              purchaseName: o.purchaseName,
              passFlag: o.passFlag,
              weight: o.weight,
              timestamp: o.timestamp,
              transactionId: o.transactionId
            }*/
            transactionType: o.transactionType,
            pig: pig,
            newOwner: newOwner,
            purchaseDate: purchaseDate,
            grade: grade,
            purchaseName: purchaseName,
            passFlag: passFlag,
            weight: weight,
            timestamp: o.transactionTimestamp,
            transactionId: o.transactionId,
            // ownerName: ownerName,
            // gradeName: gradeName
          };

          transactionData.push({
              pig: pig,
              timestamp: o.transactionTimestamp,
              transactionId: o.transactionId,
              newOwner: purchaseName,
              class: o.transactionType
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
