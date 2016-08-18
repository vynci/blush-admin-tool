
app.controller('ServiceCtrl', function($scope, $ionicModal, $timeout, artistService, $ionicLoading, $state, $ionicPopup, Upload, $http) {

  console.log('hello service!');

  $state.go($state.current, {}, {reload: true});

  var image = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  var imageMakeup = 'img/makeup.png';
  var imageHair = 'img/hair.png'

  var iconObject = {
    'Hair Stylist' : imageHair,
    'Makeup Artist' : imageMakeup
  }

  var activeArtists = [];

  $scope.isShowMap = true;

  $ionicLoading.show({
    template: 'Loading Map...'
  }).then(function(){
    console.log("The loading indicator is now displayed");
  });

  $ionicModal.fromTemplateUrl('templates/addArtistModal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.filterModal = modal;
  });

  getServices();

  function getServices(){
    artistService.getArtists()
    .then(function(results) {
      // Handle the result
      $scope.fromCloudActiveArtists = results;
      getCurrentLocation();
      $ionicLoading.hide();

    }, function(err) {
      $ionicLoading.hide();
      // Error occurred
      console.log(err);
    }, function(percentComplete) {
      console.log(percentComplete);
    });
  }

  // ionic.Platform.ready(function(){
  //   // Code goes here
  //
  // });

  function getCurrentLocation() {
    var options = {timeout: 50000, enableHighAccuracy: false };


    initializeMap(10.3454904, 123.9130406);

    $ionicLoading.hide();

    // $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    //
    // console.log(position.coords.latitude);
    // console.log(position.coords.longitude);

    // }, function(error){
    //   console.log(error.code+" "+error.message);
    //   alert(error.code+" "+error.message);
    //   initializeMap(position.coords.latitude, position.coords.longitude);
    //   $ionicLoading.hide();
    // });
  }

  $scope.hideFilters = function() {
    $scope.filterModal.hide();
  };

  $scope.showFilters = function(){
    $scope.filterModal.show();
  }

  $scope.changeToListView = function(){
    console.log('List View!');
  }

  $scope.upload = function(croppedDataUrl, picFile){
    console.log(croppedDataUrl);
    console.log(picFile);
  }

  $scope.artistProfile = {};

  // getCustomerProfile();

  // function getCustomerProfile(){
  //   console.log('get customer');
  //   if($rootScope.currentUser){
  //     customerService.getCustomerById($rootScope.currentUser.get('profileId'))
  //     .then(function(results) {
  //       // Handle the result
  //       console.log(results);
  //       $scope.currentCustomerProfile = results[0];
  //
  //       $scope.customerProfile.firstName = results[0].get('firstName');
  //       $scope.customerProfile.lastName = results[0].get('lastName');
  //       $scope.customerProfile.email = results[0].get('email');
  //       $scope.customerProfile.birthDate = results[0].get('birthDate') || new Date();
  //       $scope.customerProfile.gender = results[0].get('gender') || 'female';
  //       $scope.customerProfile.address = results[0].get('address');
  //       $scope.customerProfile.contactNumber = results[0].get('contactNumber');
  //
  //       $scope.customerProfile.oldPassword = 'helloworld';
  //       $scope.customerProfile.newPassword = 'helloworld';
  //       return results;
  //     }, function(err) {
  //       // Error occurred
  //       console.log(err);
  //     }, function(percentComplete) {
  //       console.log(percentComplete);
  //     });
  //   }
  // }

  $scope.saveArtistProfile = function(uploadFile){
    console.log(uploadFile);

    $ionicLoading.show({
      template: 'Loading: Saving Artist...'
    }).then(function(){
      console.log("The loading indicator is now displayed");
    });

    if(uploadFile){
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
      updateProfile(false);
    }


  }

  function updateProfile(isAvatar, url){

    var Profile = Parse.Object.extend("Artist");
    var profile = new Profile();

    profile.set("firstName", $scope.artistProfile.firstName);
    profile.set("lastName", $scope.artistProfile.lastName);
    profile.set("email", $scope.artistProfile.email);
    profile.set("gender", $scope.artistProfile.gender);
    profile.set("contactNumber", $scope.artistProfile.contactNumber);
    profile.set("address", $scope.artistProfile.address);
    profile.set("serviceType", $scope.artistProfile.serviceType);

    profile.set("birthDate",$scope.artistProfile.birthDate);
    profile.set("currentCoordinates", $scope.currentArtistCoordinates);

    if(isAvatar){
      profile.set("avatar", url);
    }


    profile.save(null, {
      success: function(result) {
        // Execute any logic that should take place after the object is saved.
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Account Update',
          template: 'Your account profile has been successfully updated.'
        });

        alertPopup.then(function(res) {
          $scope.filterModal.hide();
          placeMarkerAndPanTo(result.get('currentCoordinates'), $scope.map, result);
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
  $scope.artistMarkerLists = []

  function initializeMap(lat,long){
    var customerLocation = new google.maps.LatLng(lat, long);

    angular.forEach($scope.fromCloudActiveArtists, function(artist){
      var currentCoordinates = artist.get('currentCoordinates');
      console.log(currentCoordinates);
      var latLng = new google.maps.LatLng(currentCoordinates.lat, currentCoordinates.lng);
      artist.googleCoordinatesFormat = latLng;
      activeArtists.push(artist);
    });

    var mapOptions = {
      center: customerLocation,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl : false,
      zoomControl : true,
      streetViewControl : false
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, $scope.map);

    centerControlDiv.index = 1;
    $scope.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);

    initializeSearchBox();

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

      setActiveArtists();

      // var marker = new google.maps.Marker({
      //   icon: image,
      //   map: $scope.map,
      //   animation: google.maps.Animation.DROP,
      //   position: customerLocation
      // });
      //
      // var infoWindow = new google.maps.InfoWindow({
      //   content: "You"
      // });
      //
      // infoWindow.open($scope.map, marker);
    });

    $scope.map.addListener('click', function(e) {
      // 3 seconds after the center of the map has changed, pan back to the
      // marker.

      $scope.currentArtistCoordinates = {
        lat : e.latLng.lat(),
        lng : e.latLng.lng(),
      }

      $scope.filterModal.show();
      $scope.picFile = null;

    });
  }

  function placeMarkerAndPanTo(latLng, map, result) {

    var googlelatLng = new google.maps.LatLng(latLng.lat, latLng.lng);

    var marker = new google.maps.Marker({
      icon: iconObject[result.get('serviceType')],
      position: googlelatLng,
      map: map
    });

    var infoWindow = new google.maps.InfoWindow({
      content: "<a href='#/app/artist/" + result.id + "'>" + "<b>" + result.get('firstName') + ' ' + result.get('lastName') + "</b> <br>" + result.get('serviceType') + "</a>"
    });

    infoWindow.open($scope.map, marker);

    map.panTo(latLng);
  }

  function setActiveArtists(){

    angular.forEach(activeArtists, function(artist){

      var artistMarker = new google.maps.Marker({
        icon: iconObject[artist.get('serviceType')],
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: artist.googleCoordinatesFormat
      });

      var artistInfowindow = new google.maps.InfoWindow();

      google.maps.event.addListener(artistMarker, 'click', (function(artistMarker) {
        return function() {
          artistInfowindow.setContent("<a href='#/app/artist/" + artist.id + "'>" + "<b>" + artist.get('firstName') + ' ' + artist.get('lastName') + "</b> <br>" + artist.get('serviceType') + "</a>");
          artistInfowindow.open($scope.map, artistMarker);
        }
      })(artistMarker));
      google.maps.event.trigger(artistMarker, 'click');
    });
  }

  function initializeSearchBox(){
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

    $scope.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

    $scope.map.addListener('bounds_changed', function() {
    	searchBox.setBounds($scope.map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
    	var places = searchBox.getPlaces();

    	if (places.length == 0) {
    		return;
    	}

    	// For each place, get the icon, name and location.
    	var bounds = new google.maps.LatLngBounds();
    	places.forEach(function(place) {
    		if (!place.geometry) {
    			console.log("Returned place contains no geometry");
    			return;
    		}
    		var icon = {
    			url: place.icon,
    			size: new google.maps.Size(71, 71),
    			origin: new google.maps.Point(0, 0),
    			anchor: new google.maps.Point(17, 34),
    			scaledSize: new google.maps.Size(25, 25)
    		};

    		// var markerSearch = new google.maps.Marker({
    		// 	icon: icon,
    		// 	map: $scope.map,
    		// 	animation: google.maps.Animation.DROP,
    		// 	position: place.geometry.location
    		// });

    		if (place.geometry.viewport) {
    			// Only geocodes have viewport.
    			bounds.union(place.geometry.viewport);
    		} else {
    			bounds.extend(place.geometry.location);
    		}
    	});
    	$scope.map.fitBounds(bounds);
    });
  }

  function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#4ECDC4';
    controlUI.style.border = '2px solid #4ecdc4';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'white';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Change to List View';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
      $state.go('app.artistlist');
    });

  }

  function FilterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#D2527F';
    controlUI.style.border = '2px solid #D2527F';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '10px';
    controlUI.style.marginLeft = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Show Filters';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'white';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '32px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Show Filters';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
      $scope.filterModal.show();
    });

  }


});
