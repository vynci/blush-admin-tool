
app.controller('ArtistCtrl', function($scope, $ionicModal, $timeout, $ionicLoading, $stateParams, artistService, $state, $rootScope, $ionicModal) {

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

  $scope.selectedTab = 'services';

  $scope.images = [];

  $scope.totalBill = 0;

  getArtistById($stateParams.artistId);

  function getArtistById(id){
    artistService.getArtistById(id)
    .then(function(results) {
      // Handle the result
      $scope.profile = results[0].attributes
      loadImages();
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

  function loadImages() {
    for(var i = 0; i < 10; i++) {
      $scope.images.push({id: i, src: "http://placehold.it/200x200"});
    }
  }

  $ionicModal.fromTemplateUrl('templates/my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalConf = modal;
  });
  $scope.openModal = function() {
    $scope.modalConf.show();
  };
  $scope.closeModal = function() {
    $scope.modalConf.hide();
  };
  
  $scope.registerLater = function() {
    console.log('close!');
    $scope.modalConf.hide();
    $state.go('app.book');
  };

  $scope.toggleSelection = function(service){
    if(!service.checked || service.checked === undefined){
      service.checked = true;
      $scope.totalBill = $scope.totalBill + service.price;
    } else {
      service.checked = false;
      $scope.totalBill = $scope.totalBill - service.price;
    }
  }

  $scope.changeTab = function(tab) {
    $scope.selectedTab = tab;
  }

  $scope.book = function(){

    var selectedService = [];

    angular.forEach($scope.profile.services, function(service){
      if(service.checked === true || service.checked !== undefined){
        selectedService.push(service);
      }
    });

    $rootScope.bookInfo = {
      totalBill : $scope.totalBill,
      artistProfile : $scope.profile,
      selectedService : selectedService
    };

    // $state.go('app.book');
    $scope.modalConf.show();
  }


});
