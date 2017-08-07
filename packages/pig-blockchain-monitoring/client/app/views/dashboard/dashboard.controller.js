angular.module('bc-vda')

.controller('DashboardCtrl', ['$scope', '$http', function ($scope, $http) {

  $scope.chain = [];
  $scope.transactions = [];

  $http.get('transactions').then(function(response, err) {
    if (err) {
      console.log(err);
    } else if (Array.isArray(response.data)) {
      var i = 101;

      // 체인 데이터 추가
      $scope.chain = response.data.map(function(transaction) {
        var newOwnerSplit = transaction.newOwner.split('#');
        var newOwner = newOwnerSplit[newOwnerSplit.length - 1];
        var pigIdSplit = transaction.pig.split('#');
        var pigId = pigIdSplit[pigIdSplit.length - 1];
        var time = Date.parse(transaction.timestamp);

        // 트랜잭션 데이터 추가(recent-transaction-table)
        $scope.transactions.push({
          timestamp: time,
          transaction_id: transaction.transactionId,
          transaction_newOwner: newOwner,
          transaction_pig: pigId,
          transaction_purchaseName: transaction.purchaseName
        });

        return {
          transID: transaction.transactionId,
          newOwner: newOwner,
          purchaseName: transaction.purchaseName,
          time: time
        };
      });

      $scope.chain.sort(function(t1, t2) {
        return t1.time - t2.time;
      })

      $scope.chain.map(function(transaction) {
        transaction.id = i++;
        return transaction;
      })
    }
  });

  var processPig;
  var destroyed = false;

  // 웹소켓 연결
  function openProcessPigWebSocket() {
    processPig = new WebSocket('ws://' + location.host + '/ws/processpig');

    processPig.onopen = function() {
      console.log('processPig websocket open!');
      // Notification('ProcessPig WebSocket connected');
    };

    processPig.onclose = function() {
      console.log('closed');
      // Notification('ProcessPig WebSocket disconnected');
      if (!destroyed) {
        openProcessPigWebSocket();
      }
    }

    processPig.onmessage = function(event) {
      if (event.data === '__pong__') {
        return;
      }

      var order = JSON.parse(event.data);
      console.log('processPig Event!!!');
      $scope.addBlock(order.transactionId, order.newOwner, order.pig, order.purchaseName);
      $scope.$apply();
    }
  }

  openProcessPigWebSocket();

  $scope.addBlock = function (tranactionId, newOwner, pig, purchaseName) {
    
    // id값 설정(체인 데이터가 비어있을 경우 id 값은 101로 설정)
    var id;
    if($scope.chain.length == 0) {
      id = 101;
    }else {
      id = $scope.chain[$scope.chain.length - 1].id + 1;
    }

    // 체인 데이터 추가(new-block-alert)
    $scope.chain.push({
      id: id,
      transID: tranactionId,
      newOwner: newOwner,
      purchaseName: purchaseName
    });

    // 트랜잭션 데이터 추가(recent-transaction-table)
    $scope.transactions.push({
      timestamp: Date.now(),
      transaction_id: tranactionId,
      transaction_newOwner: newOwner,
      transaction_pig: pig,
      transaction_purchaseName: purchaseName
    });
  };

  $scope.$on('$destroy', function () {
    destroyed = true;
    if (processPig) {
      processPig.close();
    }
  });
}]);
