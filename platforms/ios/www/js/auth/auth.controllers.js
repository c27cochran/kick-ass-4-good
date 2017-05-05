angular.module('your_app_name.auth.controllers', [])


.controller('WelcomeCtrl', function($scope, $state, $ionicModal, $cordovaFacebook, $cordovaOauth, $ionicLoading, $kinvey, $http, $localStorage, $timeout, all_users, UserService, PeopleService){
  UserService.init();

  if ($localStorage.active_user) {
    setTimeout(function () {
      $state.go('app.feed');
    }, 1800);
  }
  $scope.feedCarousel = "false";
  $scope.welcomeCarousel = "true";
	$scope.bgs = ["img/drop_splash.png"];
  $scope.swiper = {};

   $scope.onReadySwiper = function (swiper) {
     $scope.feedCarousel = "false";
     $scope.welcomeCarousel = "true";
       swiper.on('slideChangeStart', function () {
           console.log('slide start');
       });

       swiper.on('onSlideChangeEnd', function () {
           console.log('slide end');
       });
   };

	$scope.facebookSignIn = function(){
    $ionicLoading.show({
        template: 'Logging in ...',
        duration: 15000
    });
    $cordovaFacebook.login(["email,public_profile,user_friends"]).then(function(result) {

        var access_token = result.authResponse.accessToken;
        var expires_in = result.authResponse.expiresIn;

        $http.get("https://graph.facebook.com/v2.5/me", { params: { access_token: access_token, fields: "id,email,name,gender,picture,cover,friends{id,name,picture}", format: "json" }}).then(function(response) {
            $localStorage.user_data = response.data;
            $localStorage.access_token = access_token;
        }, function(error) {
            alert("There was a problem getting your FB profile.");
            console.log(error);
        });

        var provider = 'facebook';
        var tokens = {
            access_token: access_token,
            expires_in: expires_in
        };

        UserService.fb_login(provider, tokens).then(null, function(err) {
              // Attempt to signup as a new user if no user with the identity exists.
              if ($kinvey.Error.USER_NOT_FOUND === err.name) {
                  $kinvey.User.signupWithProvider(provider, tokens).then(function(newUser){

                    console.log('newUser', newUser);

                    $localStorage.active_user = newUser;

                    if (typeof $localStorage.user_data.email != 'undefined'){
                        var email = $localStorage.user_data.email;
                    }
                    if (typeof $localStorage.user_data.name != 'undefined'){
                        var name = $localStorage.user_data.name;
                    }
                    if (typeof $localStorage.user_data.picture.data.url != 'undefined'){
                        var picture = $localStorage.user_data.picture.data.url;
                    }
                    if (typeof $localStorage.user_data.cover != 'undefined'){
                      if (typeof $localStorage.user_data.cover.source != 'undefined'){
                        var cover = $localStorage.user_data.cover.source;
                      }
                      if (typeof $localStorage.user_data.cover.offset_y != 'undefined'){
                          var offset_y = $localStorage.user_data.cover.offset_y;
                      }
                    }

                    if (cover) {
                      newUser.cover = cover;
                      newUser.offset_y = offset_y;
                    }
                    if (email) {
                      newUser.email = email;
                    }
                    if (name) {
                      newUser.name = name;
                    }
                    if (picture) {
                      newUser.avatar = picture;
                    }
                    if (typeof newUser.karma == 'undefined') {
                      newUser.karma = 5;
                      newUser.donate = 5;
                    }

                    newUser.private = false;

                    var promise = $kinvey.User.update(newUser);
                    promise.then(function(user) {
                      PeopleService.updateFBFriends(user);
                      $ionicLoading.hide();
                      $state.go('app.feed');
                    }, function(err) {
                        console.log(err);
                    });
                    UserService.init();
                    return null;
                  });
              } else {
                return $kinvey.Defer.reject(err);
              }
          }).then(function(user) {

            if (user) {
              $localStorage.active_user = user;

                console.log('$localStorage.user_data', $localStorage.user_data);

                if ($localStorage.user_data) {
                  if (typeof $localStorage.user_data.email != 'undefined'){
                      var email = $localStorage.user_data.email;
                  }
                  if (typeof $localStorage.user_data.name != 'undefined'){
                      var name = $localStorage.user_data.name;
                  }
                  if (typeof $localStorage.user_data.picture != 'undefined'){
                      var picture = $localStorage.user_data.picture.data.url;
                  }
                  if (typeof $localStorage.user_data.cover != 'undefined'){
                    if ($localStorage.user_data.cover.source){
                      var cover = $localStorage.user_data.cover.source;
                    }
                    if ($localStorage.user_data.cover.offset_y){
                        var offset_y = $localStorage.user_data.cover.offset_y;
                    }
                  }

                  if (cover) {
                    user.cover = cover;
                    user.offset_y = offset_y;
                  }
                  if (email) {
                    user.email = email;
                  }
                  if (name) {
                    user.name = name;
                  }
                  if (picture) {
                    user.avatar = picture;
                  }
                  if (typeof user.karma == 'undefined') {
                    user.karma = 5;
                    user.donate = 5;
                  }

                  var promise = $kinvey.User.update(user);
                  promise.then(function(user) {
                    $ionicLoading.hide();
                  }, function(err) {
                      console.log(err);
                  });

                  $state.go('app.feed');
                } else {
                  $ionicLoading.hide();
                  $state.go('app.feed');
                }

              PeopleService.updateFBFriends(user);

            }

          }).catch(function(err) {
              console.log(err);
          });
    }, function(error) {
        console.log("Error -> " + error);
        alert('Log in unsuccessful. Please try again.');
    });

	};

	$ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.privacy_policy_modal = modal;
  });

	$ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.terms_of_service_modal = modal;
  });

  $scope.showPrivacyPolicy = function() {
    $scope.privacy_policy_modal.show();
  };

	$scope.showTerms = function() {
    $scope.terms_of_service_modal.show();
  };
})

.controller('CreateAccountCtrl', function($scope, $state, $localStorage, $kinvey, all_users, UserService){

  $scope.user = {};

  $scope.doSignUp = function(){
    UserService.createUser($scope.user).then(function(user) {
      $localStorage.active_user = user;

      $kinvey.User.find().then(function(users) {
        all_users.data = users;
      }, function(err) {
        console.log(err);
      });

      $state.go('app.feed');

    }, function(error) {
      console.log(error);
      alert("error logging in " + error.description);
    });
	};
})

.controller('WelcomeBackCtrl', function($scope, $state, $ionicModal, $localStorage, $kinvey, all_users, UserService){
  UserService.init();

  // ng-model holding values from view/html
  $scope.creds = {
    username: "",
    password: ""
  };

	$scope.doLogIn = function(){

    UserService.login($scope.creds.username, $scope.creds.password)
    .then(function(user) {
      $localStorage.active_user = user;

      $kinvey.User.find().then(function(users) {
        all_users.data = users;
      }, function(err) {
        console.log(err);
      });

      $state.go('app.feed');

    }, function(error) {
      alert("error logging in " + error.description);
    })
	};

	$ionicModal.fromTemplateUrl('views/auth/forgot-password.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.forgot_password_modal = modal;
  });

  $scope.showForgotPassword = function() {
    $scope.forgot_password_modal.show();
  };

	$scope.requestNewPassword = function() {
    console.log("requesting new password");
  };

  // //Cleanup the modal when we're done with it!
  // $scope.$on('$destroy', function() {
  //   $scope.modal.remove();
  // });
  // // Execute action on hide modal
  // $scope.$on('modal.hidden', function() {
  //   // Execute action
  // });
  // // Execute action on remove modal
  // $scope.$on('modal.removed', function() {
  //   // Execute action
  // });
})

.controller('ForgotPasswordCtrl', function($scope){

})

;
