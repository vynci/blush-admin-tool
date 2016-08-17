// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ion-datetime-picker', 'ngFileUpload', 'angular-spinkit']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  Parse.initialize("myAppId");
  Parse.serverURL = 'https://muse-rest-api.herokuapp.com/parse';
})

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.service', {
    url: '/service',
    views: {
      'menuContent': {
        templateUrl: 'templates/service.html',
        controller: 'ServiceCtrl'
      }
    }
  })

  .state('app.account', {
    url: '/account',
    views: {
      'menuContent': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('app.artistlist', {
    url: '/artistlist',
    views: {
      'menuContent': {
        templateUrl: 'templates/artistListView.html',
        controller: 'ArtistListViewCtrl'
      }
    }
  })

  .state('app.book', {
    url: '/book/:bookInfo',
    views: {
      'menuContent': {
        templateUrl: 'templates/book.html',
        controller: 'BookCtrl'
      }
    }
  })

  .state('app.artist', {
    url: '/artist/:artistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/artist.html',
        controller: 'ArtistCtrl'
      }
    }
  })


  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/service');
});
