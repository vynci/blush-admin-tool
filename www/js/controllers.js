

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $rootScope, $window, $ionicLoading) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal

  if(Parse.User.current()){
    $rootScope.currentUser = Parse.User.current();
  }else{
    $rootScope.currentUser = null;
  }

  $scope.loginData = {};
  $scope.showRegisterForm = "false";

  // Create the login modal that we will use later
  $scope.registerData = {
    firstName : '',
    lastName : '',
    email : '',
    password : ''
  }

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.registerModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.showRegisterForm = function(){
    console.log('show register form!');
    // $scope.showRegisterForm = true;
    $scope.modal.hide();
    $scope.registerModal.show();
  }

  $scope.closeModal = function(){
    $scope.modal.hide();
    $scope.registerModal.hide();
  }

  $scope.doRegister =function(){
    $ionicLoading.show({
      template: 'Processing Your Registration :)'
    }).then(function(){
      console.log("The loading indicator is now displayed");
    });

    var Customer = Parse.Object.extend("Customer");
    var customer = new Customer();

    customer.set("firstName", $scope.registerData.firstName);
    customer.set("lastName", $scope.registerData.lastName);
    customer.set("email", $scope.registerData.email);

    customer.save(null, {
      success: function(result) {
        // Execute any logic that should take place after the object is saved.
        console.log(result.id);
        var user = new Parse.User();
        user.set("username", $scope.registerData.email);
        user.set("password", $scope.registerData.password);
        user.set("profileId", result.id);
        user.set("userType", 'customer');

        user.signUp(null, {
          success: function(user) {
            // Hooray! Let them use the app now.
            userLogin($scope.registerData.email, $scope.registerData.password);

          },
          error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            alert("Error: " + error.code + " " + error.message);
            $ionicLoading.hide();
          }
        });
      },
      error: function(gameScore, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        $ionicLoading.hide();
      }
    });
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $ionicLoading.show({
      template: 'Logging in :)'
    }).then(function(){
      console.log("The loading indicator is now displayed");
    });
    userLogin($scope.loginData.username, $scope.loginData.password);
  };

  $scope.doLogout = function() {
    Parse.User.logOut().then(() => {
      $rootScope.currentUser = Parse.User.current();  // this will now be null
      $scope.modal.show();
    });
  }

  function userLogin(username, password){
    Parse.User.logIn(username, password, {
      success: function(user) {
        // Do stuff after successful login.
        $rootScope.currentUser = Parse.User.current();
        console.log($rootScope.currentUser);
        $scope.closeModal();
        $ionicLoading.hide();
        $window.location.reload(true)
      },
      error: function(user, error) {
        // The login failed. Check error to see why.
      }
    });
  }

})

app.controller('PlaylistsCtrl', function($scope, $ionicLoading, $ionicPopup, appointmentService) {

  getAppointments();


  $scope.completeBooking = function(appointment){
    appointment.set("isCompleted", true);

    appointment.save(null, {
      success: function(result) {

        var alertPopup = $ionicPopup.alert({
          title: 'Booking',
          template: 'Booking Successfully Completed'
        });
        $ionicLoading.hide();

        alertPopup.then(function(res) {

        });

      },
      error: function(gameScore, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Booking',
          template: 'Booking Error on Complete, Please try again'
        });

        alertPopup.then(function(res) {

        });
      }
    });
  }

  function getAppointments(){
    $ionicLoading.show({
      template: 'Loading :)'
    }).then(function(){
      console.log("The loading indicator is now displayed");
    });

    appointmentService.getBookings()
    .then(function(results) {
      // Handle the result
      console.log(results);
      $scope.appointments = results;
      $ionicLoading.hide();
    }, function(err) {
      $ionicLoading.hide();
      // Error occurred
      console.log(err);
    }, function(percentComplete) {
      console.log(percentComplete);
    });
  }
})

app.controller('PlaylistCtrl', function($scope, $stateParams) {
});
