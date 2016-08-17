
app.controller('ArtistListViewCtrl', function($scope, $ionicModal, $timeout, serviceService, $ionicLoading, $rootScope, $ionicPopup, artistService, $state) {

  console.log('Artist List View!');

  $scope.userPlaceholder = 'img/placeholder.png'

  getArtists();

  $ionicLoading.show({
    template: 'Finding Artists Near You :)'
  }).then(function(){
    console.log("The loading indicator is now displayed");
  });

  $ionicModal.fromTemplateUrl('templates/filterModal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.filterModal = modal;
  });

  function getArtists(){
    artistService.getArtists()
    .then(function(results) {
      // Handle the result
      $scope.fromCloudActiveArtists = results;
      parsePriceRange($scope.fromCloudActiveArtists);
      $ionicLoading.hide();
    }, function(err) {
      $ionicLoading.hide();
      // Error occurred
      console.log(err);
    }, function(percentComplete) {
      console.log(percentComplete);
    });
  }

  function parsePriceRange(artists){
    angular.forEach(artists, function(artist){
      var services= artist.get('services');
      var priceRange = [];
      angular.forEach(services, function(service){
        var price = service.price;
        console.log(price);
        priceRange.push(price);
      });
      console.log(priceRange);
      artist.set('priceRange', priceRange);
    });
    console.log($scope.fromCloudActiveArtists[0].attributes);
  }

  $scope.findMin = function(prices){
    return Math.min.apply(null, prices);
  }

  $scope.findMax = function(prices){
    return Math.max.apply(null, prices);
  }

  $scope.changeToMapView = function(){
    $state.go('app.service');
    console.log('hello!');
  }

  // Triggered in the login modal to close it
  $scope.hideFilters = function() {
    $scope.filterModal.hide();
  };

  $scope.showFilters = function(){
    $scope.filterModal.show();
  }

});
