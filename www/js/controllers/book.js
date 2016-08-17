
app.controller('BookCtrl', function($scope, $ionicModal, $timeout, serviceService, $ionicLoading, $rootScope, $ionicPopup) {

  console.log('book!');

  console.log($rootScope.bookInfo);

  $scope.datetimeValue = new Date();
  $scope.choice = {
    name: 'cash'
  };

  $scope.artist = $rootScope.bookInfo.artistProfile;
  $scope.services = $rootScope.bookInfo.selectedService;
  $scope.totalBill = $rootScope.bookInfo.totalBill;

  $scope.book = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Booking Successful!',
      template: 'Your Artist will contact you in a while.'
    });

    alertPopup.then(function(res) {
      console.log('Thank you for not eating my delicious ice cream cone');
    });
  };

});
