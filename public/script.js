var nameApp = angular.module('starter', ['ionic', 'uiGmapgoogle-maps', 'btford.socket-io']);

nameApp.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.html',
      controller: 'HomeCtrl'
    });
  $urlRouterProvider.otherwise("/");

});


nameApp.factory('socket', function (socketFactory) {
  return socketFactory({
    prefix: 'foo~',
    ioSocket: io.connect('http://localhost:4444')
  });
});


nameApp.controller('HomeCtrl', function($scope, uiGmapGoogleMapApi, socket) {
  socket.on('fromServer', function ( data ) {
    console.log(data);
    $scope.firstSensorValues = data[0];
    $scope.secondSensorValues = data[1];
    $scope.thirdSensorValues = data[2];
  });
  socket.emit('event', 'hello! from angular');

  $scope.map = { center: { latitude: 11.633279, longitude: 122.226246 }, zoom: 6 };
  //11.633279, 122.226246
  $scope.showRange = false;
  $scope.toggleRange = function(){
    console.log('hey');
    angular.forEach($scope.circles, function (circle) {
        if (circle.visible) {
          circle.visible = false;
        } else {
          circle.visible = true;
        }
    });

  }

  $scope.myLocation = {
    lng : '',
    lat: ''
  }

  $scope.firstSensorCoordinates = {
    lng : 125.020243,
    lat: 11.202628
  }

  $scope.secondSensorCoordinates = {
    lng : 125.022088,
    lat: 11.206891
  }

  $scope.thirdSensorCoordinates = {
    lng : 125.011261,
    lat: 11.210081
  }

  $scope.circles = [
      {
          id: 4,
          center: {
              latitude: $scope.firstSensorCoordinates.lat,
              longitude: $scope.firstSensorCoordinates.lng
          },
          radius: 300,
          stroke: {
              color: '#08B21F',
              weight: 2,
              opacity: 1
          },
          fill: {
              color: '#08B21F',
              opacity: 0.1

          },
          geodesic: true, // optional: defaults to false
          visible: false, // optional: defaults to true
          control: {}
      },
      {
          id: 5,
          center: {
              latitude: $scope.secondSensorCoordinates.lat,
              longitude: $scope.secondSensorCoordinates.lng
          },
          radius: 300,
          stroke: {
              color: '#08B21F',
              weight: 2,
              opacity: 1
          },
          fill: {
              color: '#08B21F',
              opacity: 0.1

          },
          geodesic: true, // optional: defaults to false
          visible: false, // optional: defaults to true
          control: {}
      },
      {
          id: 6,
          center: {
            latitude: $scope.thirdSensorCoordinates.lat,
            longitude: $scope.thirdSensorCoordinates.lng
          },
          radius: 300,
          stroke: {
              color: '#08B21F',
              weight: 2,
              opacity: 1
          },
          fill: {
              color: '#08B21F',
              opacity: 0.1

          },
          geodesic: true, // optional: defaults to false
          visible: false, // optional: defaults to true
          control: {}
      }

  ];

  $scope.markerA = {
    id: 0,
    coords: {
      latitude: $scope.firstSensorCoordinates.lat,
      longitude: $scope.firstSensorCoordinates.lng
    }
  };

  $scope.markerA.options = {
    draggable: false,
    labelContent: "Sensor A" + '<br/> ' + "lat: " + $scope.markerA.coords.latitude + '<br/> ' + 'lon: ' + $scope.markerA.coords.longitude,
    labelAnchor: "80 120",
    labelClass: "marker-labels"
  };

  $scope.markerB = {
    id: 0,
    coords: {
      latitude: $scope.secondSensorCoordinates.lat,
      longitude: $scope.secondSensorCoordinates.lng
    }
  };

  $scope.markerB.options = {
    draggable: false,
    labelContent: "Sensor B" + '<br/> ' + "lat: " + $scope.markerB.coords.latitude + '<br/> ' + 'lon: ' + $scope.markerB.coords.longitude,
    labelAnchor: "80 120",
    labelClass: "marker-labels"
  };

  $scope.markerC = {
    id: 0,
    coords: {
      latitude: $scope.thirdSensorCoordinates.lat,
      longitude: $scope.thirdSensorCoordinates.lng
    }
  };

  $scope.markerC.options = {
    draggable: false,
    labelContent: "Sensor C" + '<br/> ' + "lat: " + $scope.markerC.coords.latitude + '<br/> ' + 'lon: ' + $scope.markerC.coords.longitude,
    labelAnchor: "80 120",
    labelClass: "marker-labels"
  };

  $scope.firstSensorLoc = function(position) {

    //$scope.$apply is needed to trigger the digest cycle when the geolocation arrives and to update all the watchers
    $scope.myLocation.lng = $scope.firstSensorCoordinates.lng;
    $scope.myLocation.lat = $scope.firstSensorCoordinates.lat;
    //11.202628, 125.020243
    $scope.map = {
      center: {
        latitude: $scope.myLocation.lat,
        longitude: $scope.myLocation.lng
      },
      zoom: 16,
      pan: 1
    };

  }

  $scope.secondSensorLoc = function(position) {

    //$scope.$apply is needed to trigger the digest cycle when the geolocation arrives and to update all the watchers
    $scope.myLocation.lng = $scope.secondSensorCoordinates.lng;
    $scope.myLocation.lat = $scope.secondSensorCoordinates.lat;

    $scope.map = {
      center: {
        latitude: $scope.myLocation.lat,
        longitude: $scope.myLocation.lng
      },
      zoom: 16,
      pan: 1
    };

  }

  $scope.thirdSensorLoc = function(position) {

    //$scope.$apply is needed to trigger the digest cycle when the geolocation arrives and to update all the watchers
    $scope.myLocation.lng = $scope.thirdSensorCoordinates.lng;
    $scope.myLocation.lat = $scope.thirdSensorCoordinates.lat;

    $scope.map = {
      center: {
        latitude: $scope.myLocation.lat,
        longitude: $scope.myLocation.lng
      },
      zoom: 16,
      pan: 1
    };

  }

  //navigator.geolocation.getCurrentPosition($scope.drawMap);

});
