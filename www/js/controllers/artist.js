
app.controller('ArtistCtrl', function($scope, $http, $timeout, $ionicLoading, $stateParams, artistService, $state, $rootScope, $ionicModal, $ionicPopup, serviceService, portfolioService, $window) {

  console.log($stateParams);

  $ionicLoading.show({
    template: 'Loading...'
  }).then(function(){
    console.log("The loading indicator is now displayed");
  });

  $scope.tabStatus = {
    services : '',
    portfolio : '',
    reviews : ''
  };

  $scope.userPlaceholder = 'img/placeholder.png'

  $scope.selectedTab = 'services';

  $scope.images = [];

  $scope.totalBill = 0;

  $scope.service = {};

  $scope.portfolio = {};

  getArtistById($stateParams.artistId);

  function getArtistById(id){
    artistService.getArtistById(id)
    .then(function(results) {
      // Handle the result
      $scope.artistProfile = results[0];
      $scope.profile = {
        avatar : results[0].get('avatar'),
        firstName : results[0].get('firstName'),
        lastName : results[0].get('lastName'),
        gender : results[0].get('gender'),
        birthDate : results[0].get('birthDate'),
        email : results[0].get('email'),
        address : results[0].get('address'),
        contactNumber : results[0].get('contactNumber'),
        serviceType : results[0].get('serviceType'),
        currentCoordinates : results[0].get('currentCoordinates'),
        icon : results[0].get('icon') || $scope.userPlaceholder
      }

      getServiceById($scope.artistProfile.id);

      return results;
    }, function(err) {
      $ionicLoading.hide();
      // Error occurred
      console.log(err);
    }, function(percentComplete) {
      console.log(percentComplete);
    });
  }

  function getServiceById(id){
    serviceService.getServiceById(id)
    .then(function(results) {
      // Handle the result
      $scope.artistServices = results;
      getPortfolioById(id);

      return results;
    }, function(err) {
      $ionicLoading.hide();
      // Error occurred
      console.log(err);
    }, function(percentComplete) {
      console.log(percentComplete);
    });
  }

  function getPortfolioById(id){
    portfolioService.getPortfolioById(id)
    .then(function(results) {
      // Handle the result
      $scope.artistPortfolios = results;

      $ionicLoading.hide();
      return results;
    }, function(err) {
      $ionicLoading.hide();
      // Error occurred
      console.log(err);
    }, function(percentComplete) {
      console.log(percentComplete);
    });
  }

  function loading(){
    $ionicLoading.show({
      template: 'Loading...'
    }).then(function(){
      console.log("The loading indicator is now displayed");
    });
  }

  $scope.changeTab = function(tab) {
    $scope.selectedTab = tab;
  }

  $scope.deleteArtist = function(){
    console.log($scope.artistProfile);
    var confirmPopup = $ionicPopup.confirm({
      title: 'Artist',
      template: 'Are you sure you want to delete this artist?',
      okText: 'Yes, I am sure!', // String (default: 'OK'). The text of the OK button.
      okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
    });

    confirmPopup.then(function(res) {
      if(res) {
        loading();
        $scope.artistProfile.destroy({
          success: function(myObject) {
            // The object was deleted from the Parse Cloud.
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: 'Artist',
              template: 'Artist Successfully Deleted'
            });

            alertPopup.then(function(res) {                
              $state.go('app.service', {}, {reload: true});
              $window.location.reload();
            });
          },
          error: function(myObject, error) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: 'Artist',
              template: 'Artist: Delete Failed'
            });

            alertPopup.then(function(res) {
              getArtistById($stateParams.artistId);
            });
          }
        });

      } else {
        console.log('You are not sure');
      }
    });

  }

  $scope.addPortfolio = function(uploadFile){
    if(uploadFile){
      loading();
      $http.post("https://muse-rest-api.herokuapp.com/parse/files/image.jpg", uploadFile, {
        withCredentials: false,
        headers: {
          'X-Parse-Application-Id': 'myAppId',
          'X-Parse-REST-API-Key': 'myRestAPIKey',
          'Content-Type': 'image/jpeg'
        },
        transformRequest: angular.identity
      }).then(function(data) {
        console.log(data.data.url);
        var Portfolio = Parse.Object.extend("Portfolio");
        var portfolio = new Portfolio();

        portfolio.set("imagePath", data.data.url);
        portfolio.set("description", $scope.portfolio.description);
        portfolio.set("ownerId", $scope.artistProfile.id);
        portfolio.set("artistInfo", {
            "name": $scope.artistProfile.get('firstName') + ' ' + $scope.artistProfile.get('lastName'),
            "avatar": $scope.artistProfile.get('avatar'),
            "id": $scope.artistProfile.id
        });
        
        console.log(portfolio);

        portfolio.save(null, {
          success: function(result) {
            // Execute any logic that should take place after the object is saved.
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: 'Portfolio',
              template: 'Portfolio Successfully Added'
            });

            alertPopup.then(function(res) {

              getArtistById($stateParams.artistId);
            });

          },
          error: function(gameScore, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: 'Portfolio',
              template: 'Portfolio: Add Failed'
            });

            alertPopup.then(function(res) {

              getArtistById($stateParams.artistId);
            });
          }
        });

      });

    }else{

    }
  }

  $scope.deletePortfolio = function(portfolio){

    var confirmPopup = $ionicPopup.confirm({
      title: 'Portfolio',
      template: 'Are you sure you want to delete this portfolio?',
      okText: 'Yes, I am sure!', // String (default: 'OK'). The text of the OK button.
      okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
    });

    confirmPopup.then(function(res) {
      if(res) {
        loading();
        portfolio.destroy({
          success: function(myObject) {
            // The object was deleted from the Parse Cloud.
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: 'Portfolio',
              template: 'Portfolio Successfully Deleted'
            });

            alertPopup.then(function(res) {

              getArtistById($stateParams.artistId);
            });
          },
          error: function(myObject, error) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: 'Portfolio',
              template: 'Portfolio: Delete Failed'
            });

            alertPopup.then(function(res) {

              getArtistById($stateParams.artistId);
            });
          }
        });

      } else {
        console.log('You are not sure');
      }
    });


  }


  $scope.deleteService = function(service){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Service',
      template: 'Are you sure you want to delete this service?',
      okText: 'Yes, I am sure!', // String (default: 'OK'). The text of the OK button.
      okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
    });

    confirmPopup.then(function(res) {
      if(res) {
        loading();
        service.destroy({
          success: function(myObject) {
            // The object was deleted from the Parse Cloud.
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: 'Service',
              template: 'Service Successfully Deleted'
            });

            alertPopup.then(function(res) {

              getArtistById($stateParams.artistId);
            });
          },
          error: function(myObject, error) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: 'Service',
              template: 'Service: Delete Failed'
            });

            alertPopup.then(function(res) {

              getArtistById($stateParams.artistId);
            });
          }
        });
      } else {
        console.log('You are not sure');
      }
    });
  }

  $scope.addService = function(){
    loading();
    var Service = Parse.Object.extend("Service");
    var service = new Service();

    service.set("name", $scope.service.name);
    service.set("description", $scope.service.description);
    service.set("price", parseInt($scope.service.price));
    service.set("duration", parseInt($scope.service.duration));
    service.set("ownerId", $scope.artistProfile.id);

    service.save(null, {
      success: function(result) {
        // Execute any logic that should take place after the object is saved.
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Service',
          template: 'Service Successfully Added'
        });

        alertPopup.then(function(res) {
          $scope.service = {};

          getArtistById($stateParams.artistId);
        });

      },
      error: function(gameScore, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Service',
          template: 'Service: Add Failed'
        });

        alertPopup.then(function(res) {
          $scope.service = {};
          getArtistById($stateParams.artistId);
        });
      }
    });
  }

  $scope.saveArtistProfile = function(uploadFile){
    console.log(uploadFile);
    if(uploadFile){
      loading();
      $http.post("http://muse-rest-api.herokuapp.com/parse/files/image.jpg", uploadFile, {
        withCredentials: false,
        headers: {
          'X-Parse-Application-Id': 'myAppId',
          'X-Parse-REST-API-Key': 'myRestAPIKey',
          'Content-Type': 'image/jpeg'
        },
        transformRequest: angular.identity
      }).then(function(data) {
        console.log(data.data.url);
        updateProfile(true, data.data.url);

      });
    }else{
      loading();
      updateProfile(false);
    }
  }

  function updateProfile(isAvatar, url){
    $scope.artistProfile.set("firstName", $scope.profile.firstName);
    $scope.artistProfile.set("lastName", $scope.profile.lastName);
    $scope.artistProfile.set("email", $scope.profile.email);
    $scope.artistProfile.set("gender", $scope.profile.gender);
    $scope.artistProfile.set("contactNumber", $scope.profile.contactNumber);
    $scope.artistProfile.set("address", $scope.profile.address);
    $scope.artistProfile.set("serviceType", $scope.profile.serviceType);

    $scope.artistProfile.set("birthDate",$scope.profile.birthDate);

    if(isAvatar){
      $scope.artistProfile.set("icon", url);
    }


    $scope.artistProfile.save(null, {
      success: function(result) {
        // Execute any logic that should take place after the object is saved.
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Account Update',
          template: 'Your account profile has been successfully updated.'
        });

        alertPopup.then(function(res) {
            $scope.profile.icon = url;
        });

      },
      error: function(gameScore, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        $ionicLoading.hide();
        console.log(error);
      }
    });
  }

});
