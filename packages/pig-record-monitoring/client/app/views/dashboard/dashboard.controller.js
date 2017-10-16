angular.module('bc-manufacturer')

.controller('DashboardCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

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
            owner: p.owner
          };

          return pig;
        });
        console.log($scope.pigs);
      }
    }
  })

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
          var ownerName, gradeName;
          var newOwner, pig, purchaseDate, grade, purchaseName, passFlag, weight;

          //transactionType아 "org.acme.mynetwork.Process"일 경우에만 데이터 세팅
          if(o.eventsEmitted.length > 0){
            pig = o.eventsEmitted[0].pig.pigId;
            newOwner = o.eventsEmitted[0].newOwner.memberId;
            purchaseDate = o.eventsEmitted[0].purchaseDate;
            grade = o.eventsEmitted[0].grade;
            purchaseName = o.eventsEmitted[0].purchaseName;
            passFlag = o.eventsEmitted[0].passFlag;
            weight = o.eventsEmitted[0].weight;
          }
          if(newOwner == 'BUTCHERY') {
            ownerName = "도축";
            gradeName = "도축 등급";
          }else if(newOwner == 'PACKAGE'){
            ownerName = "포장";
            gradeName = "포장 단위";
          }else if(newOwner == 'RETAILER'){
            ownerName = "판매";
            gradeName = "판매 단위";
          }
          var order = {
            /*class: o.$class,
            pig: o.pig,
            newOwner: o.newOwner,
            purchaseDate: o.purchaseDate,
            grade: o.grade,
            purchaseName: o.purchaseName,
            passFlag: o.passFlag,
            weight: o.weight,
            timestamp: o.timestamp,
            ownerName: ownerName,
            gradeName: gradeName*/
            transactionType: o.transactionType,
            pig: pig,
            newOwner: newOwner,
            purchaseDate: purchaseDate,
            grade: grade,
            purchaseName: purchaseName,
            passFlag: passFlag,
            weight: weight,
            timestamp: o.transactionTimestamp,
            ownerName: ownerName,
            gradeName: gradeName
          };

          return order;
        });
        console.log($scope.orders);
      }
    }
  })

  // Websockets
  var placePig;
  var processPig;
  var destroyed = false;

  function openPlacePigWebSocket() {
    placePig = new WebSocket('ws://' + location.host + '/ws/placepig');
    placePig.onopen = function () {
      console.log('placePig websocket open!' + location.host);
      // Notification('PlacePig WebSocket connected');
    };

    placePig.onclose = function () {
      console.log('closed');
      // Notification('PlacePig WebSocket disconnected');
      if (!destroyed) {
        openPlacePigWebSocket();
      }
    }
  }

  function openProcessPigWebSocket() {
    processPig = new WebSocket('ws://' + location.host + '/ws/processpig');
    processPig.onopen = function () {
      console.log('processPig websocket open!' + location.host);
      // Notification('ProcessPig WebSocket connected');
    };

    processPig.onclose = function () {
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
      var status = JSON.parse(event.data);
      console.log('processPig Event!!!', event.data);

      var ownerName;
      var gradeName;
      // if(status.pig){
      //   status.pig = status.pig.substring(32);
      // }

      if(status.newOwner == 'BUTCHERY') {
        ownerName = "도축";
        gradeName = "도축 등급";
      }else if(status.newOwner == 'PACKAGE'){
        ownerName = "포장";
        gradeName = "포장 단위";
      }else if(status.newOwner == 'RETAILER'){
        ownerName = "판매";
        gradeName = "판매 단위";
      }

      $scope.orders.push({
        class: status.class,
        // class: 'org.acme.mynetwork.Process',
        pig: status.pig,
        newOwner: status.newOwner,
        purchaseDate: status.purchaseDate,
        grade: status.grade,
        purchaseName: status.purchaseName,
        passFlag: status.passFlag,
        weight: status.weight,
        timestamp: status.timestamp,
        ownerName: ownerName,
        gradeName: gradeName
      });

      $scope.$apply();
      console.log("processPig : " + $scope.orders);
    }
  }

  openPlacePigWebSocket();
  openProcessPigWebSocket();

  var updatePigStatus = function(status, count) {
    if (count === 2) {
      status.vin = generateVIN();
    }
    status.orderStatus = $scope.statuses[count];
    status.timestamp =  Date.now();
    updateOrder.send(JSON.stringify(status));
  }

  $scope.$on('$destroy', function () {
    destroyed = true;
    if (placePig) {
      placePig.close();
    }
    if (updatePig) {
      updatePig.close();
    }
  });
}])