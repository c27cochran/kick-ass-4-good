angular.module('your_app_name.app.controllers', ['ngSanitize'])

.controller('ProfileCtrl', function($scope, $http, $stateParams, $sce, all_users, $rootScope, $ionicPosition, $cordovaFacebookAds, $ionicHistory, $timeout,$state, $ionicScrollDelegate, $ionicActionSheet, $ionicModal, $ionicPopup, $cordovaSocialSharing, sharedProperties, PeopleService, FeedService, ProfileService, loggedUser, user) {
  if(typeof analytics !== undefined) {
    analytics.trackView("Profile");
  }else{
    //console.log("analytics not working")
  }

  var profileUserId = $stateParams.userId;

  //console.log($scope.allUsers)
  $scope.smallHeader = false;
  $scope.headerMinimized = false;
  $scope.getScrollPosition = function(){
    $scope.updateClickArea();
  //console.log("Scroll pos from top: ", $ionicScrollDelegate.getScrollPosition().top)
  var scrollpos = +$ionicScrollDelegate.getScrollPosition().top;
if (scrollpos > 100){
  //console.log("setting to true")
  $scope.smallHeader = true;
  $scope.headerMinimized =true;
  // $scope.$apply();
  _.defer(function(){
    $scope.$apply();
  });
}
// $scope.$apply();
  }
  $scope.searching = false;
$scope.searchChange = function(searchLength){
  //console.log(searchLength)
  if(searchLength > 1){
    $scope.smallHeader = true;
    $scope.headerMinimized =true;
    $scope.searching = true;
    $ionicScrollDelegate.scrollTop();
    //console.log("setting true: "+$scope.searching)
  //   _.defer(function(){
  //   $scope.$apply();
  // });
  }else{

    $scope.searching = false;
    //console.log("setting false: "+$scope.searching)
  }
}

  $scope.doRefresh = function(){
    $scope.smallHeader = false;
    $scope.$broadcast('scroll.refreshComplete');
  }
  $scope.$on('$ionicView.afterEnter', function() {
    $timeout($ionicScrollDelegate.$getByHandle('profile-scroll').resize(), 300);

  });


  $scope.currentUserId = loggedUser._id;
  $scope.user = user;

  $scope.karmaPoints = user.karma;
  $scope.donate = user.donate;

    // var profileUserId = $stateParams.userId;
    // ProfileService.getUserData(profileUserId).then(function(data) {
    //   console.log('private', data.private);
    //   $scope.private = data.private;
    // });

  sharedProperties.setKarma(loggedUser.karma);
  sharedProperties.setDonate(loggedUser.donate);

  $scope.$watch(function () { return sharedProperties.getKarma(); }, function (newValue, oldValue) {
    //console.log("newValue: "+newValue+ " oldValue: " + oldValue)
    $scope.myKarmaPoints = loggedUser.karma;
  });
  $scope.$watch(function () { return sharedProperties.getDonate(); }, function (newValue, oldValue) {
    $scope.myDonate = loggedUser.donate;
  });

  $scope.thisProfileId = user._id;

  //is this the profile of the logged user?
  $scope.myProfile = loggedUser._id == user._id;

  $scope.loggedUser = loggedUser;

  $scope.postPage = 1;

  $scope.hideAdsProfile = false;

  $scope.$on('$ionicView.afterLeave', function() {
      $scope.hideAdsProfile = true;
      $scope.kickedLoaded = false;
      $scope.acceptLoaded = false;
      $scope.completeLoaded = false;
      $scope.friendsLoaded = false;
      $scope.postsLoaded = false;
  });

  $cordovaFacebookAds.removeNativeAd('1224766177553218_1271863812843454'); // details

  var nativeAds;
  var nativeAdsPosts;
  var nativeAdsLeaderboard;

  var scroller = document.querySelector("#feed-scroll");
  var angularElementScroll = angular.element(scroller);
  var scrollPosition = $ionicPosition.offset(angularElementScroll);
  var scrollHeight = scrollPosition.height-45;

  $scope.updateClickArea = function(){
      var divId = 'div-profile-2';
      var leaderboardDivId = ['div-leaderboard-0','div-leaderboard-1','div-leaderboard-2','div-leaderboard-3', 'div-leaderboard-4', 'div-leaderboard-5', 'div-leaderboard-6', 'div-leaderboard-7', 'div-leaderboard-8', 'div-leaderboard-9', 'div-leaderboard-10', 'div-leaderboard-11', 'div-leaderboard-12', 'div-leaderboard-13', 'div-leaderboard-14', 'div-leaderboard-15'];
      var postDivId = 'div-profile-post-2';

      var myElementA = document.querySelector("#profile-scroll");
      var angularElementA = angular.element(myElementA);
      var position2 = $ionicPosition.position(angularElementA);

      if ($scope.activeSubView == 'challenges'){

        $cordovaFacebookAds.removeNativeAd('1224766177553218_1271851549511347'); // leaderboard
        $cordovaFacebookAds.removeNativeAd('1224766177553218_1271718966191272'); // post
        $cordovaFacebookAds.removeNativeAd('1224766177553218_1271863812843454'); // details

        var myElement = document.querySelector("#"+divId);

        if (myElement) {

          var angularElementB = angular.element(myElement);
          var position = $ionicPosition.position(angularElementB);
          var top = position.top;

          var height = position.height;
          top = top+280;

          if (position.top < 0) {
            height = (height + position.top) - 90;
            // top = top;
          } else {
            var newHeight = position2.height - top + 117;
            height = newHeight;
          }

          if (height >= 292) {
            height = 292;
          }

          if (height > 0) {
            // console.log('top: '+top+' height: '+height);
            $cordovaFacebookAds.setNativeAdClickArea(nativeAds, position.left, top, position.width, height);
          }
        }
      } else if ($scope.activeSubView == 'posts'){

        $cordovaFacebookAds.removeNativeAd('1224766177553218_1271572566205912'); // challenge
        $cordovaFacebookAds.removeNativeAd('1224766177553218_1271851549511347'); // leaderboard
        $cordovaFacebookAds.removeNativeAd('1224766177553218_1271863812843454'); // details

        // var myElement = document.querySelector("#"+postDivId);

        // if (myElement) {

        //   var angularElementB = angular.element(myElement);

        //   var position = $ionicPosition.position(angularElementB);

        //   var top = position.top;

        //   var height = position.height;
        //   top = top+120;

        //   if (position.top < 0) {
        //     height = (height + position.top) - 120;
        //     top = top+120;
        //   } else {
        //     var newHeight = position2.height - top - 57;
        //     height = newHeight;
        //   }

        //   if (height >= 292) {
        //     height = 292;
        //   }

        //   if (height > 0) {
        //     // console.log('top: '+top+' height: '+height);
        //     $cordovaFacebookAds.setNativeAdClickArea(nativeAdsPosts, position.left, top, position.width, height);
        //   }

        // }
      } else if ($scope.activeSubView == 'leaderboard'){

        $cordovaFacebookAds.removeNativeAd('1224766177553218_1271572566205912'); // challenge
        $cordovaFacebookAds.removeNativeAd('1224766177553218_1271718966191272'); // post
        $cordovaFacebookAds.removeNativeAd('1224766177553218_1271863812843454'); // details

        var myElement = document.querySelector("#"+leaderboardDivId[2]);

        if (myElement) {
          var angularElementB = angular.element(myElement);
          var offset = $ionicPosition.offset(angularElementB);

          var position = $ionicPosition.position(angularElementB);

          var height = position.height;

          var top = offset.top;

          if (top < 0) {
            height = height + top;
          }

          // eight > 0 && top < 500 && top > 150) {

          if (height > 0 && top < 500 && top > 245) {
            $cordovaFacebookAds.setNativeAdClickArea(nativeAdsLeaderboard, position.left, top, position.width, height);
          } else {
            $cordovaFacebookAds.setNativeAdClickArea(nativeAdsLeaderboard, 0,0,0,0); // leaderboard
          }
        }
      } else if ($scope.activeSubView == 'friends'){
        $cordovaFacebookAds.removeNativeAd('1224766177553218_1271572566205912'); // challenge
        $cordovaFacebookAds.removeNativeAd('1224766177553218_1271851549511347'); // leaderboard
        $cordovaFacebookAds.removeNativeAd('1224766177553218_1271718966191272'); // post
        $cordovaFacebookAds.removeNativeAd('1224766177553218_1271863812843454'); // details
      }
  }

  $scope.resetAdClick = function(){

    var placementIds = ['1224766177553218_1271572566205912','1224766177553218_1271718966191272','1224766177553218_1271657729530729','1224766177553218_1271851549511347','1224766177553218_1272904089406093'];

    _.each(placementIds, function(Id){
      $cordovaFacebookAds.removeNativeAd(Id);
    });
  }


  $scope.getAdChallenge = function(){
    $scope.hideAdsProfile = false;
    $cordovaFacebookAds.createNativeAd('1224766177553218_1271572566205912');
    var nativeId;
    document.addEventListener('onAdLoaded',function(data) {
        if (data.adType == "native") {
          var adRes = data.adRes;
          nativeId = data.adId;
          if (nativeId) {
            $scope.nativeId = nativeId;

            $scope.nativeAd = adRes;

            nativeAds = nativeId;
          }
        }
      });
  }

  $scope.getAdPost = function(){
    $scope.hideAdsProfile = false;
    $cordovaFacebookAds.createNativeAd('1224766177553218_1271718966191272');
    var nativeId;
    document.addEventListener('onAdLoaded',function(data) {
        if (data.adType == "native") {
          var adRes = data.adRes;
          nativeId = data.adId;
          if (nativeId) {
            $scope.nativePostId = nativeId;

            $scope.nativeAdPost = adRes;

            nativeAdsPost = nativeId;
          }
        }
      });
  }

  $scope.getAdLeaderboard = function(){
    $scope.hideAdsProfile = false;
    var placementId = ['never-used','1224766177553218_1271851549511347','1224766177553218_1271863812843454'];
      $cordovaFacebookAds.createNativeAd(placementId[1]);
    var nativeId;
    document.addEventListener('onAdLoaded',function(data) {
        if (data.adType == "native") {
          var adRes = data.adRes;
          nativeId = data.adId;
          $scope.nativeAdLeaderboard = adRes;

          nativeAdsLeaderboard = nativeId;
        }
      });
  }

  // $scope.getAdChallenge();
  // $scope.getAdLeaderboard();

  // $scope.posts = posts;
  // if (Object.keys(posts).length == 0) {
  //   $scope.no_posts = true;
  // } else {
  //   $scope.no_posts = false;
  // }

  // $scope.people_suggestions = people_suggestions;
  // $scope.people_you_may_know = people_you_may_know;

  // $scope.fb_invites = fb_invites.friends;
  // if (Object.keys(fb_invites).length == 0) {
  //   $scope.no_invites = true;
  // } else {
  //   $scope.no_invites = false;
  // }

  // $scope.fb_invites_next = fb_invites.paging.next;

  // $scope.next = function(link) {

  //     $http.get(link).success(function(response) {
  //         var fb_friends = _.each(response.data, function(fb_data){
  //           _.each(fb_data, function(fb_person){
  //             return fb_person;
  //           });
  //         });


  //           $scope.fb_invites = fb_friends;
  //           $scope.fb_invites_next = response.paging.next;
  //           if (response.paging.previous) {
  //             $scope.fb_invites_previous = response.paging.previous;
  //           }

  //     });
  // }

  PeopleService.getFollowing(loggedUser._id).then(function(data) {
    var myFollows = data;
 
    $scope.alreadyFollowing = false;
    var followingId = _.each(myFollows, function(follow) {
      if (follow.userId == user._id) {
        $scope.alreadyFollowing = true;
      }
    });

    if (loggedUser._id == user._id) {
      $scope.this_is_me = true;
      $scope.private = false;
      PeopleService.checkFollowing(loggedUser._id, user._id).then(function(data) {
        $scope.followAllow = data;
      });
    } else {
      $scope.this_is_me = false;
      if ($scope.alreadyFollowing == false) {
        if (user.private == null || user.private == '') {
          $scope.private = false;
        } else {
          $scope.private = user.private;
        }
      } else if ($scope.alreadyFollowing == true) {
        $scope.private = false;
      }
      PeopleService.checkRequest(loggedUser._id, user._id).then(function(data) {
        $scope.followRequested = data;
      });
    } 
  });

  $scope.shareFB = function(name) {
    var caption = name +' - Check out this app! #KickAss4Good';
    // var caption = 'Check out this app! #KickAss4Good';
    var image = 'http://www.kickass4good.com/assets/img/facebook.png';
    var link = 'http://www.kickass4good.com';

    $cordovaSocialSharing
    .shareViaFacebook(caption, image, link)
    .then(function(result) {
      FeedService.addKarma(10);
      $rootScope.$broadcast('pointsEvent', 10);
      //console.log(result);
    }, function(err) {
      //console.log(err);
    });
  }

  $scope.activeTab = 1;
  $scope.activeSubView = 'posts';

  //TODO: refactor to set activesubview based on index of tab

  $scope.followUser = function(theirId) {
    $scope.alreadyFollowing = true;
    $scope.followRequest = true;
    PeopleService.addFollow(loggedUser._id, theirId).then(function(data){
      // $scope.following = data;
    // $scope.$apply();
    if($scope.this_is_me){
      //console.log("this is me")
    PeopleService.getFollowing(loggedUser._id).then(function(following){
      //console.log('followers', followers);
      $scope.following = following;
    },
    function(error){
      //console.log('error')
    });
    }else{
      //console.log("this is NOT me")
      PeopleService.getFollowers(theirId)
          .then(function(followers){
            //console.log('followers', followers);
            $scope.followers = followers;
          },
          function(error){
            //console.log('error')
          });
    }


    // setTimeout(function () {
    //   $scope.$apply(function(){
    //     PeopleService.getFollowers(theirId)
    //     .then(function(followers){
    //       //console.log('followers', followers);
    //       $scope.followers = followers;
    //     },
    //     function(error){
    //       //console.log('error')
    //     });
    //   });
    // }, 1000);
  },
  function(error){
    //console.log('error')
  });
};

$scope.requestFollowUser = function(theirId) {
    PeopleService.addFollowRequest(loggedUser._id, theirId).then(function(data){
      $scope.followRequested = true;
    },
    function(error){
      //console.log('error')
    });
};

$scope.removeRequest = function(theirId) {
    PeopleService.removeFollowRequest(loggedUser._id, theirId).then(function(data){
      $scope.followRequested = false;
    },
    function(error){
      //console.log('error')
    });
};


$scope.allowFollow = function(theirId) {
    $scope.followAllow = true;
    PeopleService.addFollow(theirId, loggedUser._id).then(function(data){
    if($scope.this_is_me){
      PeopleService.getFollowers(loggedUser._id).then(function(followers){
      $scope.followers = followers;
    },
    function(error){
      //console.log('error')
    });
    }else{
      PeopleService.getFollowing(theirId)
          .then(function(following){
            $scope.following = following;
          },
          function(error){
            //console.log('error')
          });
    }

  },
  function(error){
    //console.log('error')
  });
};

$scope.denyFollow = function(theirId) {
  $scope.followRequested = false;
    PeopleService.removeFollowRequest(loggedUser._id, theirId).then(function(data){
      setTimeout(function () {
        PeopleService.getFollowRequests(loggedUser._id).then(function(data) {

          $scope.followRequest = data;
          if (Object.keys(data).length == 0) {
            $scope.no_requests = true;
          } else {
            $scope.no_requests = false;
          }

        });
      }, 800);
    },
    function(error){
      //console.log('error')
    });
};

$scope.followBack = function(theirId) {
    $scope.alreadyFollowing = true;
    $scope.followRequest = true;
    $scope.followRequested = false;
    PeopleService.addFollow(loggedUser._id, theirId).then(function(data){
      PeopleService.removeFollowRequest(loggedUser._id, theirId).then(function(data){

      },function(error){
      //console.log('error')
      });
    if($scope.this_is_me){
      PeopleService.getFollowing(loggedUser._id).then(function(following){
      $scope.following = following;
    },
    function(error){
      //console.log('error')
    });
    }else{
      PeopleService.getFollowers(theirId)
          .then(function(followers){
            $scope.followers = followers;
          },
          function(error){
            //console.log('error')
          });
    }

    setTimeout(function () {
        PeopleService.getFollowRequests(loggedUser._id).then(function(data) {

          $scope.followRequest = data;
          if (Object.keys(data).length == 0) {
            $scope.no_requests = true;
          } else {
            $scope.no_requests = false;
          }

        });
      }, 800);

  },
  function(error){
    //console.log('error')
  });
};

  $scope.unFollowUser = function(theirId) {
    $scope.alreadyFollowing = false;
    $scope.followRequest = false;
    $scope.unFollowRequest = true;
    PeopleService.removeFollow(loggedUser._id, theirId);
      // $scope.following = data;
    setTimeout(function () {
      $scope.$apply(function(){
        PeopleService.getFollowers(theirId)
        .then(function(followers){
          $scope.followers = followers;
        },
        function(error){
          //console.log('error')
        });
      });
    }, 1000);
  }

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  $scope.setActiveTab = function (index) {
    $scope.contactsActive = false;
        $scope.activeTab = index;
        if(index == 3){
          $scope.contactsActive = true;
        }
        //console.log('tab iondex:' + index)
        $ionicScrollDelegate.scrollTop();
  //$ionicTabsDelegate.select(index);
  }

  $scope.reportPost = function(postId) {
    var userId = loggedUser._id;
    var time = Date.now();
    PeopleService.report(postId, userId, time);
    var alertPopup = $ionicPopup.alert({
      title: 'Post Reported',
      template: 'Our moderators will review your request and take the appropriate action within 24 hours.'
    });

    alertPopup.then(function(res) {
      //console.log('post reported');
    });
  }

  $scope.showActionSheet = function(postId) {

    $ionicActionSheet.show({
      buttons: [
        { text: '<span class="report">Report</span>' },
      ],
      cancelText: 'Cancel',
      cancel: function() {
      //  console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        if (index == 0) {
          $scope.reportPost(postId);
        }
        return true;
      }
    });
  }

  $ionicModal.fromTemplateUrl('views/app/partials/edit-prove-it.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    //$scope.modal = $ionicModal;
    $scope.edit_prove_it_modal = modal;
  });

  $scope.showEditProveIt = function() {
    $scope.edit_prove_it_modal.show();
  };

  $scope.hideProveIt = function() {
    $scope.edit_prove_it_modal.hide();
  };

  $scope.editPost = function(post) {
    $scope.post = post;
    FeedService.getChallenge(post.challengeId).then(function(data) {
      $scope.challenge = data;
    });
    $scope.showEditProveIt();
  }

  $scope.showActionSheetEdit = function(post) {

    $ionicActionSheet.show({
      buttons: [
        { text: 'Edit Post' },
      ],
      cancelText: 'Cancel',
      cancel: function() {
      //  console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        if (index == 0) {
          $scope.editPost(post);
        }
        return true;
      }
    });
  }

  $scope.reportUser = function(userId) {
    var my_user_id = loggedUser._id;
    var time = Date.now();
    PeopleService.reportUser(my_user_id, userId, time);
    var alertPopup = $ionicPopup.alert({
      title: 'User Reported',
      template: 'Our moderators will review your request and take the appropriate action within 24 hours.'
    });

    alertPopup.then(function(res) {
      //console.log('post reported');
    });
  }

  $scope.blockUser = function(userId) {
    var my_user_id = loggedUser._id;
    var time = Date.now();
    PeopleService.blockUser(my_user_id, userId, time);
    var alertPopup = $ionicPopup.alert({
      title: 'User Blocked',
      template: 'This user is now blocked. You will no longer see his/her posts.'
    });

    alertPopup.then(function(res) {
      PeopleService.removeFollow(my_user_id, userId);
      PeopleService.removeFollower(my_user_id, userId);
      $scope.$apply();
      $state.go('app.feed');
      //console.log('post reported');
    });
  }

  $scope.showActionSheetUser = function(userId) {

    $ionicActionSheet.show({
      buttons: [
        { text: '<span class="report">Block User</span>'},
        { text: '<span class="report">Report</span>' },
      ],
      cancelText: 'Cancel',
      cancel: function() {
        //console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        if (index == 0) {
          $scope.blockUser(userId);
        } else if (index == 1) {
          $scope.reportUser(userId);
        }
        return true;
      }
    });
  }

  var kickablePopup = {};

  $scope.showKickable = function(theirId) {
    PeopleService.getKickableChallenges(loggedUser._id, theirId)
    .then(function(data){
      if (Object.keys(data).length == 0) {
        $scope.no_kickable = true;
      } else {
        $scope.no_kickable = false;
      }
      for (challenge in data){
        var challenge = data[challenge];
        PeopleService.isAlreadyKicked(challenge.challengeId, theirId, loggedUser._id, challenge).then(function(kickdata) {
          if(kickdata.isKicked == true){
            kickdata.challenge.isAlreadyKicked = true;
          }
        })
      }

      commentsPopup = $ionicPopup.show({
        cssClass: 'popup-outer comments-view',
        templateUrl: 'views/app/partials/kickable-challenges.html',
        scope: angular.extend($scope, {challenges: data}),
        title: 'Kick A Challenge',
        buttons: [
          { text: '', type: 'close-popup ion-ios-close-outline' }
        ]
      });
    });
  };

  $scope.kickIt = function(challengeId, theirId, challenge) {
    PeopleService.isAlreadyKicked(challengeId, theirId, loggedUser._id, challenge).then(function(data) {
      //console.log(data);
      if(data.isKicked == false){
        PeopleService.kickChallenge(challengeId, loggedUser._id, theirId);
        challenge.isAlreadyKicked = true;
      }
    });
  };

  $scope.no_posts = true;

  $scope.$watch(function () { return sharedProperties.getPosts(); }, function (newValue, oldValue) {
    //console.log("detected new post", newValue)
    _.defer(function(){
      $scope.$apply(function(){
        $scope.getAdPost();
        ProfileService.getUserPosts($scope.thisProfileId,$scope.postPage).then(function(data) {

          $scope.posts = data;
          if (Object.keys(data).length == 0) {
            $scope.no_posts = true;
          } else {
            $scope.no_posts = false;
          }

        });
      });
    });
  });

  $scope.getUserPosts = function(){
    $scope.activeSubView = 'posts';
    $scope.postPage = 1;
    $scope.getAdPost();
    if ($scope.postsLoaded != true) {
      ProfileService.getUserPosts($scope.thisProfileId,$scope.postPage).then(function(data) {

        $scope.posts = data;
        if (Object.keys(data).length == 0) {
          $scope.no_posts = true;
        } else {
          $scope.no_posts = false;
        }
        $scope.postsLoaded = true;

      });
    }

    if(typeof analytics !== undefined) { analytics.trackView("Profile Posts"); }
    //we need to do this in order to prevent the back to change
    // $ionicHistory.currentView($ionicHistory.backView());
    // $ionicHistory.nextViewOptions({ disableAnimate: true });
    //$state.go('app.profile.pics', {userId: user._id});
  };

  $scope.moreData = true;

  $scope.loadMoreData = function(){
    $scope.postPage += 1;
    $scope.postsLoaded = false;
    ProfileService.getUserPosts($scope.thisProfileId, $scope.postPage).then(function(data) {

      $scope.posts = $scope.posts.concat(data);

      if (Object.keys(data).length == 0) {
        $scope.moreData = false;
      } else {
        $scope.moreData = true;
      }

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.moreDataCanBeLoaded = function(){
    return $scope.moreData;
  };

  $scope.getUserFriends = function(){
    $scope.activeSubView = 'friends';

    $scope.allUsers = all_users.data;

    if ($scope.friendsLoaded != true) {

      PeopleService.getFollowing($scope.thisProfileId).then(function(data) {

        $scope.following = data;
        $scope.followingCount = Object.keys(data).length;

        if ($scope.followingCount == 0) {
          $scope.no_following = true;
        } else {
          $scope.no_following = false;
        }
        $scope.friendsLoaded = true;

      });

      PeopleService.getFollowers($scope.thisProfileId).then(function(data) {

        $scope.followers = data;
        $scope.followerCount = Object.keys(data).length;

        if ($scope.followerCount == 0) {
          $scope.no_followers = true;
        } else {
          $scope.no_followers = false;
        }

      });

      if (loggedUser.private == true && $scope.this_is_me == true) {
        PeopleService.getFollowRequests(loggedUser._id).then(function(data) {

          $scope.followRequest = data;
          if (Object.keys(data).length == 0) {
            $scope.no_requests = true;
          } else {
            $scope.no_requests = false;
          }

        });
      }
    }

    if(typeof analytics !== undefined) { analytics.trackView("Profile Contacts"); }
    //we need to do this in order to prevent the back to change
    // $ionicHistory.currentView($ionicHistory.backView());
    //  $ionicHistory.nextViewOptions({ disableAnimate: true });
    // $state.go('app.profile.friends', {userId: user._id});
  };

  $scope.getUserChallenges = function(){
    $scope.activeSubView = 'challenges';
    $scope.getAdChallenge();

    if ($scope.kickedLoaded != true) {
      ProfileService.getKickedChallenges(profileUserId).then(function(data) {
        var kickedChallenges = data;
        $scope.kickedChallenges = kickedChallenges;
        if (Object.keys(kickedChallenges).length == 0) {
          $scope.no_kicked_challenges = true;
        } else {
          $scope.no_kicked_challenges = false;
        }
        $scope.kickedLoaded = true;

      });
    }
    
    if ($scope.acceptLoaded != true) {
      ProfileService.getActiveChallenges(profileUserId).then(function(data) {
        var activeChallenges = data;
        $scope.activeChallenges = activeChallenges;
        if (Object.keys(activeChallenges).length == 0) {
          $scope.no_active_challenges = true;
        } else {
          $scope.no_active_challenges = false;
        }
        $scope.acceptLoaded = true;
      });
    }

    if ($scope.completeLoaded != true) {
      ProfileService.getCompletedChallenges(profileUserId).then(function(data) {
        var completedChallenges = data;
        $scope.completedChallenges = completedChallenges;
        if (Object.keys(completedChallenges).length == 0) {
          $scope.no_completed_challenges = true;
        } else {
          $scope.no_completed_challenges = false;
        }
        $scope.completeLoaded = true;
      });
    }

    if(typeof analytics !== undefined) { analytics.trackView("Profile Challenges"); }
    //we need to do this in order to prevent the back to change
    // $ionicHistory.currentView($ionicHistory.backView());
    //  $ionicHistory.nextViewOptions({ disableAnimate: true });
    // $state.go('app.profile.challenges', {userId: user._id});
  };
  $scope.getUserLeaderboard = function(){
    $scope.activeSubView = 'leaderboard';
    PeopleService.getLeaderboard().then(function(data) {
      $scope.leaderboard = data;
    });
    $scope.getAdLeaderboard();
    if(typeof analytics !== undefined) { analytics.trackView("Profile Leaderboard"); }
    //we need to do this in order to prevent the back to change
    // $ionicHistory.currentView($ionicHistory.backView());
    //  $ionicHistory.nextViewOptions({ disableAnimate: true });
    // $state.go('app.profile.challenges', {userId: user._id});
  };
})

.controller('ProfileConnectionsCtrl', function($scope) {

})

.controller('LikeCtrl', function($scope, $state, $ionicPopup, $kinvey, ProfileService, FeedService) {
  var loggedUser = $kinvey.getActiveUser();
  var userId = loggedUser._id;

  $scope.addOrRemoveLike = function(post) {

    var query = new $kinvey.Query();
    query.equalTo('postId', post._id).and().equalTo('userId', userId);
    var promise = $kinvey.DataStore.find('postLikes', query);
    promise.then(function(row) {
      console.log(row);
      if (_.isEmpty(row)) {
        var new_likes = post.likeCount+1;
        if (angular.isUndefined($scope.post)) {
          $scope.featuredPost.likeCount = new_likes;
          $scope.featuredPost.isLiked = true;
        } else {
          $scope.post.likeCount = new_likes;
          $scope.post.isLiked = true;
        }
        ProfileService.likePost(post, loggedUser._id);
      // } else {
      //   var isLiked = false;
      //   _.each(row, function(like) {
      //     var new_likes = post.likeCount-1;
      //     if (angular.isUndefined($scope.post)) {
      //       $scope.featuredPost.likeCount = new_likes;
      //     } else {
      //       $scope.post.likeCount = new_likes;
      //     }
      //     ProfileService.removeLikePost(post, loggedUser._id);
      //   })
      }
    }, function(err) {
      //console.log(err);
    });

  };

  $scope.hideEmpty = false;
  var likesPopup = {};
  //CLICK IN USER NAME
  $scope.navigateToUserProfile = function(user){
    likesPopup.close();
    $state.go('app.profile.challenges', {userId: user._id});
  };

  $scope.getPostLikes = function(post) {
    FeedService.getPostLikes(post)
    .then(function(data){
      if (data.length == 0) {
        $scope.hideEmpty = true;
      }
      post.likes_list = data;
      likesPopup = $ionicPopup.show({
        cssClass: 'popup-outer comments-view input-popup',
        templateUrl: 'views/app/partials/likes.html',
        scope: angular.extend($scope, {current_post: post}),
        title: 'Likes',
        buttons: [
          { text: '', type: 'close-popup ion-ios-close-outline' }
        ]
      });
    });
  };

})

.controller('SharePostCtrl', function($scope, $state, $rootScope, $cordovaSocialSharing, $kinvey, sharedProperties, FeedService) {
  var loggedUser = $kinvey.getActiveUser();

  $scope.share = function(post) {

    $cordovaSocialSharing
        .share(post.brag+' '+post.challenge.handle+' '+post.challenge.hashtag, post.brag+' '+post.challenge.handle+' '+post.challenge.hashtag, '', 'http://www.kickass4good.com/posts.php?id='+post._id) // Share via native share sheet
        .then(function(result) {
          FeedService.addKarma(10);
          $rootScope.$broadcast('pointsEvent', 10);
        //  console.log(result);
        }, function(err) {
        //  console.log(err);
        });
  };

})

.controller('CommentsCtrl', function($scope, $state, $rootScope, $ionicPopup, $kinvey, $ionicActionSheet, sharedProperties, all_users, FeedService) {
  if (cordova.platformId === 'ios') {
   window.addEventListener('native.keyboardshow', function () {
    // console.log("showing kb");
      movePopupFromContainerList(document.getElementsByClassName('input-popup popup-container'), true);
   });
   window.addEventListener('native.keyboardhide', function () {
     //console.log("hiding kb");
      movePopupFromContainerList(document.getElementsByClassName('input-popup popup-container'), false);
   });

   function movePopupFromContainerList(list, up) {
      if (list.length) {
         var popup = list[0].childNodes[0];
         var popupheight = popup.offsetHeight / 2 + 33;
         popup['style'].bottom = up ? popupheight+'px' : '0px';
      }
   }
}
  var loggedUser = $kinvey.getActiveUser();
  $scope.currentUserId = loggedUser._id;
$scope.hideEmpty = false;
  var commentsPopup = {};

  $scope.showComments = function(post) {
    FeedService.getPostComments(post)
    .then(function(data){
      //console.log(data.length)
      if (data.length == 0) {
        //data = [{"text":"No Comments"}];
        $scope.hideEmpty = true;
      }
      post.comments_list = data;
      commentsPopup = $ionicPopup.show({
        cssClass: 'popup-outer comments-view input-popup',
        templateUrl: 'views/app/partials/comments.html',
        scope: angular.extend($scope, {current_post: post}),
        title: 'Comments',
        buttons: [
          { text: '', type: 'close-popup ion-ios-close-outline' }
        ]
      });
    });
  };

  $scope.removeComment = function(post, commentId) {
    FeedService.removeComment(commentId);

    var new_comments = post.commentCount-1;

    if (angular.isUndefined($scope.post)) {
      $scope.featuredPost.commentCount = new_comments;
    } else {
      $scope.post.commentCount = new_comments;
    }

    var arr = $scope.current_post.comments_list;
    for(var i=0; i<arr.length; i++){
        if(arr[i].id == commentId){
            $scope.current_post.comments_list.splice(i, 1);
            break;
        }
    }
  };

  //CLICK IN USER NAME
  $scope.navigateToUserProfile = function(user){
    commentsPopup.close();
    $state.go('app.profile.challenges', {userId: user._id});
  };

  $scope.postComment = function(comment, post){
    console.log('post', post);
    $scope.hideEmpty = false;
    var promise = $kinvey.DataStore.save('comments', {
        comment : comment,
        userId: $scope.currentUserId,
        challengeId: post.challengeId,
        postId: post._id,
        date: Date.now()
    });
    promise.then(function(model) {
      ;
    }, function(err) {
      //  console.log(err);
    });

    var new_comments = post.commentCount+1;

    if (angular.isUndefined($scope.post)) {
      $scope.featuredPost.commentCount = new_comments;
    } else {
      $scope.post.commentCount = new_comments;
    }

    var comments = {
        user: _.find(all_users.data, function(user){ return user._id == $scope.currentUserId }),
        text: comment,
        date: Date.now(),
        me: true
    };

    $scope.current_post.comments_list.push(comments);
    $rootScope.$broadcast('pointsEvent', 2);
    FeedService.addKarma(2);
  };

  $scope.reportComment = function(commentId) {
    var userId = loggedUser._id;
    var time = Date.now();
    FeedService.reportComment(commentId, userId, time);
    var alertPopup = $ionicPopup.alert({
      title: 'Comment Reported',
      template: 'Our moderators will review your request and take the appropriate action within 24 hours.'
    });

    alertPopup.then(function(res) {
    //  console.log('comment reported');
    });
  }

  $scope.showActionSheet = function(commentId) {

    $ionicActionSheet.show({
      buttons: [
        { text: '<span class="report">Report</span>' },
      ],
      cancelText: 'Cancel',
      cancel: function() {
      //  console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        if (index == 0) {
          $scope.reportComment(commentId);
        }
        return true;
      }
    });
  }
})

.controller('CategoryFeedCtrl', function($scope, _, FeedService, $stateParams, loggedUser, feed, category) {
  $scope.loggedUser = loggedUser;
  $scope.cards = feed.challenges;
  $scope.current_category = category;

  $scope.page = 1;// Default page is 1
  $scope.totalPages = feed.totalPages;

  function setAcceptComplete(){
    //FeedService.isFeedAccepted($scope.featuredChallenge)
    //FeedService.isFeedCompleted($scope.featuredChallenge)
    for (card in $scope.cards){
      $scope.card = $scope.cards[card];
      FeedService.isFeedAccepted( $scope.card);
      FeedService.isFeedCompleted( $scope.card);
    }
  }

  function removeAcceptComplete(){
    $scope.featuredChallenge.accepted = false;
    $scope.featuredChallenge.completed = false;
    for (card in $scope.cards){
      //console.log(user)
      $scope.card = $scope.cards[card];
      $scope.card.accepted = false;
      $scope.card.completed = false;
    }
  }
  //setAcceptComplete();
  $scope.$on('$ionicView.beforeEnter', function() {
      removeAcceptComplete();
  });
  $scope.$on('$ionicView.enter', function() {
      setAcceptComplete();
  });
  // Check if we are loading challenges from one category or trend
  var categoryId = $stateParams.categoryId;

  $scope.is_category_feed = true;

  $scope.getNewData = function() {
    // Do something to load your new data here
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.loadMoreData = function(){
    $scope.page += 1;

    // get category feed
    FeedService.getFeedByCategory($scope.page, categoryId)
    .then(function(data){
      //We will update this value in every request because new challenges can be created
      $scope.totalPages = data.totalPages;
      $scope.cards = $scope.cards.concat(data.challenges);

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.moreDataCanBeLoaded = function(){
    return $scope.totalPages > $scope.page;
  };
})

.controller('TrendFeedCtrl', function($scope, _, FeedService, $stateParams, loggedUser, feed, trend) {
  $scope.loggedUser = loggedUser;
  $scope.cards = feed.challenges;
  $scope.current_trend = trend;

  $scope.page = 1;// Default page is 1
  $scope.totalPages = feed.totalPages;
//console.log("")
  // Check if we are loading challenges from one category or trend
  var trendId = $stateParams.trendId;

  $scope.is_trend_feed = true;

  $scope.getNewData = function() {
    // Do something to load your new data here
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.loadMoreData = function(){
    $scope.page += 1;

  //  console.log("Get trends feed");
    // get trend feed
    FeedService.getFeedByTrend($scope.page, trendId)
    .then(function(data){
      //We will update this value in every request because new challenges can be created
      $scope.totalPages = data.totalPages;
      $scope.cards = $scope.cards.concat(data.challenges);

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.moreDataCanBeLoaded = function(){
    return $scope.totalPages > $scope.page;
  };
})

.controller('FeedCtrl', function($scope, _, FeedService,blocked_users, $ionicPosition, $ionicHistory, $ionicModal, $window, $ionicActionSheet, $cordovaFacebookAds, $timeout, $ionicPopup, $kinvey, $sce, $ionicScrollDelegate, $ionicTabsDelegate, $stateParams, loggedUser, featuredChallenge, featuredPost, sharedProperties, $state, PeopleService, ProfileService) {
//$ionicHistory.removeBackView();
//  console.log('FeedCtrl()')

  $scope.featuredChallenge = featuredChallenge;
  $scope.featuredPost = featuredPost;

  $cordovaFacebookAds.setOptions({
    isTesting: false
  });

  $cordovaFacebookAds.removeNativeAd('1224766177553218_1271863812843454'); // details

  $scope.hideAds = false;

  $scope.$on('$ionicView.afterLeave', function() {
      // $scope.hideAds = true;
  });

  sharedProperties.setKarma(loggedUser.karma);
  sharedProperties.setDonate(loggedUser.donate);

  analytics.startTrackerWithId("UA-60985515-7");
  if(typeof analytics !== undefined) { analytics.trackView("Feed"); }


 //$scope.order = '-order';
  $scope.loggedUser = loggedUser;
  PeopleService.updateFBFriends(loggedUser);

  $scope.filterBy = [];

  $scope.unfilterBy = blocked_users.data;

  PeopleService.getFollowing(loggedUser._id).then(function(data) {
    $scope.filterBy.push(loggedUser._id)
    for (user in data){
    //  console.log(user)
      var user = data[user]
      $scope.filterBy.push(user.userId)
    }
  });

  // $scope.clickMe = function(){
  //   PeopleService.getKickableProveIt("57589479adee652640e84d48", 26).then(function(data) {
  //     $scope.kickedUsers = data;
  //   });
  // }

  $scope.swiper = {};
$scope.feedCarousel="true";
$scope.welcomeCarousel="false";
$scope.latest = true;
   $scope.onReadySwiper = function (swiper) {
    $scope.feedCarousel="true";
    $scope.welcomeCarousel="false";
     swiper.on('onSlideChangeEnd', function () {
       console.log('onSlideChangeEnd:'+ swiper.activeIndex);
       //console.log(swiper.activeIndex)

//console.log($(".swiper-slide:nth-child(" + (swiper.activeIndex + 1) + ")").attr("data-order"));
      switch (swiper.activeIndex) {
       case 0:
       //console.log("category")
       $scope.resetOrder('category.name', 'category.name')
       $scope.latest = false;
       break;
       case 1:
       //console.log("latest")
       $scope.resetOrder('-order', 'order')
       $scope.latest = true;
       break;
       case 2:
       //console.log("title")
       $scope.resetOrder('title', 'title')
       $scope.latest = false;
       break;
       case 3:
       //console.log("popularity")
       $scope.resetOrder('-participants', 'participants')
       $scope.latest = false;
       break;
       case 4:
       //console.log("celebrity")
       $scope.resetOrder('user.name', 'user.name')
       $scope.latest = false;
       break;
       case 5:
       //console.log("category")
       $scope.resetOrder('category.name', 'category.name')
       $scope.latest = false;
       break;
       case 6:
       //console.log("latest")
       $scope.resetOrder('-order', 'order')
       $scope.latest = true;
       break;
      }
     });
   };

   // $scope.allUsers = all_users.data;
   // $scope.searchPostUsers = function(searchText){
   //    var filteredPeople = _.filter($scope.allUsers, function(user) {
   //        return user.name.indexOf(searchText) > -1;
   //    });
   //    var userPostIds = _.pluck(filteredPeople, '_id');

   //    _.each(userPostIds, function(userId){
   //      ProfileService.getUserPosts(userId).then(function(data) {
   //        $scope.posts = data;
   //        console.log('data', data);
   //      });
   //    });

   //  }

  $scope.challengePage = 1;// Default page is 1
  $scope.postPage = 1;
  $scope.activitiesPage = 1;


  // $scope.cards = [];
  // FeedService.getFeed($scope.challengePage, "order").then(function(feed) {
  //   $scope.cards = feed.challenges;
  //   $scope.totalPagesChallenges = feed.totalPagesChallenges;
  // });

  function setAcceptComplete(){
    //console.log("setAcceptComplete()")
    FeedService.isFeedAccepted($scope.featuredChallenge)
        FeedService.isFeedCompleted($scope.featuredChallenge).then(function(data) {
          if($scope.featuredChallenge.completed == true){
            $scope.featuredChallenge.accepted = false;
          }
        });


    for (card in $scope.cards){
      $scope.card = $scope.cards[card];
      //console.log($scope.card)
      FeedService.isFeedAccepted( $scope.card)
      FeedService.isFeedCompleted( $scope.card).then(function(data) {

            if($scope.card.completed == true){
              $scope.card.accepted = false;
            }
          });
      // FeedService.isFeedAccepted($scope.card).then(function(data) {
      //     FeedService.isFeedCompleted($scope.card).then(function(data) {
      //       if($scope.card.completed == true){
      //         $scope.card.accepted = false;
      //       }
      //     });
      // });
    }
  }

  function removeAcceptComplete(){
    $scope.featuredChallenge.accepted = false;
    $scope.featuredChallenge.completed = false;
    for (card in $scope.cards){
      //console.log(user)
      $scope.card = $scope.cards[card];
      $scope.card.accepted = false;
      $scope.card.completed = false;
    }
  }
  //setAcceptComplete();
  $scope.$on('$ionicView.beforeEnter', function() {
      // $scope.initChallengeFeed();
      removeAcceptComplete();
  });
  $scope.$on('$ionicView.enter', function() {
      setAcceptComplete();
  });
$scope.reportPost = function(postId) {
  var userId = loggedUser._id;
  var time = Date.now();
  FeedService.report(postId, userId, time);
  var alertPopup = $ionicPopup.alert({
    title: 'Post Reported',
    template: 'Our moderators will review your request and take the appropriate action within 24 hours.'
  });

  alertPopup.then(function(res) {
    //console.log('post reported');
  });
}
$scope.showActionSheet = function(postId) {

  $ionicActionSheet.show({
    buttons: [
      { text: '<span class="report">Report</span>' },
    ],
    cancelText: 'Cancel',
    cancel: function() {
      //console.log('CANCELLED');
    },
    buttonClicked: function(index) {
      if (index == 0) {
        $scope.reportPost(postId);
      }
      return true;
    }
  });
}

  $ionicModal.fromTemplateUrl('views/app/partials/edit-prove-it.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    //$scope.modal = $ionicModal;
    $scope.edit_prove_it_modal = modal;
  });

  $scope.showEditProveIt = function() {
    $scope.edit_prove_it_modal.show();
  };

  $scope.hideProveIt = function() {
    $scope.edit_prove_it_modal.hide();
  };

  $scope.editPost = function(post) {
    $scope.post = post;
    FeedService.getChallenge(post.challengeId).then(function(data) {
      $scope.challenge = data;
    });
    $scope.showEditProveIt();
  }

  $scope.showActionSheetEdit = function(post) {

    $ionicActionSheet.show({
      buttons: [
        { text: 'Edit Post' },
      ],
      cancelText: 'Cancel',
      cancel: function() {
      //  console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        if (index == 0) {
          $scope.editPost(post);
        }
        return true;
      }
    });
  }

$scope.animationEnded = function(event){
  //console.log("done aniamting")
}
$scope.karmaAnimate = function (card) {
    if (!card.accepted) {
        card.accepted = true;
        card.animApplied = true;
    } else {
        card.accepted = false;
    }

}

 $scope.scrollToTop = function() {
  $ionicScrollDelegate.$getByHandle('top').scrollTop();
}


  //    $scope.activeSubView = 'feed';
  //    if(typeof analytics !== undefined) { analytics.trackView("Feed Challenges"); }
      //$scope.challengePage = 1;
      //console.log(order)
      //$scope.cards = [];
      //$scope.cards = feed.challenges;
      //_($scope.cards).shuffle();
      //$scope.order ='reverse';
//       $scope.cards = [];
// console.log($scope.cards)
// for (var i = 0; i < feed.challenges.length; i++) {
//     (function() {
//
//       var j = i;
//       console.log(feed.challenges[j])
//       $timeout(function(){
//         $scope.cards[j] = feed.challenges[j];
//         $ionicScrollDelegate.resize();
//       }, j * 300);
//     })();
//   }
  // console.log($scope.cards)
  //     $scope.cards =  _($scope.cards).shuffle();
  //     console.log($scope.cards)
  //     $scope.order = order;

  //    };

var nativeAdsArray = [];
var nativeAdsPostsArray = [];
var nativeAdsActivityArray = [];

var nativeAds;
var nativeAdsPosts;
var nativeAdsActivity;

var scroller = document.querySelector("#feed-scroll");
var angularElementScroll = angular.element(scroller);
var scrollPosition = $ionicPosition.offset(angularElementScroll);
var scrollHeight = scrollPosition.height-45;
console.log ("scrollHeight: "+scrollHeight)
$scope.getScrollPosition = function(){
  // console.log("Scroll pos from top: ", $ionicScrollDelegate.getScrollPosition().top)
  // if ($scope.activeTab == 1 || $scope.activeTab == 3) {
    $scope.updateClickArea();
  // }

}

$scope.updateClickArea = function(){
    var divId = ['div-0','div-1','div-2','div-3', 'div-4', 'div-5', 'div-6', 'div-7', 'div-8', 'div-9', 'div-10', 'div-11', 'div-12', 'div-13', 'div-14', 'div-15'];
    var activityDivId = ['div-activity-0','div-activity-1','div-activity-2','div-activity-3', 'div-activity-4', 'div-activity-5', 'div-activity-6', 'div-activity-7', 'div-activity-8', 'div-activity-9', 'div-activity-10', 'div-activity-11', 'div-activity-12', 'div-activity-13', 'div-activity-14', 'div-activity-15'];
    var postDivId = 'div-post-2';

    var myElementA = document.querySelector("#feed-scroll");
    var angularElementA = angular.element(myElementA);
    var position2 = $ionicPosition.position(angularElementA);

    if ($scope.activeSubView == 'feed'){
      $cordovaFacebookAds.removeNativeAd('1224766177553218_1271851549511347'); // activity
      $cordovaFacebookAds.removeNativeAd('1224766177553218_1271718966191272'); // post
      $cordovaFacebookAds.removeNativeAd('1224766177553218_1271863812843454'); // details
    // for (ad in nativeAdsArray){
      var ad = nativeAdsArray[ad]

      // if (ad.first == true) {
      //   var myElement = document.querySelector("#"+divId[0]);
      // } else if (ad.second == true) {
      //   var myElement = document.querySelector("#"+divId[3]);
      // } else if (ad.third == true) {
      //   var myElement = document.querySelector("#"+divId[6]);
      // } else if (ad.fourth == true) {
      //   var myElement = document.querySelector("#"+divId[9]);
      // } else if (ad.fifth == true) {
      //   var myElement = document.querySelector("#"+divId[12]);
      // } else if (ad.sixth == true) {
      //   var myElement = document.querySelector("#"+divId[15]);
      // }

      var myElement = document.querySelector("#"+divId[2]);

      if (myElement) {

        var angularElementB = angular.element(myElement);
        //console.log(angularElementB)
        var position = $ionicPosition.position(angularElementB);
        //console.log(position.top +" : "+myElement)
        var top = position.top;

        // if (top > 0 && top < scrollHeight){
          // var offsetY = position.top - $ionicScrollDelegate.getScrollPosition().top;
          var height = position.height;
          top = top+146;

          if (position.top < 0) {
            height = (height + position.top) - 146;
            top = top+146;
          } else {
            var newHeight = position2.height - top - 57;
            height = newHeight;
          }

          if (height >= 292) {
            height = 292;
          }

          if (height > 0) {
            $cordovaFacebookAds.setNativeAdClickArea(nativeAds, position.left, top, position.width, height);
          }

        // }
// }else{
  //console.log("removed element ", myElement)
  //remove click area for myElement
// }

      }
    } else if ($scope.activeSubView == 'posts'){
      $cordovaFacebookAds.removeNativeAd('1224766177553218_1271572566205912'); // challenge
      $cordovaFacebookAds.removeNativeAd('1224766177553218_1271851549511347'); // activity
      $cordovaFacebookAds.removeNativeAd('1224766177553218_1271863812843454'); // details

    // for (ad in nativeAdsPostsArray){
      // var ad = nativeAdsPostsArray[ad];
      // console.log('ad', ad);

      var myElement = document.querySelector("#"+postDivId);

      if (myElement) {

        var angularElementB = angular.element(myElement);

        var position = $ionicPosition.position(angularElementB);

        var top = position.top;

          var height = position.height;
          top = top+120;

          if (position.top < 0) {
            height = (height + position.top) - 120;
            top = top+120;
          } else {
            var newHeight = position2.height - top - 57;
            height = newHeight;
          }

          if (height >= 292) {
            height = 292;
          }

          if (height > 0) {
            $cordovaFacebookAds.setNativeAdClickArea(nativeAdsPosts, position.left, top, position.width, height);
          }

      }
    } else if ($scope.activeSubView == 'activity'){
      $cordovaFacebookAds.removeNativeAd('1224766177553218_1271572566205912'); // challenge
      $cordovaFacebookAds.removeNativeAd('1224766177553218_1271718966191272'); // post
      $cordovaFacebookAds.removeNativeAd('1224766177553218_1271863812843454'); // details
      // for (ad in nativeAdsActivityArray){
        // var ad = nativeAdsActivityArray[ad];

        // if (ad.first == true) {
          // for (var i = 1; i < 16; i++) {
            var myElement = document.querySelector("#"+activityDivId[5]);

            if (myElement) {
              var angularElementB = angular.element(myElement);
              var offset = $ionicPosition.offset(angularElementB);

              var position = $ionicPosition.position(angularElementB);

              var height = position.height;

              var top = offset.top;

              if (position.top < 0) {
                height = height + top;
              }

              // if (position.top > 45) {
              //   var newHeight = position2.height - top - 49;
              //   height = newHeight;
              // }

              if (height > 0 && top < 500 && top > 150) {
                // console.log('top-'+top+' / height-'+height+' / width-'+position.width+' / left '+position.left+' / ID-'+nativeAdsActivity+' / myElement ');
                $cordovaFacebookAds.setNativeAdClickArea(nativeAdsActivity, position.left, top, position.width, height);
              } else {
                $cordovaFacebookAds.setNativeAdClickArea(nativeAdsActivity, 0,0,0,0); // activity
              }
            }
          // }
    }
}

$scope.resetAdClick = function(){

  var placementIds = ['1224766177553218_1271572566205912','1224766177553218_1271718966191272','1224766177553218_1271657729530729','1224766177553218_1271851549511347','1224766177553218_1272904089406093'];

  _.each(placementIds, function(Id){
    $cordovaFacebookAds.removeNativeAd(Id);
  });
}


$scope.getAdChallenge = function(challengePage){
  $scope.hideAds = false;
  var placementId = ['never-used','1224766177553218_1271572566205912','1224766177553218_1271718966191272','1224766177553218_1271657729530729','1224766177553218_1271572566205912','1224766177553218_1271718966191272','1224766177553218_1271657729530729','1224766177553218_1271572566205912','1224766177553218_1271718966191272','1224766177553218_1271657729530729'];
  // $cordovaFacebookAds.createNativeAd(placementId[challengePage]);
  $cordovaFacebookAds.createNativeAd('1224766177553218_1271572566205912');
  var nativeId;
  document.addEventListener('onAdLoaded',function(data) {
      if (data.adType == "native") {
        var adRes = data.adRes;
        nativeId = data.adId;
        if (nativeId) {
          $scope.nativeId = nativeId;

          $scope.nativeAd = adRes;
          var adToTrack = {};

          adToTrack.nativeId = nativeId;
          adToTrack.challenge = true;

          // if (challengePage == 1) {
          //   adToTrack.first = true;
          // } else if (challengePage == 2) {
          //   adToTrack.second = true;
          // } else if (challengePage == 3) {
          //   adToTrack.third = true;
          // } else if (challengePage == 4) {
          //   adToTrack.fourth = true;
          // } else if (challengePage == 5) {
          //   adToTrack.fifth = true;
          // } else if (challengePage == 6) {
          //   adToTrack.sixth = true;
          // }

          nativeAds = nativeId;
          // nativeAdsArray.push(adToTrack);
          //console.log(nativeAdsArray)
        }
      }
    });
}

$scope.getAdPost = function(){
  $scope.hideAds = false;
  $cordovaFacebookAds.createNativeAd('1224766177553218_1271718966191272');
  var nativeId;
  document.addEventListener('onAdLoaded',function(data) {
      if (data.adType == "native") {
        var adRes = data.adRes;
        nativeId = data.adId;
        if (nativeId) {
          $scope.nativePostId = nativeId;

          $scope.nativeAdPost = adRes;
          var adToTrackPost = {};

          adToTrackPost.nativeId = nativeId;
          adToTrackPost.post = true;

          nativeAdsPosts = nativeId;
          // nativeAdsPostsArray.push(adToTrackPost);
        }
      }
    });
}

$scope.getAdActivity = function(activityPage){
  $scope.hideAds = false;
  var placementId = ['never-used','1224766177553218_1271851549511347','1224766177553218_1271863812843454','1224766177553218_1272904089406093','1224766177553218_1271851549511347','1224766177553218_1271863812843454','1224766177553218_1272904089406093','1224766177553218_1271851549511347','1224766177553218_1271863812843454','1224766177553218_1272904089406093'];
  // for (var i = 1; i < 6; i++) {
    $cordovaFacebookAds.createNativeAd(placementId[1]);
  // }
  var nativeId;
  document.addEventListener('onAdLoaded',function(data) {
      if (data.adType == "native") {
        var adRes = data.adRes;
        nativeId = data.adId;
        $scope.nativeAdActivity = adRes;

        var adToTrackActivity = {};

        adToTrackActivity.nativeId = nativeId;
        // adToTrack.post = true;

        // if (activityPage == 1) {
        //   adToTrack.first = true;
        // } else if (activityPage == 2) {
        //   adToTrack.second = true;
        // } else if (activityPage == 3) {
        //   adToTrack.third = true;
        // } else if (activityPage == 4) {
        //   adToTrack.fourth = true;
        // } else if (activityPage == 5) {
        //   adToTrack.fifth = true;
        // } else if (activityPage == 6) {
        //   adToTrack.sixth = true;
        // }

        nativeAdsActivity = nativeId;
        // nativeAdsActivityArray.push(adToTrackActivity);
      }
    });
}

$scope.setActiveTab = function (index) {
      $scope.activeTab = index;
      //console.log('tab iondex:' + index)
//$ionicTabsDelegate.select(index);
}

$scope.activeTab = 1;
//  $scope.page = 1;// Default page is 1
  $scope.activeSubView = 'feed';

  // $scope.totalPages = feed.totalPages;
  //$scope.totalPages = posts.totalPages;

  $scope.is_category_feed = false;
  $scope.is_trend_feed = false;



  $scope.order="-order";
  $scope.feedOrder="order";
  $scope.resetOrder = function (scopeOrder, feedOrder) {
    $ionicScrollDelegate.scrollTop();
    //console.log("reseting order : "+feedOrder)
    $scope.cards = [];
    $scope.order=scopeOrder;
    $scope.feedOrder=feedOrder;
    FeedService.getFeed(1, feedOrder).then(function(newFeed){
      $scope.challengePage = 1;
      $scope.totalPagesChallenges = newFeed.totalPagesChallenges;
      $scope.cards = newFeed.challenges;

    });
      //$scope.order = order;
  }
  $scope.getNewData = function() {

    // Do something to load your new data here
    if ($scope.activeTab == 1) {
      $scope.getAdChallenge($scope.challengePage);
      FeedService.getFeed(1, $scope.feedOrder).then(function(newFeed){
        $scope.challengePage = 1;
        $scope.totalPagesChallenges = newFeed.totalPagesChallenges;
        $scope.cards = [];
        $scope.cards = newFeed.challenges;

      });

      FeedService.getFeaturedChallenge().then(function(newFeat){
        $scope.featuredChallenge = newFeat;
        setAcceptComplete();
      });
    } else if ($scope.activeTab == 2) {
      $scope.getAdPost();
      FeedService.getFeaturedPost().then(function(newFeat){
        $scope.featuredPost = newFeat;
      });
      $scope.postPage = 1;
      FeedService.getAllPosts($scope.postPage).then(function(data) {
        $scope.posts = data.posts;
        if (Object.keys(data.posts).length == 0) {
          $scope.no_posts = true;
        } else {
          $scope.no_posts = false;
        }
        $scope.totalPagesPosts = data.totalPagesPosts;
      });
    } else if ($scope.activeTab == 3) {
      $scope.activityList = [];

      $scope.getAdActivity($scope.activitiesPage);
      FeedService.getActivity($scope.activitiesPage)
      .then(function(data){
      //  console.log('data', data);
        formatActivityData(data);
      });
    }
    // var update_feed = FeedService.getFeed(1);
    // $scope.cards = update_feed.challenges;
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  $scope.$watch(function () { return sharedProperties.getPosts(); }, function (newValue, oldValue) {
    //console.log("detected new post", newValue)
    _.defer(function(){
      $scope.$apply(function(){
        FeedService.getAllPosts($scope.postPage).then(function(data) {
          $scope.posts = data.posts;
          if (Object.keys(data.posts).length == 0) {
            $scope.no_posts = true;
          } else {
            $scope.getAdPost();
            $scope.no_posts = false;
          }
          $scope.totalPagesPosts = data.totalPagesPosts;
        });
      });
    });
  });

  $scope.getPosts = function () {
    $scope.activeSubView = 'posts';
    $scope.postPage = 1;
    FeedService.getAllPosts($scope.postPage).then(function(data) {
      $scope.posts = data.posts;
      //console.log("$scope.posts ",$scope.posts)
      if (Object.keys(data.posts).length == 0) {
        $scope.no_posts = true;
      } else {
        $scope.getAdPost();
        $scope.no_posts = false;
      }
      $scope.totalPagesPosts = data.totalPagesPosts;
    //$scope.posts = posts[0].posts;
    //  console.log("posts: ",data.posts)
    });
  //  $scope.postPage = 1;// Default page is 1
//$scope.posts = posts.posts;
  //   FeedService.getAllPosts()
  //  .then(function(data){
  //  console.log('data',data);
      //We will update this value in every request because new challenges can be created
      // $scope.totalPages = data.totalPages;
      // $scope.cards = $scope.cards.concat(data.challenges);
     //$scope.posts = data.posts;
//console.log("posts: ",posts)
      // $scope.$broadcast('scroll.infiniteScrollComplete');
  //  });
  if(typeof analytics !== undefined) { analytics.trackView("Feed Posts"); }
  };

  $scope.getActivity = function (page) {
    $scope.activityLoading = true;
    page = $scope.activitiesPage;
    $scope.activeSubView = 'activity';
    $scope.activityList = [];
    FeedService.getActivity(page).then(function(data) {
      $scope.activityLoading = false;
      formatActivityData(data)
});
    $scope.getAdActivity($scope.activitiesPage);
    }

    function formatActivityData(data){
     //console.log('data', data);
      var ActivityObject = data;
$scope.totalPagesActivities = data.totalPagesActivities;
      if (Object.keys(ActivityObject.posts).length == 0 && Object.keys(ActivityObject.completed).length == 0 && Object.keys(ActivityObject.accepted).length) {
        $scope.no_activity = true;
      } else {
        $scope.no_activity = false;
      }
      // for (post in userActivity.posts){
      //   var post = userActivity.posts[post]
      //   var formatPost = {};
      //   var user = post.user;
      // //     if (typeof user.name != 'undefined'){
      // //   formatPost.name = user.name;
      // // }
      //   formatPost.verb = "posted on a";
      //   formatPost.challenge = post.challenge.title;
      //   formatPost.date = post._kmd.lmt;
      //   console.log(formatPost);
      // activityList.push(formatPost);
      // }

      for (post in ActivityObject.posts){
         var post = ActivityObject.posts[post]
         //console.log("post in controller",post)
        var formatPost = {};

        var user = post.user;
        if (typeof user.name != 'undefined'){
          formatPost.name = user.name;
        }
        if (typeof user.avatar != 'undefined'){
          formatPost.avatar = user.avatar;
        }
        formatPost.verb = "posted on";
        var challenge = post.challenge;
        if (typeof challenge.title != 'undefined'){
          formatPost.title = challenge.title;
          formatPost.challengeId = challenge.id;
        }
        //formatPost.challenge = post.challenge.title;
        var date1 =new Date(post._kmd.lmt) ;
        var diffDates = days_between(date1)
        formatPost.date = diffDates;
        formatPost.realDate = date1.getTime();
        formatPost.id = post.user._id;
        //console.log(formatPost);
        $scope.activityList.push(formatPost);
      }

      for (complete in ActivityObject.completed){
      var complete = ActivityObject.completed[complete];
      //console.log("completed controller",ActivityObject.completed)
        var formatPost = {};
        //formatPost.name = complete.user_id;
        var user = complete.user;
        if (typeof user.name != 'undefined'){
          formatPost.name = user.name;
        }

        formatPost.verb = "completed";
        var challenge = complete.challenge;
        if (typeof challenge.title != 'undefined'){
          formatPost.title = challenge.title;
          formatPost.challengeId = challenge.id;
        }
        if (typeof user.avatar != 'undefined'){
          formatPost.avatar = user.avatar;
        }
        var date1 =new Date(complete._kmd.lmt) ;
        var diffDates = days_between(date1)
        formatPost.date = diffDates;
        formatPost.realDate = date1.getTime();
        formatPost.id = complete.user_id;
        //console.log(formatPost);
        $scope.activityList.push(formatPost);
      }

      for (accept in ActivityObject.accepted){
      var accept = ActivityObject.accepted[accept];
      //console.log("accept: ",accept)
        var formatPost = {};

        var user = accept.user;
        if (typeof user.name != 'undefined'){
          formatPost.name = user.name;
        }
        if (typeof user.avatar != 'undefined'){
          formatPost.avatar = user.avatar;
        }
        formatPost.verb = "accepted";
        var challenge = accept.challenge;
        if (typeof challenge.title != 'undefined'){
          formatPost.title = challenge.title;
          formatPost.challengeId = challenge.id;
        }
        var date1 =new Date(accept._kmd.lmt) ;
        var diffDates = days_between(date1)
        formatPost.date = diffDates;
        formatPost.realDate = date1.getTime();
        formatPost.id = accept.userId;
        //console.log(formatPost);
        $scope.activityList.push(formatPost);
        // if(typeof analytics !== undefined) { analytics.trackView("Feed Activity"); }
      }

      //console.log($scope.activityList);

      function days_between(date1) {

        // The number of milliseconds in one day
        var ONE_DAY = 1000 * 60 * 60 * 24

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime()
        var date2_ms = Date.now()

        // Calculate the difference in milliseconds
        var difference_ms = Math.abs(date1_ms - date2_ms)

        // Convert back to days and return
        return Math.round(difference_ms/ONE_DAY)

      }

      $scope.activityList = $scope.activityList.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return b.realDate - a.realDate;
      });

      // FeedService.getActivity($scope.page, loggedUser._id)
      // .then(function(data){
      //   console.log('completed',data.completed);
      //   console.log('posts',data.posts);
      //   //We will update this value in every request because new challenges can be created
      //   // $scope.totalPages = data.totalPages;
      //   // $scope.cards = $scope.cards.concat(data.challenges);
      //   $scope.activityCompleted = data.completed;
      //   $scope.activityPosts = data.posts;

      //   // $scope.$broadcast('scroll.infiniteScrollComplete');
      // });
    };


  $scope.moreData = true;

  $scope.loadMoreData = function(){
    //console.log('loadMoreData')
    //$scope.page += 1;
    // get generic feed
    if ($scope.activeSubView == 'feed'){
      $scope.challengePage += 1;
      // $scope.getAdChallenge($scope.challengePage);
//console.log("in feed")
    FeedService.getFeed($scope.challengePage, $scope.feedOrder)
    .then(function(data){
      //We will update this value in every request because new challenges can be created
      $scope.totalPagesChallenges = data.totalPagesChallenges;
      $scope.cards = $scope.cards.concat(data.challenges);
setAcceptComplete();
      // for (var i = 0; i < data.challenges.length; i++) {
      //     (function() {
      //
      //       var j = i;
      //       console.log(data.challenges[j])
      //       $timeout(function(){
      //         $scope.cards.push (data.challenges[j]);
      //         $ionicScrollDelegate.resize();
      //       }, j * 300);
      //     })();
      //   }
      setTimeout(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, 800);
    });
  }else if($scope.activeSubView == 'posts'){
    $scope.postPage += 1;
    FeedService.getAllPosts($scope.postPage)
    .then(function(data){
      //We will update this value in every request because new challenges can be created
      $scope.totalPagesPosts = data.totalPagesPosts;
      $scope.posts = $scope.posts.concat(data.posts);

      setTimeout(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, 800);
    });

  }else if($scope.activeSubView == 'activity'){
    $scope.activitiesPage += 1;
    $scope.activityList = [];

    $scope.getAdActivity($scope.activitiesPage);
    FeedService.getActivity($scope.activitiesPage)
    .then(function(data){
      //We will update this value in every request because new challenges can be created

      // $scope.totalPagesActivities = data.totalPages;
      formatActivityData(data);

      //$scope.posts = $scope.activities.concat(data.ActivityObject);


      setTimeout(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, 800);
    });

  }
  };

  $scope.moreDataCanBeLoaded = function(){
    //console.log("total pages: "+$scope.totalPages

    if ($scope.activeSubView == 'feed'){
      //console.log("more challenge data? total: " + $scope.totalPagesChallenges + " > page: " + $scope.challengePage)
      // return $scope.totalPagesChallenges > $scope.challengePage;
      return $scope.totalPagesChallenges;
    }else if($scope.activeSubView == 'posts'){
      //console.log("more post data? total: " + $scope.totalPagesPosts + " > page: " + $scope.postPage)
      // return $scope.totalPagesPosts > $scope.postPage;
      return $scope.totalPagesPosts;
    }else if($scope.activeSubView == 'activity'){
      //console.log("more post data? total: " + $scope.totalPagesActivities + " > page: " + $scope.activitiesPage)
      // if ($scope.activitiesPage <= 6) {
        // return true;
      // }
      return false;
    }
  };

  $scope.initChallengeFeed = function(){
    console.log("initChallengeFeed()")
    $scope.activeSubView = 'feed';
    $scope.activeTab = '1';
    setTimeout(function () {
      $scope.getAdChallenge(1);
    }, 800);
      $scope.is_category_feed = false;
      $scope.is_trend_feed = false;
    if(typeof analytics !== undefined) { analytics.trackView("Feed Challenges"); }
  $scope.challengePage = 1;
  $scope.cards = [];
  FeedService.getFeed($scope.challengePage, "order").then(function(feed) {
    $scope.cards = feed.challenges;
    $scope.totalPagesChallenges = feed.totalPagesChallenges;
  });
  
  }
  $scope.initChallengeFeed();

})

.controller('PeopleCtrl', function($scope, people_suggestions, people_you_may_know, fb_friends, following) {
  $scope.people_suggestions = people_suggestions;
  $scope.people_you_may_know = people_you_may_know;
  $scope.fb_friends = fb_friends;
  // $scope.fb_invites = fb_invites;
  $scope.following = following;
})

.controller('BrowseCtrl', function($scope, trends, categories) {
  $scope.trends = trends;
  $scope.categories = categories;
})
.controller('MenuCtrl', function($scope, $timeout, $rootScope, $ionicHistory, $cordovaFacebookAds, $cordovaSocialSharing, ProfileService, sharedProperties, $state, FeedService, sharedProperties, loggedUser, $ionicTabsDelegate) {
$scope.pointsAnimation = false;
  $scope.loggedUser = loggedUser;

  // $cordovaFacebookAds.createBanner({
  //       adId : '1224766177553218_1280367268659775',
  //       position:FacebookAds.AD_POSITION.BOTTOM_CENTER,
  //       autoShow:true
  //     });

  // $cordovaFacebookAds.showBannerAtXY(30,50);

  $scope.updateKicked = function(){
    console.log("updateKicked()")
    ProfileService.getKickedChallenges(loggedUser._id).then(function(kickedChallenges) {
      //console.log('kicked', kickedChallenges);
      $scope.data = {
        currentKickedChallenges : kickedChallenges.length
      };
    });
  }
$scope.updateKicked();
$rootScope.$on('completedEvent', function(event, args) {
  $scope.updateKicked();
});
$rootScope.$on('pointsEvent', function(event, points) {
  //console.log("points to menu contoller: "+points);
  $scope.pointsToDisplay = '+ '+points;
$scope.pointsAnimation = true;


});
$rootScope.$on('negativePointsEvent', function(event, points) {
  //console.log("points to menu contoller: "+points);
  $scope.pointsToDisplay = '- '+points;
$scope.pointsAnimation = true;


});
  $rootScope.$on('loggedUser', function(event, data) {
    $scope.loggedUser = data.data;


  });

  $scope.animationEnded = function(event){
    //console.log("done aniamting")
$scope.pointsAnimation = false;
  }


//   $timeout(function(){
//   $ionicTabsDelegate.select(0);
// },0);
  // $scope.selectTabWithIndex = function(index) {
  //   $ionicTabsDelegate.select(index);
  //   console.log(index)
  // }
  // $scope.poop = poop;
   var prevSelectedIndex;

   $scope.resetAdClick = function(){

    var placementIds = ['1224766177553218_1271572566205912','1224766177553218_1271718966191272','1224766177553218_1271657729530729','1224766177553218_1271851549511347','1224766177553218_1272904089406093'];
    // $scope.hideAds = true;
    _.each(placementIds, function(Id){
      $cordovaFacebookAds.removeNativeAd(Id);
    });
  }
$scope.activeButton = false;
  $scope.myEvent = function(appSection){
$scope.activeButton = false;
    $scope.resetAdClick();
    //updating kicked here on menu swithc to try and pickup any updated kicked challenges to the user while they navigate the app
    $scope.updateKicked();
    //console.log('current: ' , $state.current.name)
    //console.log('myEvent: ' + appSection)
    switch (appSection) {
    case 'settings':
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
    $scope.activeButton = true;
    $timeout(function(){
    $ionicTabsDelegate.select(4);
  },0);
        $state.go('app.settings');
		break;
    case 'feed':
    if($state.current.name != "app.feed"){
      $ionicHistory.nextViewOptions({
          disableBack: true
      });
    }
        $state.go('app.feed');
        break;
    case 'share':
//$state.go('app.sharing');
      //   var tempIndex = prevSelectedIndex;
      //   $timeout(function(){
      //    $ionicTabsDelegate.select(+tempIndex);
      //  },0);
        $cordovaSocialSharing
        .share('Check Out This Awesome New App! #KickAss4Good', 'Check Out This Awesome New App! #KickAss4Good', 'http://www.kickass4good.com/assets/img/facebook.png', 'http://www.kickass4good.com/') // Share via native share sheet
        .then(function(result) {
          FeedService.addKarma(10);
          $rootScope.$broadcast('pointsEvent', 10);
          //console.log(result);
        }, function(err) {
          //console.log(err);
        });
        $timeout(function(){
        $ionicTabsDelegate.select(4);
      },0);
//$state.go('.');
		break;
    case 'donateKarma':
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
        $state.go('app.donateKarma');
    break;

    case 'browse':
        $state.go('app.browse');
        break;
    case 'aboutus':
      //  $state.go('app.profile.posts', {userId: 0});
		break;
    case 'profile':
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
        $state.go('app.profile.challenges', {userId: loggedUser._id});
        //console.log('profile seelcted')

        break;

}
 prevSelectedIndex = $ionicTabsDelegate.selectedIndex();
  }
$scope.backdropVisible = sharedProperties.getString();
$scope.showBackdrop = function() {
var bdActive = sharedProperties.getString()
if (bdActive == 'true')
  return true;
else
  return false;

};
})
.controller('AppCtrl', function($scope, $ionicModal, $timeout, AuthService) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('views/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    //console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('EmailComposerCtrl', function($scope, $cordovaEmailComposer, $ionicPlatform) {
  //we use email composer cordova plugin, see the documentation for mor options: http://ngcordova.com/docs/plugins/emailComposer/
  $scope.sendMail = function(){
    $ionicPlatform.ready(function() {
      $cordovaEmailComposer.isAvailable().then(function() {
        // is available
        //console.log("Is available");
        $cordovaEmailComposer.open({
          to: 'hi@startapplabs.com',
          subject: 'Nice Theme!',
          body: 'How are you? Nice greetings from Social App'
        }).then(null, function () {
          // user cancelled email
        });
      }, function () {
        // not available
        //console.log("Not available");
      });
    });
  };
})

.controller('SettingsCtrl', function($scope, $ionicModal, $state, loggedUser, ProfileService, sharedProperties) {
  $scope.loggedUser = loggedUser;

  $ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.terms_of_service_modal = modal;
  });

  $ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.privacy_policy_modal = modal;
  });

  $ionicModal.fromTemplateUrl('views/app/profile/change-profile-pic.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.change_profile_pic = modal;
  });

  $scope.showTerms = function() {
    $scope.terms_of_service_modal.show();
  };

  $scope.showPrivacyPolicy = function() {
    $scope.privacy_policy_modal.show();
  };

  $scope.showChangeProfile = function() {
    $scope.change_profile_pic.show();
  };

  $scope.donateSettings= function() {
    $state.go('app.donateKarma');
  };

  $scope.privateChange= function() {
    ProfileService.setPrivate();
  };

  if(typeof analytics !== undefined) { analytics.trackView("Settings"); }
})

.controller('AppRateCtrl', function($scope) {
	$scope.appRate = function(){
		if(ionic.Platform.isIOS()){
			//you need to set your own ios app id
			AppRate.preferences.storeAppURL.ios = '1118544362';
			AppRate.promptForRating(true);
		}else if(ionic.Platform.isAndroid()){
			//you need to set your own android app id
			// AppRate.preferences.storeAppURL.android = 'market://details?id=ionTheme3';
			// AppRate.promptForRating(true);
		}
	};
})

.controller('LogOutCtrl', function($scope, $localStorage, $state, $timeout, $kinvey, UserService) {
  $scope.logout = function(){
    $kinvey.User.logout().then(function(){
      $localStorage.$reset();
      UserService.logout();
      $state.go('facebook-sign-in');
    }, function(err) {
      console.log("Error: logged out", err);
    });
  };
})
.controller('DonateCtrl', function($scope,ProfileService,FeedService,$stateParams,sharedProperties,CategoryService, $cordovaInAppBrowser, loggedUser,  $kinvey, $timeout, $filter, $ionicPopup, $ionicScrollDelegate, UserService) {
  $scope.user = UserService.active_user();
  var active_user = UserService.active_user();
  // var profileUserId = $stateParams.userId;
  // ProfileService.getUserData(profileUserId).then(function(data) {
  //   var user = data;
  //   console.log(user)
  //     });
  $scope.$on('$ionicView.afterEnter', function() {
    getDonateData();
    console.log("getting karma")
    CategoryService.getDonateText().then(function(data) {
      console.log('donate data', data[0].text);
      $scope.donateText = data[0].text;
    });
    FeedService.getKarma().then(function(points) {
      $scope.user.karma = points;
    });
    FeedService.getDonate().then(function(points) {
      $scope.user.donate = points;
    });
  });
    $scope.$watch(function () { return sharedProperties.getKarma(); }, function (newValue, oldValue) {
      $scope.user.karma = newValue;
      console.log('changed value of karma', newValue);
    });
    $scope.$watch(function () { return sharedProperties.getDonate(); }, function (newValue, oldValue) {
      $scope.user.donate = newValue;
      console.log('changed value of karma', newValue);
    });


  //$scope.categories = categories;
  //$scope.charities = charities;
var getDonateData = function(){
  CategoryService.getCategories().then(function(data) {
    $scope.categories= data;
  });
  CategoryService.getCharities().then(function(data) {
    $scope.charities= data;
  });
}
  $scope.currentUserId = active_user._id;
  $scope.donate = false;
  $scope.donateShow=[];
  $scope.activeSubView = "donate";
  $scope.activeTab = 1;

  $scope.setActiveTab = function (index) {
        $scope.activeTab = index;
        //console.log('tab iondex:' + index)
        if(index==1){
          getDonateData();
          $scope.activeSubView = "donate";
        }else{
          $scope.activeSubView = "leaderboard";
          // var dfd = $q.defer();

          var query = new $kinvey.Query();
          query.descending('points_donated');
          var promise = $kinvey.DataStore.find('charities', query);
          promise.then(function(leaders) {
            $scope.leaders = leaders;
          }, function(err) {
              console.log(err);
          });

        }
        $ionicScrollDelegate.scrollTop();
  //$ionicTabsDelegate.select(index);
  }
  $scope.inAppBrowserLink = function(link) {
      var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'yes'
      };

      $cordovaInAppBrowser.open(link, '_blank', options)
        .then(function(event) {
          // success
        })
        .catch(function(err) {
          // error
          //console.log(err);
        });
  }

  $scope.donateClick = function ( ) {

    $scope.donate = true;
    this.charity.userDonated = this.charity.userDonated ? +this.charity.userDonated : "";
    this.showEdit = true;
    //console.log(this)
    $scope.pointData = { 'points' : 0 };
  }
  $scope.cancelClick= function () {
    $scope.donate = false;
    this.showEdit = false;

  }
  $scope.okClick= function () {
    var convertPoints = this.charityuserDonated ? +this.charity.userDonated : "0";
     var pointMid = +$scope.pointData.points - convertPoints;
    showConfirm( pointMid, this)
  }
  function showConfirm(points,  ui) {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Confirm Donation',
       template: 'Are you sure you want to donate this amount?  All donations are final.'
     });

     confirmPopup.then(function(res) {
       if(res) {
         $scope.donate = false;
         $scope.user.donate = +$scope.user.donate - points ;
         ui.charity.userDonated = +ui.charity.userDonated +  +points ;
         //console.log(" save " + points + "points to charity id: " + ui.charity.charity_id)
         ui.showEdit = false;
         var totalPoints = ui.charity.points_donated + points;
         var promise = $kinvey.DataStore.update('charities', {
             points_donated : totalPoints ,
             name: ui.charity.name,
             category_id: ui.charity.category_id,
             charity_id: ui.charity.charity_id,
             link: ui.charity.link,
             _id: ui.charity._id
         });
         //loggedUser.donate = +loggedUser.donate - points;
         // sharedProperties.setKarma(active_user.karma);
         // sharedProperties.setDonate(active_user.donate);
         var promise = $kinvey.User.update(active_user);
              promise.then(function(user) {
              //console.log("success:" + user.karma)

              }, function(err) {
                  //console.log(err);
              });
         promise.then(function(model) {
         }, function(err) {
             //console.log(err);
         });

       } else {
         //console.log('You canceled');
       }
     });
   };
  $scope.pointData = { 'points' : '0' };

  var timeoutId = null;

  $scope.$watch('pointData.points', function() {
    //console.log('Has changed');
    if(timeoutId !== null) {
      //console.log('Ignoring this movement');
      return;
    }
    //console.log('Not going to ignore this one');
    timeoutId = $timeout( function() {
      //console.log('It changed recently!');
      $timeout.cancel(timeoutId);
      timeoutId = null;
      // Now load data from server
    }, 1000);

  })
  if(typeof analytics !== undefined) { analytics.trackView("Donate"); }
})

.controller('ChallengeDetailsCtrl', function($scope, $sce, $kinvey, $rootScope, $ionicPosition, $cordovaFacebookAds, $cordovaSocialSharing, $cordovaInAppBrowser, $ionicActionSheet, sharedProperties, challenge,  FeedService, $ionicPopup, $ionicModal, loggedUser, liked, kicked, accepted, completed, sharedProperties, $stateParams) {
  $scope.challenge = challenge;
  $scope.challenge.participants = challenge.participants;

  // var nativeAdsDetails;

  $cordovaFacebookAds.removeNativeAd('1224766177553218_1271572566205912'); // challenge
  $cordovaFacebookAds.removeNativeAd('1224766177553218_1271718966191272'); // post
  $cordovaFacebookAds.removeNativeAd('1224766177553218_1271863812843454'); // details
  $cordovaFacebookAds.removeNativeAd('1224766177553218_1271851549511347'); // activity

  // var scroller = document.querySelector("#feed-scroll");
  // var angularElementScroll = angular.element(scroller);
  // var scrollPosition = $ionicPosition.offset(angularElementScroll);
  // var scrollHeight = scrollPosition.height-45;
  // $scope.getScrollPosition = function(){
  //     $scope.updateClickArea();
  // }

  // $scope.updateClickArea = function(){
  //     var detailsDivId = 'div-details-2';

  //     var myElementA = document.querySelector("#details-scroll");
  //     var angularElementA = angular.element(myElementA);
  //     var position2 = $ionicPosition.position(angularElementA);

  //       var myElement = document.querySelector("#"+detailsDivId);

  //       if (myElement) {
  //         var angularElementB = angular.element(myElement);
  //         var offset = $ionicPosition.offset(angularElementB);

  //         var position = $ionicPosition.position(angularElementB);

  //         var height = position.height;

  //         var top = offset.top;


  //         if (top < 64) {
  //           height = height - top - 60;
  //         }

  //         if (height > 0 && top < 500) {
  //           $cordovaFacebookAds.setNativeAdClickArea(nativeAdsDetails, position.left, top, position.width, height);
  //         }
  //       }
  // }

  // $scope.getAdDetails = function(){
  //   $scope.hideAdsDetails = false;
  //   var placementId = ['never-used','1224766177553218_1271863812843454'];
  //     $cordovaFacebookAds.createNativeAd(placementId[1]);
  //   var nativeId;
  //   document.addEventListener('onAdLoaded',function(data) {
  //       if (data.adType == "native") {
  //         var adRes = data.adRes;
  //         nativeId = data.adId;
  //         $scope.nativeAdsDetails = adRes;

  //         nativeAdsDetails = nativeId;
  //       }
  //     });
  // }

  // $scope.getAdDetails();


  $ionicModal.fromTemplateUrl('views/app/partials/edit-prove-it.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    //$scope.modal = $ionicModal;
    $scope.edit_prove_it_modal = modal;
  });

  $scope.showEditProveIt = function() {
    $scope.edit_prove_it_modal.show();
  };

  $scope.hideProveIt = function() {
    $scope.edit_prove_it_modal.hide();
  };

  $scope.editPost = function(post) {
    $scope.post = post;
    FeedService.getChallenge(post.challengeId).then(function(data) {
      $scope.challenge = data;
    });
    $scope.showEditProveIt();
  }

  $scope.showActionSheetEdit = function(post) {

    $ionicActionSheet.show({
      buttons: [
        { text: 'Edit Post' },
      ],
      cancelText: 'Cancel',
      cancel: function() {
      //  console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        if (index == 0) {
          $scope.editPost(post);
        }
        return true;
      }
    });
  }

$scope.inAppBrowserLink = function(link) {
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };

    $cordovaInAppBrowser.open(link, '_blank', options)
      .then(function(event) {
        // success
      })
      .catch(function(err) {
        // error
        //console.log(err);
      });
}


  $scope.getChallengePosts = function() {

      $scope.posts = [];
      $scope.postPage = 1;

      FeedService.getChallengePosts(challenge.id, $scope.postPage).then(function(data) {
        $scope.posts = data;
        if (Object.keys(data).length == 0) {
          $scope.no_posts = true;
        } else {
          $scope.no_posts = false;
          $scope.moreData = true;
        }
      });
  }


  $scope.loadMoreData = function(){
    $scope.postPage += 1;

    FeedService.getChallengePosts(challenge.id, $scope.postPage).then(function(data) {

      $scope.posts = $scope.posts.concat(data);

      if (Object.keys(data).length == 0) {
        $scope.moreData = false;
      } else {
        $scope.moreData = true;
      }

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.moreDataCanBeLoaded = function(){
    return $scope.moreData;
  };

  $scope.share = function() {
    $scope.shared = true;
    $cordovaSocialSharing
    .share(challenge.callout, challenge.callout, '', 'http://www.kickass4good.com/challenge.php?id='+challenge.id) // Share via native share sheet
    .then(function(result) {
      FeedService.addKarma(10);
      $rootScope.$broadcast('pointsEvent', 10);
      //console.log(result);
    }, function(err) {
      //console.log(err);
    });
  }

  $scope.shareTwitterDetail = function(challenge) {
    //console.log("twitter detail ", challenge)
    $cordovaSocialSharing
    .shareViaTwitter(challenge.callout, '', 'http://www.kickass4good.com/challenge.php?id='+challenge.id)
    .then(function(result) {
      //console.log(result);
      FeedService.addKarma(10);
      $rootScope.$broadcast('pointsEvent', 10);
    }, function(err) {
    //  console.log(err);
    });
  }

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  $scope.reportPost = function(postId) {
    var userId = loggedUser._id;
    var time = Date.now();
    FeedService.report(postId, userId, time);
    var alertPopup = $ionicPopup.alert({
      title: 'Post Reported',
      template: 'Our moderators will review your request and take the appropriate action within 24 hours.'
    });

    alertPopup.then(function(res) {
      //console.log('post reported');
    });
  }

  $scope.showActionSheet = function(postId) {

    $ionicActionSheet.show({
      buttons: [
        { text: '<span class="report">Report</span>' },
      ],
      cancelText: 'Cancel',
      cancel: function() {
        //console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        if (index == 0) {
          $scope.reportPost(postId);
        }
        return true;
      }
    });
  }



  var likedString = liked.toString();
  if (likedString == 'true') {
    var isLiked = true;
    $scope.liked = true;
  } else {
    var isLiked = false;
    $scope.liked = false;
  }

  var kickedString = kicked.toString();
  sharedProperties.setKicked(kickedString);

  $scope.$watch(function () { return sharedProperties.getKicked(); }, function (newValue, oldValue) {
      if (newValue !== oldValue){
        //console.log("kicked detected")
        kickedString = newValue;
        if (kickedString == 'true') {
          var isKicked = true;
          $scope.kicked = true;
        } else {
          var isKicked = false;
          $scope.kicked = false;
        }
      }
  });

  if (kickedString == 'true') {
    var isKicked = true;
    $scope.kicked = true;
  } else {
    var isKicked = false;
    $scope.kicked = false;
  }

  var acceptedString = accepted.toString();
  sharedProperties.setAccepted(acceptedString);

  $scope.$watch(function () { return sharedProperties.getAccepted(); }, function (newValue, oldValue) {
      if (newValue !== oldValue){
        //console.log("accepted detected")
        acceptedString = newValue;
        if (acceptedString == 'true') {
          var isAccepted = true;
          $scope.accepted = true;
        } else {
          var isAccepted = false;
          $scope.accepted = false;
        }
      }
  });


  if (acceptedString == 'true') {
    var isAccepted = true;
    $scope.accepted = true;
  } else {
    var isAccepted = false;
    $scope.accepted = false;
  }


  var completedString = completed.toString();
  sharedProperties.setCompleted(completedString);

  $scope.$watch(function () { return sharedProperties.getCompleted(); }, function (newValue, oldValue) {
      if (newValue !== oldValue){
        //console.log("completed detected")
        completedString = newValue;
        if (completedString == 'true') {
          var isCompleted = true;
          $scope.completed = true;
          $scope.accepted = false;
        } else {
          var isCompleted = false;
          $scope.completed = false;
          $scope.accepted = true;
        }
      }
  });

  $scope.$watch(function () { return sharedProperties.getPosts(); }, function (newValue, oldValue) {
    //console.log("detected new post", newValue)
    _.defer(function(){
      $scope.$apply(function(){
        FeedService.getChallengePosts(challenge.id, $scope.postPage)
        .then(function(newposts){
          $scope.posts = newposts;
        },
        function(error){
        //  console.log('error')
        });
      });
    });
  });


  if (completedString == 'true') {
    var isCompleted = true;
    $scope.completed = true;
    $scope.accepted = false;
    FeedService.removeAcceptChallenge(challenge, loggedUser._id);
  } else {
    var isCompleted = false;
    $scope.completed = false;
  }



  $scope.animationEnded = function(event){
  //  console.log("done aniamting")
  }
  $scope.karmaAnimate = function (challenge) {
      if (isKicked) {
        FeedService.removeKickedChallenge(challenge, loggedUser._id);
        isKicked = false;
        $scope.kicked = false;
      }
      if (!isAccepted) {
          FeedService.acceptChallenge(challenge, loggedUser._id);
          FeedService.addKarma(5);
          $rootScope.$broadcast('pointsEvent', 5);
          isAccepted = true;
          $scope.accepted = true;
          // card.animApplied = true;

          var new_participants = challenge.participants+1;

          $scope.challenge.participants = new_participants;

          var promise = $kinvey.DataStore.update('challenges', {
              _id: challenge._id,
              title: challenge.title,
              id: challenge.id,
              userId: challenge.userId,
              description: challenge.description,
              details: challenge.details,
              likes: challenge.likes,
              trend: challenge.trend,
              category: challenge.category,
              date: challenge.date,
              picture: challenge.picture,
              celebId: challenge.celebId,
              participants: new_participants,
              hashtag: challenge.hashtag,
              karma: challenge.karma,
              credit: challenge.credit,
              handle: challenge.handle,
              charity: challenge.charity,
              charityURL: challenge.charityURL,
              callout: challenge.callout,
              order: challenge.order,
              hidden: challenge.hidden
          });
          promise.then(function(model) {
          //  console.log(model);
          }, function(err) {
            //  console.log(err);
          });
      } else {
          FeedService.removeAcceptChallenge(challenge, loggedUser._id);
          isAccepted = false;
          $scope.accepted = false;

          var new_participants = challenge.participants-1;

          $scope.challenge.participants = new_participants;

          var promise = $kinvey.DataStore.update('challenges', {
              _id: challenge._id,
              title: challenge.title,
              id: challenge.id,
              userId: challenge.userId,
              description: challenge.description,
              details: challenge.details,
              likes: challenge.likes,
              trend: challenge.trend,
              category: challenge.category,
              date: challenge.date,
              picture: challenge.picture,
              celebId: challenge.celebId,
              participants: new_participants,
              hashtag: challenge.hashtag,
              karma: challenge.karma,
              credit: challenge.credit,
              handle: challenge.handle,
              charity: challenge.charity,
              charityURL: challenge.charityURL,
              callout: challenge.callout,
              order: challenge.order,
              hidden: challenge.hidden
          });
          promise.then(function(model) {
          //  console.log(model);
          }, function(err) {
            //  console.log(err);
          });
      }

  }

  $scope.likeClick = function (challenge) {
    //console.log(isLiked)
      if (!isLiked) {
          FeedService.likeChallenge(challenge, loggedUser._id);
          FeedService.addKarma(1);
          $rootScope.$broadcast('pointsEvent', 1);
          isLiked = true;
          $scope.liked = true;

          var new_likes = challenge.likes+1;

          $scope.challenge.likes = new_likes;

          var promise = $kinvey.DataStore.update('challenges', {
              _id: challenge._id,
              title: challenge.title,
              id: challenge.id,
              userId: challenge.userId,
              description: challenge.description,
              details: challenge.details,
              likes: new_likes,
              trend: challenge.trend,
              category: challenge.category,
              date: challenge.date,
              picture: challenge.picture,
              celebId: challenge.celebId,
              participants: challenge.participants,
              hashtag: challenge.hashtag,
              karma: challenge.karma,
              credit: challenge.credit,
              handle: challenge.handle,
              charity: challenge.charity,
              charityURL: challenge.charityURL,
              callout: challenge.callout,
              order: challenge.order,
              hidden: challenge.hidden
          });
          promise.then(function(model) {
            //console.log(model);
          }, function(err) {
            //  console.log(err);
          });

      } else {
          FeedService.removeLikeChallenge(challenge, loggedUser._id);
          FeedService.removeKarma(1);
          $rootScope.$broadcast('negativePointsEvent', 1);
          isLiked = false;
          $scope.liked = false;

          var new_likes = challenge.likes-1;

          $scope.challenge.likes = new_likes;

          var promise = $kinvey.DataStore.update('challenges', {
              _id: challenge._id,
              title: challenge.title,
              id: challenge.id,
              userId: challenge.userId,
              description: challenge.description,
              details: challenge.details,
              likes: new_likes,
              trend: challenge.trend,
              category: challenge.category,
              date: challenge.date,
              picture: challenge.picture,
              celebId: challenge.celebId,
              participants: challenge.participants,
              hashtag: challenge.hashtag,
              karma: challenge.karma,
              credit: challenge.credit,
              handle: challenge.handle,
              charity: challenge.charity,
              charityURL: challenge.charityURL,
              callout: challenge.callout,
              order: challenge.order,
              hidden: challenge.hidden
          });
          promise.then(function(model) {
            //console.log(model);
          }, function(err) {
              //console.log(err);
          });
      }
  };

  // $scope.proveItClick = function () {
    //console.log(isCompleted)
    // $scope.prove_it_modal.hide();
      // if (!isCompleted) {
      //     $scope.accepted = false;
      //     $scope.completed = true;
      // } else {
      //     $scope.completed = false;
      // }
  // };

  $scope.setActiveTab = function (index) {
        $scope.activeTab = index;
        //console.log('tab iondex:' + index)
        // if(index == 2){
        //   $scope.getChallengePosts(challenge.id, $scope.postPage);
        // }
  //$ionicTabsDelegate.select(index);
  }

  $scope.activeTab = '1';

  $ionicModal.fromTemplateUrl('views/app/partials/prove-it.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    //$scope.modal = $ionicModal;
    $scope.prove_it_modal = modal;
  });

  $scope.showProveIt = function() {
    $scope.prove_it_modal.show();
  };

  // $ionicModal.fromTemplateUrl('views/app/partials/post.html', {
  //   scope: $scope,
  //   animation: 'slide-in-up'
  // }).then(function(modal) {
  //   $scope.post_modal = modal;
  // });

  // $scope.showPost = function(post) {
  //   $scope.post_modal.show();
  //   $scope.post = post;
  // };

})


.controller('ProveItCtrl', function($scope, $cordovaCamera, $rootScope, $cordovaFile, $cordovaCapture, $ionicActionSheet, $cordovaSocialSharing, $cordovaInstagram, $kinvey, sharedProperties, FeedService, UserService, VideoService, PeopleService, sharedProperties) {
  UserService.init();
  var user = UserService.active_user();
  $scope.uploading = false;
  $scope.clip = '';
  $scope.image = '';
  $scope.type = '';
  $scope.poster = '';
  $scope.brag = '';
  $scope.uploaded = false;


  $scope.clearForm = function() {
    $scope.clip = '';
    $scope.image = '';
    $scope.type = '';
    $scope.poster = '';
    $scope.brag = '';
  }

  $scope.captureVideo = function() {
    var options = { duration: 70 };
    $cordovaCapture.captureVideo(options).then(function(videoData) {
      var arrayLength = videoData.length;
      for (var i = 0; i < arrayLength; i++) {
          $scope.mimeType = videoData[i].type;
      }
      VideoService.saveVideo(videoData).success(function(data) {
        $scope.image = data;
        $scope.mimeType = 'video/quicktime';
        $scope.type = "video";
        var name = data.slice(0, -4);
        window.PKVideoThumbnail.createThumbnail(data, name + '.png').then(function (uri) {
          $scope.$apply(function () {
            $scope.poster = uri;
          });
        });
        // $scope.$apply();
      }).error(function(data) {
        //console.log('ERROR: ' + data);
      });
    });
  }

  $scope.urlForClipThumb = function(clipUrl) {
    var name = clipUrl.substr(clipUrl.lastIndexOf('/') + 1);
    if (name) {
      var trueOrigin = cordova.file.dataDirectory + name;
      var sliced = trueOrigin.slice(0, -4);
      return sliced + '.png';
    }
  }

  $scope.addBrag = function(challenge, brag, image) {
    //TODO: get followers and then compare them against the complted table to see if they have already completed the current challenge.  if not then bring up a window after file upload is complete that allows them to kick challenges to their followers.
    //PeopleService.getFollowers(user._id).then

    // sharedProperties.setKicked('false');
    // sharedProperties.setAccepted('false');
    // sharedProperties.setCompleted('true');
    // $scope.kicked = false;
    // $scope.accepted = false;
    // $scope.completed = true;
//console.log("user._id",user._id)

    if ($scope.type == "image") {
      FeedService.addKarma(challenge.karma);
      $rootScope.$broadcast('pointsEvent', challenge.karma);
    } else if ($scope.type == "video") {
      FeedService.addKarma(challenge.karma*2);
      $rootScope.$broadcast('pointsEvent', challenge.karma*2);
    }

    //shold these 3 lines be set in promise3?
    sharedProperties.setKicked('false');
    sharedProperties.setAccepted('false');
    sharedProperties.setCompleted('true');

    var name = image.substr(image.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;

    function makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i=0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }
// hide after a successful posting instead
  //  $scope.prove_it_modal.hide();

    if ($scope.type == "image") {
      $scope.uploading = true;
      window.resolveLocalFileSystemURL(trueOrigin, function(fileEntry) {
        //console.log('fileEntry 1', fileEntry);
         fileEntry.file(function(file) {
             var reader = new FileReader();
                 reader.onloadend = function(e) {
                      var type = "image/jpeg";

                      var imgBlob = new Blob([ this.result ], { type: type } );
                      //post form call here
                      var promise = $kinvey.File.upload(imgBlob, {
                          _filename   : makeid() + file.name,
                          _public     : true,
                          mimeType    : imgBlob.type,
                          size        : file.size,
                          challengeId : challenge.id,
                          user_id     : user._id
                      });

                      promise.then(function(response) {
                        var entity = {
                            file: {
                                _type : 'KinveyFile',
                                _id   : response._id,
                            },
                            user_id     : user._id,
                            challengeId : challenge.id,
                            brag        : brag,
                            filetype    : $scope.type
                        };
                          var promise2 = $kinvey.DataStore.save('posts', entity);
                          promise2.then(function(model) {

                            sharedProperties.setPosts(model);
                            //console.log("setting posts: ", model);
                              var promise3 = $kinvey.DataStore.save('completed', {
                                  user_id     : user._id,
                                  challengeId : challenge.id
                              });
                              promise3.then(function(model) {
                                  $scope.uploading = false;
                                  FeedService.removeAcceptChallenge(challenge, user._id);
                                  FeedService.removeKickedChallenge(challenge, user._id).then(function(kicked) {
                                      $rootScope.$broadcast('completedEvent', "test");
                                  });
                                  $scope.kicked = false;
                                  $scope.accepted = false;
                                  $scope.completed = true;
                                  getKickedProveit();


                                  //$scope.prove_it_modal.hide();
                                  //$scope.prove_it_modal.remove();
                                  // _.defer(function(){
                                  //   $scope.$apply();
                                  // });
                              }, function(err) {
                                  console.log('1', err);
                                  $scope.uploading = false;
                                  alert('Something went wrong. Please try again.');
                              });
                          }, function(err) {
                             console.log('2',err);
                             $scope.uploading = false;
                            alert('Something went wrong. Please try again.');
                          });
                      }, function(err) {
                          console.log('3',err);
                          $scope.uploading = false;
                          alert('Something went wrong. Please try again.');
                      });
                 };
                 reader.readAsArrayBuffer(file);

         }, function(e){$scope.errorHandler(e)});
      }, function(e){$scope.errorHandler(e)});

    } else if ($scope.type == 'video') {
      $scope.uploading = true;
      var poster_name = $scope.poster.substr($scope.poster.lastIndexOf('/') + 1);
      var poster_trueOrigin = cordova.file.dataDirectory + poster_name;

      window.resolveLocalFileSystemURL(trueOrigin, function(fileEntry) {
        //console.log('fileEntry 2', fileEntry);
         fileEntry.file(function(file) {
          if (file.size > 100000000) {
            alert('Sorry, this video file is too large. Please choose a new file or edit this video.');
          } else {
              var reader = new FileReader();
                 reader.onloadend = function(e) {
                    var type = $scope.mimeType;

                    var vidBlob = new Blob([ this.result ], { type: type } );
                  //  console.log('vidBlob', vidBlob);
                    //post form call here
                    var promise = $kinvey.File.upload(vidBlob, {
                        _filename   : makeid() + file.name,
                        _public     : true,
                        mimeType    : vidBlob.type,
                        size        : file.size,
                        challengeId : challenge.id,
                        user_id     : user._id
                    });

                    promise.then(function(response) {
                      window.resolveLocalFileSystemURL(poster_trueOrigin, function(fileEntry) {
                      //  console.log('fileEntry 3', fileEntry);
                         fileEntry.file(function(file2) {
                           var reader2 = new FileReader();
                           reader2.onloadend = function(e) {
                              var imgBlob = new Blob([ this.result ], { type: 'image/png' } );
                            //  console.log('imgBlob', imgBlob);
                              var imgName = $scope.poster.substr(image.lastIndexOf('/') + 1);
                              //post form call here
                              var imgPromise = $kinvey.File.upload(imgBlob, {
                                  _filename   : makeid() + imgName,
                                  _public     : true,
                                  mimeType    : imgBlob.type,
                                  size        : file2.size,
                                  challengeId : challenge.id,
                                  user_id     : user._id
                              });

                             imgPromise.then(function(imgResponse){
                              var entity = {
                                  file: {
                                      _type : 'KinveyFile',
                                      _id   : response._id,
                                  },
                                  poster_file: {
                                      _type : 'KinveyFile',
                                      _id   : imgResponse._id,
                                  },
                                  user_id     : user._id,
                                  challengeId : challenge.id,
                                  brag        : brag,
                                  filetype    : $scope.type
                              };
                                var promise2 = $kinvey.DataStore.save('posts', entity);
                                promise2.then(function(model) {
                                  sharedProperties.setPosts(model);
                                  //console.log(model);
                                    var promise3 = $kinvey.DataStore.save('completed', {
                                        user_id     : user._id,
                                        challengeId : challenge.id
                                    });
                                    promise3.then(function(model) {
                                      //never gets to here when file fails to upload
                                        $scope.kicked = false;
                                        $scope.accepted = false;
                                        $scope.completed = true;

                                        $scope.uploading = false;
                                        FeedService.removeAcceptChallenge(challenge, user._id);
                                        FeedService.removeKickedChallenge(challenge, user._id).then(function(kicked) {
                                            $rootScope.$broadcast('completedEvent', "test");
                                        });
                                        //$scope.prove_it_modal.hide();
                                        //$scope.prove_it_modal.remove();
                                        getKickedProveit();


                                    }, function(err) {
                                        console.log('4',err);
                                        $scope.uploading = false;
                                        alert('Something went wrong. Please try again.');
                                    });
                                }, function(err) {
                                   console.log('5',err);
                                   $scope.uploading = false;
                                  alert('Something went wrong. Please try again.');
                                });
                            }, function(err) {
                                console.log('6',err);
                                $scope.uploading = false;
                                alert('Something went wrong. Please try again.');
                            });
                          };
                          reader2.readAsArrayBuffer(file2);

                         }, function(e){$scope.errorHandler(e)});
                      }, function(e){$scope.errorHandler(e)});

                    }, function(err) {
                       console.log('7',err);
                       $scope.uploading = false;
                      alert('Something went wrong. Please try again.');
                    });
                 };
                 reader.readAsArrayBuffer(file);
          }

         }, function(e){$scope.errorHandler(e)});
      }, function(e){$scope.errorHandler(e)});
    }

  }


function getKickedProveit(){
//insert kicked code here before revealing span
//57589479adee652640e84d48

PeopleService.getKickableProveIt(user._id, $scope.$parent.challenge.id).then(function(data) {
  //$scope.kickablePeople = data;
  $scope.kickablePeople = [];
  var interimArray = [];
  if(data.length == 0){
    $scope.no_kickable = true;
  }else{
    $scope.no_kickable = false;
  }
  for (challenge in data){
    var challenge = data[challenge];
    // PeopleService.isAlreadyKicked($scope.$parent.challenge.challengeId, challenge[0]._id, loggedUser._id, $scope.$parent.challenge).then(function(kickdata) {
    //   console.log("kickdata.isKicked ",kickdata.isKicked )
    //   if(kickdata.isKicked == true){
    //     kickdata.challenge.isAlreadyKicked = true;
    //   }
    // });
    interimArray.push(challenge[0])
  }
  //console.log("interimArray ",interimArray)
$scope.kickablePeople = _.chain(interimArray).indexBy("_id").values().value();
  //console.log("$scope.kickablePeople: ",$scope.kickablePeople)
});
  $scope.uploaded = true;
}
$scope.kickIt = function(challengeId, theirId, challenge) {
//  PeopleService.isAlreadyKicked(challengeId, theirId, loggedUser._id, challenge).then(function(data) {
    //console.log(data);
    if(challenge.isAlreadyKicked != true){
      PeopleService.kickChallenge(challengeId, user._id, theirId);
      challenge.isAlreadyKicked = true;
    }
//  });
};

$scope.hideProveIt = function(){
  $rootScope.$broadcast('completedEvent', "test");
  $scope.prove_it_modal.hide();
  //$scope.prove_it_modal.remove();
}
  $scope.closeProveIt = function(){
    $rootScope.$broadcast('completedEvent', "test");
    $scope.prove_it_modal.hide();
    $scope.prove_it_modal.remove();
  }
  $scope.addImageCamera = function() {
    var options = {
      destinationType : Camera.DestinationType.FILE_URI,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      onImageSuccess(imageData);

      function onImageSuccess(fileURI) {
        createFileEntry(fileURI);
      }

      function createFileEntry(fileURI) {
        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
      }

      function copyFile(fileEntry) {
        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
        var newName = makeid() + name;

        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
          fileEntry.copyTo(
            fileSystem2,
            newName,
            onCopySuccess,
            fail
          );
        },
        fail);
      }

      function onCopySuccess(entry) {
        $scope.$apply(function () {
          $scope.image = entry.nativeURL;
        });
      }

      function fail(error) {
        alert("fail: " + error.code);
      }

      function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i=0; i < 5; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

    }, function(err) {
      //console.log(err);
    });
  }

  $scope.addImageLibrary = function() {
    var options = {
      destinationType : Camera.DestinationType.FILE_URI,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY, // Camera.PictureSourceType.CAMERA
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      mediaType: Camera.MediaType.ALLMEDIA,
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      onImageSuccess(imageData);

      $scope.dataImg = imageData; // <--- this is your Base64 string
      $scope.imgUrl = "data:image/jpeg;base64," + imageData;

      // var base64 = getBase64Image(document.getElementById("imageid"));
      // $scope.base64 = base64;

      function onImageSuccess(fileURI) {
        createFileEntry(fileURI);
      }

      function createFileEntry(fileURI) {
        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
      }

      function copyFile(fileEntry) {
        fileEntry.file(function(file) {
          if (file.size > 100000000) {
            alert('Sorry, this video file is too large. Please choose a new file or edit this video.');
          } else {
            var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
            var newName = makeid() + name;

            var extension = name.substr(name.lastIndexOf('.'));

            // TODO: Figure this out for Android!
            if (extension == '.jpg' || extension == '.png' || extension == '.jpeg' || extension == '.gif') {
              $scope.type = 'image';
            } else if (extension == '.mov' || extension == '.MOV') {
              $scope.mimeType = 'video/quicktime';
              $scope.type = 'video';
            } else if (extension == '.mp4') {
              $scope.mimeType = 'video/mp4';
              $scope.type = 'video';
            } else {
              $scope.mimeType = 'video/mp4';
              $scope.type = 'video';
            }

            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
              fileEntry.copyTo(
                fileSystem2,
                newName,
                onCopySuccess,
                fail
              );
            },
            fail);
          }
        });
      }

      function onCopySuccess(entry) {
        var name = entry.nativeURL.slice(0, -4);

        if ($scope.type == 'video') {
          window.PKVideoThumbnail.createThumbnail(entry.nativeURL, name + '.png').then(function (uri) {
            $scope.$apply(function () {
              $scope.poster = uri;
              $scope.image = entry.nativeURL;
              console.log('image', $scope.image);
              console.log('poster', $scope.poster);
            });
          });
        } else {
          $scope.$apply(function () {
            $scope.image = entry.nativeURL;
            // $scope.base64 = getBase64Image(entry.nativeURL);
          });
        }
      }

      function fail(error) {
        alert("fail: " + error.code);
      }

      function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i=0; i < 5; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

    }, function(err) {
    //  console.log(err);
    });
  }

  $scope.urlForImage = function(imageName) {
    var name = imageName.substr(imageName.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;
    return trueOrigin;
  }

  $scope.showActionSheet = function(challenge) {

    $ionicActionSheet.show({
      buttons: [
        { text: '<i class="icon ion-camera"></i>Take a Picture <span class="report">(+'+challenge.karma+')</span>' },
        { text: '<i class="icon ion-ios-videocam"></i>Take a Video <span class="report">(+'+(challenge.karma * 2)+')</span> '},
        { text: '<i class="icon ion-upload"></i>Upload From Library' },
      ],
      cancelText: 'Cancel',
      cancel: function() {
        //console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        if (index == 0) {
          $scope.type = 'image';
          $scope.addImageCamera();
        } else if (index == 1) {
          $scope.type = 'video';
          $scope.captureVideo();
        } else {
          $scope.addImageLibrary();
        }
        return true;
      }
    });
  }

  $scope.shareFB = function(message, hashtag, handle, image, id) {
    if(!message || message == undefined){
      message = ""
    }
    var caption = message + ' ' + hashtag;
    console.log("caption", caption);
    //console.log('caption', caption);
    $cordovaSocialSharing
    .shareViaFacebook(caption, image, 'http://www.kickass4good.com/challenge.php?id='+id)
    .then(function(result) {
      //console.log(result);
      FeedService.addKarma(10);
      $rootScope.$broadcast('pointsEvent', 10);
    }, function(err) {
      //console.log(err);
    });
  }

  $scope.shareTwitter = function(message, hashtag, handle, image, id) {
    if(!message || message == undefined){
      message = ""
    }
    console.log("message", message);
    $cordovaSocialSharing
    .shareViaTwitter(message + ' ' + hashtag + ' ' + handle, image, 'http://www.kickass4good.com/challenge.php?id='+id)
    .then(function(result) {
      //console.log(result);
      FeedService.addKarma(10);
      $rootScope.$broadcast('pointsEvent', 10);
    }, function(err) {
      //console.log(err);
    });
  }

  $scope.shareInstagram = function(message, hashtag, image) {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var img = document.getElementById("imageid");
    ctx.drawImage(img,10,10);
    var dataURL = canvas.toDataURL("image/jpeg");
    $cordovaInstagram.share({ image : dataURL, caption : message+' #KickAss4Good '+hashtag }).then(function() {
      //console.log('Worked');
      FeedService.addKarma(10);
      $rootScope.$broadcast('pointsEvent', 10);
    }, function(err) {
      //console.log("Didn't work", err)
    });
  }

})

.controller('ChangeProfilePicCtrl', function($scope, $cordovaCamera, $rootScope, $cordovaFile, $cordovaCapture, $ionicActionSheet, $kinvey, sharedProperties, FeedService, UserService) {

  UserService.init();
  var user = UserService.active_user();

  $scope.user = user;


  $scope.image = '';
  $scope.type = '';

  $scope.addImage = function(image) {

    var name = image.substr(image.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;

    function makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i=0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }

    $scope.change_profile_pic.hide();

    if ($scope.type == "image") {
      window.resolveLocalFileSystemURL(trueOrigin, function(fileEntry) {
         fileEntry.file(function(file) {
             var reader = new FileReader();
                 reader.onloadend = function(e) {
                      var type = "image/jpeg";

                      var imgBlob = new Blob([ this.result ], { type: type } );
                      //post form call here
                      var promise = $kinvey.File.upload(imgBlob, {
                          _filename   : makeid() + file.name,
                          _public     : true,
                          mimeType    : imgBlob.type,
                          size        : file.size,
                          challengeId : null,
                          user_id     : user._id
                      });

                      promise.then(function(response) {
                        var entity = {
                            _id : user._id,
                            avatar_file: {
                                _type : 'KinveyFile',
                                _id   : response._id,
                            }
                        };
                        //console.log('response', response);

                        var promise2 = $kinvey.User.update(entity);
                        promise2.then(function(user_update) {
                          //console.log('user', user_update);
                        }, function(err) {
                          //  console.log(err);
                        });
                          // var promise2 = $kinvey.DataStore.save('posts', entity);
                          // promise2.then(function(model) {

                          // }, function(err) {
                          //     console.log(err);
                          // });
                      }, function(err) {
                        //  console.log(err);
                      });
                 };
                 reader.readAsArrayBuffer(file);

         }, function(e){$scope.errorHandler(e)});
      }, function(e){$scope.errorHandler(e)});

    }

  }

  $scope.showActionSheet = function() {

    $ionicActionSheet.show({
      buttons: [
        { text: '<i class="icon ion-camera"></i>Take a Picture' },
        { text: '<i class="icon ion-upload"></i>Upload From Library' },
      ],
      cancelText: 'Cancel',
      cancel: function() {
      //  console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        if (index == 0) {
          $scope.type = 'image';
          $scope.addImageCamera();
        } else {
          $scope.addImageLibrary();
        }
        return true;
      }
    });
  }

})

.controller('EditProveItCtrl', function($scope, $cordovaCamera, $rootScope, $cordovaFile, $cordovaCapture, $ionicActionSheet, $cordovaSocialSharing, $cordovaInstagram, $kinvey, sharedProperties, FeedService, UserService, VideoService, PeopleService, sharedProperties, $ionicScrollDelegate) {
  UserService.init();
  var user = UserService.active_user();
  $scope.uploading = false;
  $scope.editing = true;
  $scope.clip = '';
  $scope.image = '';
  $scope.type = 'brag';
  $scope.poster = '';



  $scope.clearForm = function() {
    $scope.clip = '';
    $scope.image = '';
    $scope.type = '';
    $scope.poster = '';
    $scope.brag = '';
  }

  $scope.captureVideo = function() {
    var options = { duration: 70 };
    $cordovaCapture.captureVideo(options).then(function(videoData) {
      var arrayLength = videoData.length;
      for (var i = 0; i < arrayLength; i++) {
          $scope.mimeType = videoData[i].type;
      }
      VideoService.saveVideo(videoData).success(function(data) {
        $scope.image = data;
        $scope.mimeType = 'video/quicktime';
        $scope.type = "video";
        var name = data.slice(0, -4);
        window.PKVideoThumbnail.createThumbnail(data, name + '.png').then(function (uri) {
          $scope.$apply(function () {
            $scope.poster = uri;
          });
        });
        // $scope.$apply();
      }).error(function(data) {
        //console.log('ERROR: ' + data);
      });
    });
  }

  $scope.urlForClipThumb = function(clipUrl) {
    var name = clipUrl.substr(clipUrl.lastIndexOf('/') + 1);
    if (name) {
      var trueOrigin = cordova.file.dataDirectory + name;
      var sliced = trueOrigin.slice(0, -4);
      return sliced + '.png';
    }
  }

  $scope.addBrag = function(post, challenge, brag, image) {
    //TODO: get followers and then compare them against the complted table to see if they have already completed the current challenge.  if not then bring up a window after file upload is complete that allows them to kick challenges to their followers.
    //PeopleService.getFollowers(user._id).then

    var name = image.substr(image.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;

    function makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i=0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }

    if (brag == '' || brag == null) {
      brag = post.brag;
    }
// hide after a successful posting instead
  //  $scope.edit_prove_it_modal.hide();

    if ($scope.type == "brag") {
      $scope.uploading = true;
      if (post.filetype == 'image') {
        var entity = {
          _id: post._id,
          file: {
              _type : 'KinveyFile',
              _id   : post.file._id,
          },
          user_id     : post.user_id,
          challengeId : post.challengeId,
          brag        : brag,
          filetype    : post.filetype
        };
      } else {
        var entity = {
          _id: post._id,
          file: {
              _type : 'KinveyFile',
              _id   : post.file._id,
          },
          poster_file: {
              _type : 'KinveyFile',
              _id   : post.poster_file._id,
          },
          user_id     : post.user_id,
          challengeId : post.challengeId,
          brag        : brag,
          filetype    : post.filetype
        };
      }
        var promise2 = $kinvey.DataStore.update('posts', entity);
        promise2.then(function(model) {
          sharedProperties.setPosts(model);
          $scope.uploading = false;
          $scope.edit_prove_it_modal.hide();
          $scope.edit_prove_it_modal.remove();

        }, function(err) {
           console.log('5',err);
           $scope.uploading = false;
          alert('Something went wrong. Please try again.');
        });
    } else if ($scope.type == "image") {
      $scope.uploading = true;
      window.resolveLocalFileSystemURL(trueOrigin, function(fileEntry) {
        //console.log('fileEntry 1', fileEntry);
         fileEntry.file(function(file) {
             var reader = new FileReader();
                 reader.onloadend = function(e) {
                      var type = "image/jpeg";

                      var imgBlob = new Blob([ this.result ], { type: type } );
                      //post form call here
                      var promise = $kinvey.File.upload(imgBlob, {
                          _filename   : makeid() + file.name,
                          _public     : true,
                          mimeType    : imgBlob.type,
                          size        : file.size,
                          challengeId : challenge.id,
                          user_id     : user._id
                      });

                      promise.then(function(response) {
                        var entity = {
                          _id: post._id,
                            file: {
                                _type : 'KinveyFile',
                                _id   : response._id,
                            },
                            user_id     : user._id,
                            challengeId : challenge.id,
                            brag        : brag,
                            filetype    : $scope.type
                        };
                          var promise2 = $kinvey.DataStore.update('posts', entity);
                          promise2.then(function(model) {

                            sharedProperties.setPosts(model);
                            $scope.uploading = false;
                            $scope.edit_prove_it_modal.hide();
                            $scope.edit_prove_it_modal.remove();

                          }, function(err) {
                             console.log('2',err);
                             $scope.uploading = false;
                            alert('Something went wrong. Please try again.');
                          });
                      }, function(err) {
                          console.log('3',err);
                          $scope.uploading = false;
                          alert('Something went wrong. Please try again.');
                      });
                 };
                 reader.readAsArrayBuffer(file);

         }, function(e){$scope.errorHandler(e)});
      }, function(e){$scope.errorHandler(e)});

    } else if ($scope.type == 'video') {
      $scope.uploading = true;
      var poster_name = $scope.poster.substr($scope.poster.lastIndexOf('/') + 1);
      var poster_trueOrigin = cordova.file.dataDirectory + poster_name;

      window.resolveLocalFileSystemURL(trueOrigin, function(fileEntry) {
        //console.log('fileEntry 2', fileEntry);
         fileEntry.file(function(file) {
          if (file.size > 100000000) {
            alert('Sorry, this video file is too large. Please choose a new file or edit this video.');
          } else {
              var reader = new FileReader();
                 reader.onloadend = function(e) {
                    var type = $scope.mimeType;

                    var vidBlob = new Blob([ this.result ], { type: type } );
                  //  console.log('vidBlob', vidBlob);
                    //post form call here
                    var promise = $kinvey.File.upload(vidBlob, {
                        _filename   : makeid() + file.name,
                        _public     : true,
                        mimeType    : vidBlob.type,
                        size        : file.size,
                        challengeId : challenge.id,
                        user_id     : user._id
                    });

                    promise.then(function(response) {
                      window.resolveLocalFileSystemURL(poster_trueOrigin, function(fileEntry) {
                      //  console.log('fileEntry 3', fileEntry);
                         fileEntry.file(function(file2) {
                           var reader2 = new FileReader();
                           reader2.onloadend = function(e) {
                              var imgBlob = new Blob([ this.result ], { type: 'image/png' } );
                            //  console.log('imgBlob', imgBlob);
                              var imgName = $scope.poster.substr(image.lastIndexOf('/') + 1);
                              //post form call here
                              var imgPromise = $kinvey.File.upload(imgBlob, {
                                  _filename   : makeid() + imgName,
                                  _public     : true,
                                  mimeType    : imgBlob.type,
                                  size        : file2.size,
                                  challengeId : challenge.id,
                                  user_id     : user._id
                              });

                             imgPromise.then(function(imgResponse){
                              var entity = {
                                  _id: post._id,
                                  file: {
                                      _type : 'KinveyFile',
                                      _id   : response._id,
                                  },
                                  poster_file: {
                                      _type : 'KinveyFile',
                                      _id   : imgResponse._id,
                                  },
                                  user_id     : user._id,
                                  challengeId : challenge.id,
                                  brag        : brag,
                                  filetype    : $scope.type
                              };
                                var promise2 = $kinvey.DataStore.update('posts', entity);
                                promise2.then(function(model) {
                                  sharedProperties.setPosts(model);
                                  $scope.uploading = false;
                                  $scope.edit_prove_it_modal.hide();
                                  $scope.edit_prove_it_modal.remove();

                                }, function(err) {
                                   console.log('5',err);
                                   $scope.uploading = false;
                                  alert('Something went wrong. Please try again.');
                                });
                            }, function(err) {
                                console.log('6',err);
                                $scope.uploading = false;
                                alert('Something went wrong. Please try again.');
                            });
                          };
                          reader2.readAsArrayBuffer(file2);

                         }, function(e){$scope.errorHandler(e)});
                      }, function(e){$scope.errorHandler(e)});

                    }, function(err) {
                       console.log('7',err);
                       $scope.uploading = false;
                      alert('Something went wrong. Please try again.');
                    });
                 };
                 reader.readAsArrayBuffer(file);
          }

         }, function(e){$scope.errorHandler(e)});
      }, function(e){$scope.errorHandler(e)});
    }

  }

  $scope.addImageCamera = function() {
    var options = {
      destinationType : Camera.DestinationType.FILE_URI,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      onImageSuccess(imageData);

      function onImageSuccess(fileURI) {
        createFileEntry(fileURI);
      }

      function createFileEntry(fileURI) {
        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
      }

      function copyFile(fileEntry) {
        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
        var newName = makeid() + name;

        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
          fileEntry.copyTo(
            fileSystem2,
            newName,
            onCopySuccess,
            fail
          );
        },
        fail);
      }

      function onCopySuccess(entry) {
        $scope.$apply(function () {
          $scope.image = entry.nativeURL;
        });
      }

      function fail(error) {
        alert("fail: " + error.code);
      }

      function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i=0; i < 5; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

    }, function(err) {
      //console.log(err);
    });
  }

  $scope.addImageLibrary = function() {
    var options = {
      destinationType : Camera.DestinationType.FILE_URI,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY, // Camera.PictureSourceType.CAMERA
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      mediaType: Camera.MediaType.ALLMEDIA,
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      onImageSuccess(imageData);

      $scope.dataImg = imageData; // <--- this is your Base64 string
      $scope.imgUrl = "data:image/jpeg;base64," + imageData;

      // var base64 = getBase64Image(document.getElementById("imageid"));
      // $scope.base64 = base64;

      function onImageSuccess(fileURI) {
        createFileEntry(fileURI);
      }

      function createFileEntry(fileURI) {
        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
      }

      function copyFile(fileEntry) {
        fileEntry.file(function(file) {
          if (file.size > 100000000) {
            alert('Sorry, this video file is too large. Please choose a new file or edit this video.');
          } else {
            var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
            var newName = makeid() + name;

            var extension = name.substr(name.lastIndexOf('.'));

            // TODO: Figure this out for Android!
            if (extension == '.jpg' || extension == '.png' || extension == '.jpeg' || extension == '.gif') {
              $scope.type = 'image';
            } else if (extension == '.mov' || extension == '.MOV') {
              $scope.mimeType = 'video/quicktime';
              $scope.type = 'video';
            } else if (extension == '.mp4') {
              $scope.mimeType = 'video/mp4';
              $scope.type = 'video';
            } else {
              $scope.mimeType = 'video/mp4';
              $scope.type = 'video';
            }

            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
              fileEntry.copyTo(
                fileSystem2,
                newName,
                onCopySuccess,
                fail
              );
            },
            fail);
          }
        });
      }

      function onCopySuccess(entry) {
        var name = entry.nativeURL.slice(0, -4);

        if ($scope.type == 'video') {
          window.PKVideoThumbnail.createThumbnail(entry.nativeURL, name + '.png').then(function (uri) {
            $scope.$apply(function () {
              $scope.poster = uri;
              $scope.image = entry.nativeURL;
            });
          });
        } else {
          $scope.$apply(function () {
            $scope.image = entry.nativeURL;
            // $scope.base64 = getBase64Image(entry.nativeURL);
          });
        }
      }

      function fail(error) {
        alert("fail: " + error.code);
      }

      function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i=0; i < 5; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

    }, function(err) {
    //  console.log(err);
    });
  }

  $scope.urlForImage = function(imageName) {
    var name = imageName.substr(imageName.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;
    return trueOrigin;
  }

  $scope.showActionSheet = function(challenge) {

    $scope.editing = false;

    $ionicActionSheet.show({
      buttons: [
        { text: '<i class="icon ion-camera"></i>Take a Picture <span class="report">(+'+challenge.karma+')</span>' },
        { text: '<i class="icon ion-ios-videocam"></i>Take a Video <span class="report">(+'+(challenge.karma * 2)+')</span> '},
        { text: '<i class="icon ion-upload"></i>Upload From Library' },
      ],
      cancelText: 'Cancel',
      cancel: function() {
        //console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        if (index == 0) {
          $scope.type = 'image';
          $scope.addImageCamera();
        } else if (index == 1) {
          $scope.type = 'video';
          $scope.captureVideo();
        } else {
          $scope.addImageLibrary();
        }
        return true;
      }
    });
  }

  $scope.shareFB = function(message, hashtag, handle, image, id) {
    if(!message || message == undefined){
      message = ""
    }
    var caption = message;
    console.log("caption", caption);
    //console.log('caption', caption);
    $cordovaSocialSharing
    .shareViaFacebook(caption, image, 'http://www.kickass4good.com/challenge.php?id='+id)
    .then(function(result) {
      //console.log(result);
      FeedService.addKarma(10);
      $rootScope.$broadcast('pointsEvent', 10);
    }, function(err) {
      //console.log(err);
    });
  }

  $scope.shareTwitter = function(message, hashtag, handle, image, id) {
    if(!message || message == undefined){
      message = ""
    }
    console.log("message", message);
    $cordovaSocialSharing
    .shareViaTwitter(message, image, 'http://www.kickass4good.com/challenge.php?id='+id)
    .then(function(result) {
      //console.log(result);
      FeedService.addKarma(10);
      $rootScope.$broadcast('pointsEvent', 10);
    }, function(err) {
      //console.log(err);
    });
  }

  $scope.shareInstagram = function(message, hashtag, image) {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var img = document.getElementById("imageid");
    ctx.drawImage(img,10,10);
    var dataURL = canvas.toDataURL("image/jpeg");
    $cordovaInstagram.share({ image : dataURL, caption : message+' #KickAss4Good '+hashtag }).then(function() {
      //console.log('Worked');
      FeedService.addKarma(10);
      $rootScope.$broadcast('pointsEvent', 10);
    }, function(err) {
      //console.log("Didn't work", err)
    });
  }

})

//this directive allows you to see when animation has been stopped.  Just use 'animationend = callback' as a data attribute on your animated element where callback is the name of the callback function with no parens
.directive('animationend', function() {
	return {
		restrict: 'A',
		scope: {
			animationend: '&'
		},
		link: function(scope, element) {
			var callback = scope.animationend(),
				  events = 'animationend webkitAnimationEnd MSAnimationEnd' +
						'transitionend webkitTransitionEnd';
			element.on(events, function(event) {
      //  console.log(event)
      //  console.log(callback);
				callback.call(element[0], event);
			});
		}
	};
});
;
