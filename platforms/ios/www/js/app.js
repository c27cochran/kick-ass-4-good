var initialized = false;
var db = null;

angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

angular.module('your_app_name', [
  'ionic','ionic.service.core',
  //'ion-floating-menu',
  'kinvey',
  'your_app_name.common.directives',
  'your_app_name.app.services',
  'your_app_name.app.filters',
  'your_app_name.app.controllers',
  'your_app_name.auth.controllers',
  'your_app_name.views',
  'underscore',
  'ngStorage',
  'angularMoment',
  'ngCordova',
  'ngCordovaOauth',
  'monospaced.elastic',
  'ngAnimate',              // inject the ngAnimate module
  //'ngFx',
  'ksSwiper'                   // inject the ngFx module
])

.value('KinveyConfiguration', {
  appKey: "confidential",
  appSecret: "confidential"
})

.value('all_users', {
    'data': ''
})

.value('blocked_users', {
    'data': ''
})

.value('im_blocked', {
    'data': ''
})

.value('all_challenges', {
    'data': ''
})

.constant('kinveyConfig', {
  appKey: 'confidential',
  appSecret: 'confidential'
})

.run(function($ionicPlatform, $state, $rootScope, $window, $cordovaSQLite, $localStorage) {

  $rootScope.$on('$stateChangeError',
    function(event, toState, toParams, fromState, fromParams, error) {

      console.log('$stateChangeError ' + error && (error.debug || error.message || error));

      // if the error is "noUser" the go to login state
      if (error && error.error === "noUser") {
        event.preventDefault();
        $state.go('facebook-sign-in', {});
      } else {
        event.preventDefault();
        $state.go('app.feed', {});
      }

      if (error.error !== "noUser") {
        event.preventDefault();
        $state.go('app.feed', {});
      }
  });

  $ionicPlatform.ready(function($localStorage) {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if(typeof analytics !== undefined) {
      console.log("start tracking with google analytics");
                analytics.startTrackerWithId("UA-60985515-7");
            } else {
                console.log("Google Analytics Unavailable");
            }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS users (_id text primary key, username text, email text, name text, avatar text, cover text, offset_y integer, karma integer, donate integer)");
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $stateProvider

  //SIDE MENU ROUTES
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'MenuCtrl',
    resolve: {
      loggedUser: function(UserService) {
        return UserService.init();
      }
      // all_users: function(UserService) {
      //   return UserService.all_users();
      // }
    }
  })

  .state('app.feed', {
    url: "/feed",
    views: {
      'menuContent': {
        templateUrl: "views/app/feed.html",
        controller: "FeedCtrl"
      }
    },
    resolve: {
      // loggedUser: function(UserService) {
      //   return UserService.init();
      // },
      // feed: function(FeedService){
      //   // Default page is 1
      //   var page = 1;

      //   return FeedService.getFeed(page, "order");
      // },
      featuredChallenge: function(FeedService){
        return FeedService.getFeaturedChallenge();
      },
      featuredPost: function(FeedService){
        return FeedService.getFeaturedPost();
      }
      // posts: function(FeedService){
      //   // Default page is 1
      //   var page = 1;
      //   return {};
      //   // return FeedService.getAllPosts(page);
      // },
      // activity: function(FeedService){
      //   // Default page is 1
      //   var page = 1;
      //
      //   return FeedService.getActivity(page);
      // }
    }
  })
  .state('app.donateKarma', {
    url: "/donate",
    views: {
      'menuContent': {
        templateUrl: "views/app/donate.html",
        controller: "DonateCtrl"
      }
    },
    resolve: {
      loggedUser: function(UserService) {
        return UserService.active_user();
      },
      categories: function(CategoryService){
        return CategoryService.getCategories();
      },
      charities: function(CategoryService){
        return CategoryService.getCharities();
      }
    }
  })
  .state('app.category_feed', {
    url: "/category_feed/:categoryId",
    views: {
      'menuContent': {
        templateUrl: "views/app/category-feed.html",
        controller: "CategoryFeedCtrl"
      }
    },
    resolve: {
      loggedUser: function(UserService) {
        return UserService.active_user();
      },
      feed: function(FeedService, $stateParams){
        // Default page is 1
        var page = 1;
        return FeedService.getFeedByCategory(page, $stateParams.categoryId);
      },
      category: function(CategoryService, $stateParams){
        return CategoryService.getCategory($stateParams.categoryId);
      }
    }
  })

  .state('app.trend_feed', {
    url: "/trend_feed/:trendId",
    views: {
      'menuContent': {
        templateUrl: "views/app/feed.html",
        controller: "TrendFeedCtrl"
      }
    },
    resolve: {
      loggedUser: function(UserService) {
        return UserService.active_user();
      },
      feed: function(FeedService, $stateParams){
        // Default page is 1
        var page = 1;
        return FeedService.getFeedByTrend(page, $stateParams.trendId);
      },
      trend: function(TrendsService, $stateParams){
        return TrendsService.getTrend($stateParams.trendId);
      }
    }
  })

  .state('app.challenge', {
    url: "/challenge/:challengeId",
    views: {
      'menuContent': {
        templateUrl: "views/app/challenge/details.html",
        controller: 'ChallengeDetailsCtrl'
      }
    },
    resolve: {
      challenge: function(FeedService, $stateParams){
        return FeedService.getChallenge($stateParams.challengeId);
      },
      loggedUser: function(UserService) {
        return UserService.active_user();
      },
      liked: function(FeedService, $stateParams){
        return FeedService.isLiked($stateParams.challengeId);
      },
      kicked: function(FeedService, $stateParams){
        return FeedService.isKicked($stateParams.challengeId);
      },
      accepted: function(FeedService, $stateParams){
        return FeedService.isAccepted($stateParams.challengeId);
      },
      completed: function(FeedService, $stateParams){
        return FeedService.isCompleted($stateParams.challengeId);
      }
      // ,
      // posts: function(FeedService, $stateParams){
      //   return FeedService.getChallengePosts($stateParams.challengeId);
      // }
    }
  })

  .state('app.profile', {
    abstract: true,
    url: '/profile/:userId',
    views: {
      'menuContent': {
        templateUrl: "views/app/profile/profile.html",
        controller: 'ProfileCtrl'
      }
    },
    resolve: {
      loggedUser: function(UserService) {
        return UserService.active_user();
      },
      user: function(ProfileService, $stateParams){
        var profileUserId = $stateParams.userId;
        return ProfileService.getUserData(profileUserId);
      },
      // friends: function(PeopleService, $stateParams){
      //   var profileUserId = $stateParams.userId;
      //   return PeopleService.getFBFriends();
      // },
      // followers: function(ProfileService, $stateParams){
      //   var profileUserId = $stateParams.userId;
      //   return ProfileService.getUserFollowers(profileUserId);
      // },
      // followers: function(PeopleService, $stateParams){
      //   var profileUserId = $stateParams.userId;
      //   return PeopleService.getFollowers(profileUserId);
      // },
      // kickedChallenges: function(ProfileService, $stateParams){
      //   var profileUserId = $stateParams.userId;
      //   return ProfileService.getKickedChallenges(profileUserId);
      // },
      // activeChallenges: function(ProfileService, $stateParams){
      //   var profileUserId = $stateParams.userId;
      //   return ProfileService.getActiveChallenges(profileUserId);
      // },
      // completedChallenges: function(ProfileService, $stateParams){
      //   var profileUserId = $stateParams.userId;
      //   return ProfileService.getCompletedChallenges(profileUserId);
      // },
      // challenges: function(ProfileService, $stateParams){
      //   var profileUserId = $stateParams.userId;
      //   return ProfileService.getUserChallenges(profileUserId);
      // },
      // posts: function(ProfileService, $stateParams){
      //   var profileUserId = $stateParams.userId;
      //   return ProfileService.getUserPosts(profileUserId);
      // },
      // pictures: function(ProfileService, $stateParams){
      //   var profileUserId = $stateParams.userId;
      //   return ProfileService.getUserPictures(profileUserId);
      // },
      // people_suggestions: function(PeopleService){
      //   return PeopleService.getPeopleSuggestions();
      // },
      // people_you_may_know: function(PeopleService){
      //   return PeopleService.getPeopleYouMayKnow();
      // },
      // fb_invites: function(PeopleService){
      //   return PeopleService.getFBInvites();
      // },
      // fb_friends: function(PeopleService, $stateParams){
      //   var profileUserId = $stateParams.userId;
      //   return PeopleService.getFBFriends(profileUserId);
      // },
      // following: function(PeopleService, $stateParams){
      //   var profileUserId = $stateParams.userId;
      //   return PeopleService.getFollowing(profileUserId);
      // },
      myFollows: function(PeopleService, UserService){
        var myId = UserService.active_user()._id;
        return PeopleService.getFollowing(myId);
      },
      // following: function(PeopleService, $stateParams) {
      //   var profileUserId = $stateParams.userId;
      //   return PeopleService.getFollowing(profileUserId);
      // },
      // followers: function(PeopleService, $stateParams) {
      //   var profileUserId = $stateParams.userId;
      //   return PeopleService.getFollowers(profileUserId);
      // },
      // leaderboard: function(PeopleService){
      //   return PeopleService.getLeaderboard();
      // },

    }
  })

  .state('app.profile.challenges', {
    url: '/challenges',
    views: {
      'profileContent': {
        templateUrl: 'views/app/profile/profile.details.html'
      },
      'profileSubContent@app.profile.challenges': {
        templateUrl: 'views/app/profile/profile.challenges.html'
      }
    }
  })

  .state('app.profile.friends', {
    url: '/friends',
    views: {
      'profileContent': {
        templateUrl: 'views/app/profile/profile.details.html'
      },
      'profileSubContent@app.profile.friends': {
        templateUrl: 'views/app/profile/profile.friends.html'
      }
    }
  })

  .state('app.profile.pics', {
    url: '/pics',
    views: {
      'profileContent': {
        templateUrl: 'views/app/profile/profile.details.html'
      },
      'profileSubContent@app.profile.pics': {
        templateUrl: 'views/app/profile/profile.pics.html'
      }
    }
  })

  .state('app.profile.followers', {
    url: "/followers",
    views: {
      'profileContent': {
        templateUrl: 'views/app/profile/profile.followers.html',
        controller: 'ProfileConnectionsCtrl'
      }
    }
  })

  .state('app.profile.following', {
    url: "/following",
    views: {
      'profileContent': {
        templateUrl: 'views/app/profile/profile.following.html',
        controller: 'ProfileConnectionsCtrl'
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "views/app/browse.html",
        controller: "BrowseCtrl"
      }
    },
    resolve: {
      trends: function(TrendsService){
        return TrendsService.getTrends();
      },
      categories: function(CategoryService){
        return CategoryService.getCategories();
      }
    }
  })

  .state('app.people', {
    url: "/people",
    views: {
      'menuContent': {
        templateUrl: "views/app/people.html",
        controller: "PeopleCtrl"
      }
    },
    resolve: {
      people_suggestions: function(PeopleService){
        return PeopleService.getPeopleSuggestions();
      },
      people_you_may_know: function(PeopleService){
        return PeopleService.getPeopleYouMayKnow();
      },
      fb_invites: function(PeopleService){
        return PeopleService.getFBInvites();
      },
      fb_friends: function(PeopleService){
        return PeopleService.getFBFriends();
      },
      following: function(PeopleService, $localStorage){
        var userId = $localStorage.active_user._id;
        return PeopleService.getFollowing(userId);
      },
      // user: ['$kinvey', function($kinvey) {
      //   return $kinvey.getActiveUser();
      // }]
    }
  })

  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "views/app/profile/settings.html",
        controller: 'SettingsCtrl'
      }
    },
    resolve: {
      loggedUser: function(UserService) {
        return UserService.init();
      }
    }
  })



  //AUTH ROUTES
  .state('facebook-sign-in', {
    url: "/facebook-sign-in",
    templateUrl: "views/auth/facebook-sign-in.html",
    controller: 'WelcomeCtrl'
  })

  .state('dont-have-facebook', {
    url: "/dont-have-facebook",
    templateUrl: "views/auth/dont-have-facebook.html",
    controller: 'WelcomeCtrl'
  })

  .state('create-account', {
    url: "/create-account",
    templateUrl: "views/auth/create-account.html",
    controller: 'CreateAccountCtrl'
  })

  .state('welcome-back', {
    url: "/welcome-back",
    templateUrl: "views/auth/welcome-back.html",
    controller: 'WelcomeBackCtrl'
  })
;



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/feed');
  //$ionicConfigProvider.navBar.transition('none');
});
