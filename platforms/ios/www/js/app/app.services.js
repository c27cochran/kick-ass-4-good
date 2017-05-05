angular.module('your_app_name.app.services', [])

.value( 'KINVEY_AUTH' , 'Basic a2lkX2IxelZJSWxTbFc6NWFhYTQ0NTkzMWEyNDI1NmIzMDM2ZDRkZWEyZWU4ZWU=')
.value( 'KINVEY_APP_URL' , 'https://baas.kinvey.com/appdata/confidential/')

.service('sharedProperties', function() {
    var stringValue = 'test string value';
var karma = '';
var donate = '';
var kicked = '';
var accepted = '';
var completed = '';
var newposts = {};
    return {
        getString: function() {
            return stringValue;
        },
        setString: function(value) {
            stringValue = value;
        },
        setKarma:function(value){
          karma = value;
        },
        setDonate:function(value){
          donate = value;
        },
        setKicked:function(value){
          kicked = value;
        },
        setAccepted:function(value){
          accepted = value;
        },
        setCompleted:function(value){
          completed = value;
        },
        getKarma:function(){
          return karma;
        },
        getDonate:function(){
          return donate;
        },
        getKicked:function(){
          return kicked;
        },
        getAccepted:function(){
          return accepted;
        },
        getCompleted:function(){
          return completed;
        },
        setPosts:function(value){
          newposts = value;
        },
        getPosts:function(){
          return newposts;
        },

    }
})

.service('UserService', ['$q', '$localStorage', 'KinveyConfiguration', '$kinvey', '$rootScope', '$state', '$cordovaSQLite', 'all_users', 'all_challenges', 'blocked_users', 'im_blocked',
    function($q, $localStorage, KinveyConfiguration, $kinvey, $rootScope, $state, $cordovaSQLite, all_users, all_challenges, blocked_users, im_blocked) {

      var initialized = false;


      return {

        /**
         *
         * @returns {*}
         */
        init: function() {
          try {
            var d = $q.defer();

            function getTheUser() {
              var d = $q.defer();
              $kinvey.User.me().then(function(loggedUser) {
                $rootScope.$emit('loggedUser', {
                  data: loggedUser
                });

                $kinvey.User.find().then(function(users) {
                  // $cordovaSQLite.deleteDB({name: 'my.db', location: 'default'});
                  // var query = "INSERT INTO users (_id, username, email, name, avatar, cover, offset_y, karma, donate) VALUES (?,?,?,?,?,?,?,?,?)";
                  // _.each(users, function(user) {
                  //   $cordovaSQLite.execute(db, query, [user._id, user.username, user.email, user.name, user.avatar, user.cover, user.offset_y, user.karma, user.donate]).then(function(res) {
                  //       console.log("INSERT ID -> " + res.insertId);
                  //       console.log(res);
                  //   }, function (err) {
                  //     if (err.code != 6) {
                  //       console.error(err);
                  //     }
                  //   });
                  // });

                  all_users.data = users;
                  d.resolve(all_users);
                }, function(err) {
                  //console.log(err);
                });

                $kinvey.DataStore.find('challenges').then(function(challenges) {
                    all_challenges.data = challenges;
                    d.resolve(all_challenges);
                }, function(err) {
                    //console.log(err);
                });

                var query = new $kinvey.Query();
                query.equalTo('userId', loggedUser._id);
                var promise = $kinvey.DataStore.find('blocked', query);
                promise.then(function(blocked) {
                    blocked_users.data = blocked;
                    d.resolve(blocked_users);
                }, function(err) {
                    //console.log(err);
                });

                var query2 = new $kinvey.Query();
                query2.equalTo('blockedId', loggedUser._id);
                var promise = $kinvey.DataStore.find('blocked', query2);
                promise.then(function(blocked) {
                    im_blocked.data = blocked;
                    d.resolve(im_blocked);
                }, function(err) {
                    //console.log(err);
                });

                _.each(blocked_users.data, function(blocked_users){
                    all_users.data = _.without(all_users.data, _.findWhere(all_users.data, {_id: blocked_users.blockedId}));
                });

                _.each(im_blocked.data, function(blocked_users){
                    all_users.data = _.without(all_users.data, _.findWhere(all_users.data, {_id: blocked_users.userId}));
                });

                return d.resolve(loggedUser);
              }, function(err) {
                return d.reject({
                  error: "noUser"
                });
              });

              return d.promise;
            }

            //console.log("in init");

            // if initialized, then return the activeUser
            if (initialized === false) {
              // Initialize Kinvey
              $kinvey.init(KinveyConfiguration).then(function() {
                  initialized = true;
                  //console.log("in init: initialized");
                  return getTheUser();
                })
                .then(function(_user) {
                  $kinvey.User.find().then(function(users) {
                    all_users.data = users;
                  }, function(err) {
                    //console.log(err);
                  });

                  $kinvey.DataStore.find('challenges').then(function(challenges) {
                      all_challenges.data = challenges;
                      d.resolve(all_challenges);
                  }, function(err) {
                      //console.log(err);
                  });

                  $state.go('app.feed');

                  return d.resolve(_user);
                }, function(err) {
                  //console.log("in init error: ", err);
                  return d.reject({
                    error: "noUser",
                    kinveyError: err
                  });
                });
              return d.promise;
            } else {
              return getTheUser();
            }



          } catch (EE) {
            //console.log(EE)
          }

        },
        /**
         *
         * @param _userParams
         */
        createUser: function(_userParams) {

          var promise = $kinvey.User.signup({
              username : _userParams.username,
              password : _userParams.password,
              name: _userParams.name,
              email: _userParams.email,
              avatar: "https://scontent.xx.fbcdn.net/hprofile-xfa1/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=1b2f428689c126f80a083e30205ef68b&oe=57AD5F2F"
          });
          return promise;

        },
        /**
         *
         * @param _parseInitUser
         * @returns {Promise}
         */
        currentUser: function(_parseInitUser) {

          // if there is no user passed in, see if there is already an
          // active user that can be utilized

        },
        /**
         *
         * @param provider
         * @param tokens
         * @returns {Promise}
         */
        fb_login: function(provider, tokens) {
          // return $kinvey.User.login(_user, _password);
          return $kinvey.User.loginWithProvider(provider, tokens);
        },
        /**
         *
         * @param _user
         * @param _password
         * @returns {Promise}
         */
        login: function(_user, _password) {
          return $kinvey.User.login(_user, _password);
        },
        /**
         *
         * @returns {Promise}
         */
        logout: function() {

            $kinvey.User.logout().then(function(){
              var loggedUser = null;
              $rootScope.$emit('loggedUser', {
                  data: loggedUser
                });
            }, function(err) {
              console.log("Error: logged out", err);
            });
        },
        active_user: function(_parseInitUser) {
          return $kinvey.getActiveUser();
        },

      }
    }
  ])

.service('ProfileService', function ($http, $q, $kinvey, $localStorage, $cordovaSQLite, all_users, KINVEY_AUTH, KINVEY_APP_URL){

  this.getUserData = function(userId){
    var dfd = $q.defer();

    // var query = "SELECT * FROM users WHERE _id = '"+userId+"'";
    // $cordovaSQLite.execute(db, query).then(function(res) {
    //     for (i = 0; i < res.rows.length; i++) {
    //         console.log("SELECTED:", res.rows.item(i));
    //     }
    // }, function (err) {
    //     console.error(err);
    // });

    var user = _.find(all_users.data, function(user){
      return user._id == userId
    });

    dfd.resolve(user);

    return dfd.promise;
  };

  this.getActiveChallenges = function(userId){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "accepted/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_accepted) {

      var baseURL = KINVEY_APP_URL + "challenges/";

      $http.get(baseURL,  {
        headers : {
          Authorization: KINVEY_AUTH
        }
      })
      .success(function(db_challenges) {
        var accepted = _.filter(db_accepted, function(accept){
          if (accept.userId == userId) {
            var challenge_data = _.filter(db_challenges, function(challenge){ return challenge.id == accept.challengeId });
            _.each(challenge_data, function(challenge) {
              // accept.challengeTitle = challenge.title;
              // accept.challengePicture = challenge.picture;
              // accept.challengeComments = challenge.comments;
              // accept.challengeLikes = challenge.likes;
              accept.challengeCelebId = challenge.celebId;
              accept.challenge = challenge;
              if (accept.challengeCelebId) {
                var promise = $kinvey.DataStore.find('celebrities');
                promise.then(function(models) {
                    accept.user = _.find(models, function(user){
                      return user._id == challenge.celebId;
                    });
                }, function(err) {
                    //console.log(err);
                });
              } else {
                accept.user = _.find(all_users.data, function(user){ return user._id == challenge.userId; });
              }
            });

            // var promise = $kinvey.DataStore.find('celebrities');
            // promise.then(function(models) {
            //     accept.celeb = _.filter(models, function(celeb){
            //        return celeb._id == accept.challengeCelebId
            //     });
            // }, function(err) {
            //     console.log(err);
            // });

            return accept;
          }

        });
        dfd.resolve(accepted);
      })
      .error(function(err) {
        //console.log(err);
      });

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getCompletedChallenges = function(userId){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "completed/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_completed) {

      var baseURL = KINVEY_APP_URL + "challenges/";

      $http.get(baseURL,  {
        headers : {
          Authorization: KINVEY_AUTH
        }
      })
      .success(function(db_challenges) {
        var completed = _.filter(db_completed, function(complete){
          if (complete.user_id == userId) {
            var challenge_data = _.filter(db_challenges, function(challenge){ return challenge.id == complete.challengeId });
            _.each(challenge_data, function(challenge) {
              complete.challengeCelebId = challenge.celebId;
              complete.challenge = challenge;
              if (complete.challengeCelebId) {
                var promise = $kinvey.DataStore.find('celebrities');
                promise.then(function(models) {
                    complete.user = _.find(models, function(user){
                      return user._id == challenge.celebId;
                    });
                }, function(err) {
                    //console.log(err);
                });
              } else {
                complete.user = _.find(all_users.data, function(user){ return user._id == challenge.userId; });
              }
            });

            return complete;
          }

        });
        dfd.resolve(completed);
      })
      .error(function(err) {
        //console.log(err);
      });

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getKickedChallenges = function(userId){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "kicked/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_kicked) {

      var baseURL = KINVEY_APP_URL + "challenges/";

      $http.get(baseURL,  {
        headers : {
          Authorization: KINVEY_AUTH
        }
      })
      .success(function(db_challenges) {
        var kicked = _.filter(db_kicked, function(kick){
          if (kick.to_user_id == userId) {
            var challenge_data = _.filter(db_challenges, function(challenge){ return challenge.id == kick.challengeId });
            _.each(challenge_data, function(challenge) {
              kick.challengeCelebId = challenge.celebId;
              kick.challenge = challenge;
              if (kick.challengeCelebId) {
                var promise = $kinvey.DataStore.find('celebrities');
                promise.then(function(models) {
                    kick.user = _.find(models, function(user){
                      return user._id == challenge.celebId;
                    });
                }, function(err) {
                    //console.log(err);
                });
              } else {
                kick.user = _.find(all_users.data, function(user){ return user._id == challenge.userId; });
              }
              kick.challenger = _.find(all_users.data, function(user){ return user._id == kick.from_user_id; });
            });

            return kick;
          }

        });
        dfd.resolve(kicked);
      })
      .error(function(err) {
        //console.log(err);
      });

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getUserFollowers = function(userId){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "following/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_following) {
      var followers_data = _.filter(db_following, function(follow){ return follow.followsId == userId });

      //remove possible duplicates
      var followers_userId = _.uniq(_.pluck(followers_data, 'userId'));

      // var promise = $kinvey.User.find();
      //   promise.then(function(users) {
      //     var followers = _.map(followers_userId, function(followerId){
      //       // console.log(ud);
      //       return {
      //         userId: followerId,
      //         userData: _.find(users, function(user){ return user._id == followerId }),
      //         follow_back: !_.isUndefined(_.find(db_following, function(user){ return (user.userId === userId && user.followsId === followerId) }))
      //       };
      //     });

      //     dfd.resolve(followers);
      //   }, function(err) {
      //     console.log(err)
      //   });

      var followers = _.map(followers_userId, function(followerId){
        return {
          userId: followerId,
          userData: _.find(all_users.data, function(user){ return user._id == followerId }),
          // follow_back: !_.isUndefined(_.find(db_following, function(user){ return (user.userId === userId && user.followsId === followerId) }))
        };
      });

      dfd.resolve(followers);

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getUserFollowing = function(userId){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "following/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_following) {
      var following_data = _.filter(db_following, function(follow){ return follow.userId == userId });
      //remove possible duplicates
      var following_userId = _.uniq(_.pluck(following_data, 'followsId'));

      var following = _.map(following_userId, function(followingId){
        return {
          userId: followingId,
          userData: _.find(all_users.data, function(user){ return user._id == followingId })
        }
      });
      dfd.resolve(following);

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getUserPosts = function(userId, page){
    var pageSize = 4;
    var skip = pageSize * (page-1);

    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + 'posts?query={"user_id":"'+userId+'"}&limit='+pageSize+'&skip='+skip+'&sort={"_kmd.ect": -1}';

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_posts) {

      var sortedPosts =  _.sortBy(db_posts, function(post){ return new Date(post._kmd.ect); }).reverse();
      var posts = _.filter(sortedPosts, function(post){

          var baseURL = KINVEY_APP_URL + "comments/";

          $http.get(baseURL,  {
            headers : {
              Authorization: KINVEY_AUTH
            }
          })
          .success(function(db_comments) {
            var comment_data = _.filter(db_comments, function(comment){ return comment.postId == post._id });
            post.commentCount = Object.keys(comment_data).length;
            //console.log('post.commentCount', post.commentCount);
          })
          .error(function(err) {
            //console.log(err);
          });

          var query = new $kinvey.Query();
          query.equalTo('postId', post._id);
          var promise = $kinvey.DataStore.find('postLikes', query);
          promise.then(function(likes) {
              post.likeCount = Object.keys(likes).length;
          }, function(err) {
              //console.log(err);
          });

          var loggedUser = $kinvey.getActiveUser();
          var myUserId = loggedUser._id;

          var query = new $kinvey.Query();
          query.equalTo('postId', post._id).and().equalTo('userId', myUserId);
          var promise = $kinvey.DataStore.find('postLikes', query);
          promise.then(function(row) {
            if (_.isEmpty(row)) {
              post.isLiked = false;
            } else {
              post.isLiked = true;
            }
          }, function(err) {
            //console.log(err);
          });

          var promise = $kinvey.DataStore.find('challenges');
          promise.then(function(models) {
              post.challenge = _.find(models, function(challenge){
                return challenge.id == post.challengeId;
              });
          }, function(err) {
              //console.log(err);
          });

          var query = new $kinvey.Query();
          query.equalTo('_id', post.user_id);
          var promise = $kinvey.User.find(query);
          promise.then(function(models) {
              post.user = _.find(models, function(user){
                if (user.private == true && user._id != userId) {
                  post.discard = true;
                }
                return user._id == post.user_id;
              });
          }, function(err) {
              //console.log(err);
          });
          return post;

      });
      dfd.resolve(posts);

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.isPostLiked = function(post) {
    var dfd = $q.defer();

    var query = new $kinvey.Query();
    query.equalTo('postId', post._id);
    var promise = $kinvey.DataStore.find('postLikes', query);
    promise.then(function(row) {
      if (_.isEmpty(row)) {
        var isLiked = false;
      } else {
        var isLiked = false;
        _.each(row, function(like) {
          if (like.userId == $localStorage.active_user._id) {
            isLiked = true;
          }
        })
      }
      dfd.resolve(isLiked);
    }, function(err) {
      //console.log(err);
    });


    return dfd.promise;
  };

  this.likePost = function(post, userId) {
    var promise = $kinvey.DataStore.save('postLikes', {
        userId: userId,
        postId: post._id
    });
    promise.then(function(model) {
      //console.log('liked');
    }, function(err) {
        //console.log(err);
    });
  };

  this.removeLikePost = function(post, userId) {
    var query = new $kinvey.Query();
    query.equalTo('postId', post._id).and().equalTo('userId', userId);
    var promise = $kinvey.DataStore.find('postLikes', query);
    promise.then(function(row) {
      //console.log(row);
      var likeId = row[0]._id;
        var promise = $kinvey.DataStore.destroy('postLikes', likeId);
        promise.then(function() {
            //console.log('unliked');
        }, function(err) {
            //console.log(err);
        });
    }, function(err) {
        //console.log(err);
    });
  };

  this.setPrivate = function() {
    var user = $kinvey.getActiveUser();
    if (user.private == true) {
      user.private = false;
    } else if (user.private == false) {
      user.private = true;
    }
    var promise = $kinvey.User.update(user);
    promise.then(function(user) {
        // console.log(user);
    }, function(err) {
      //console.log(err);
    });
  };

  this.getUserChallenges = function(userId){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "challenges/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_challenges) {
      //get user related challenges
      var user_challenge = _.filter(db_challenges, function(challenge){
        return challenge.userId == userId;
      });

      dfd.resolve(user_challenge);

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

})



.service('FeedService', function ($http, $q, $localStorage, $kinvey, sharedProperties, all_users, all_challenges, blocked_users, im_blocked, KINVEY_AUTH, KINVEY_APP_URL){

  this.getFeed = function(page, order){

     var pageSize = 6, // set your page size, which is number of records per page
         skip = pageSize * (page-1),
         // totalChallenges = 1,
         // totalPages = 1,
         dfd = $q.defer();

         if(order=="title" || order=="category.name"){
            var descending = 1;
          } else {
            var descending = -1;
          }


          if(order=="user.name"){
            var baseURL = KINVEY_APP_URL + 'challenges?query={}';
          } else {
            var baseURL = KINVEY_APP_URL + 'challenges?query={}&limit='+pageSize+'&skip='+skip+'&sort={"'+order+'": '+descending+'}';
          }

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_challenges) {
      // totalChallenges = db_challenges.length;
      // totalPages = totalChallenges/pageSize;
//db_challenges = db_challenges.reverse();
      if (Object.keys(db_challenges).length == 0) {
        totalPages = false; 
      } else {
        totalPages = true;
      }

      if(order=="user.name"){
        totalPages = false;
      }

      var sortedChallenges =  _.sortBy(db_challenges, order);//function(challenge){ return new Date(challenge.date); });

// if(order=="order" || order=="participants"  ){
//   sortedChallenges = sortedChallenges.reverse();
// }
      // var challengesToShow = sortedChallenges.slice(skip, skip + pageSize);

      //add user data to challenges
      var challenges = _.each(sortedChallenges.reverse(), function(challenge){

        var query = new $kinvey.Query();
        query.equalTo('_id', challenge.celebId);
        var promise = $kinvey.DataStore.find('celebrities', query);
        promise.then(function(models) {
            challenge.user = _.find(models, function(user){
              return user._id == challenge.celebId;
            });
        }, function(err) {
            //console.log(err);
        });

        return challenge;
      });
        if(order=="user.name"){
        challenges =  _.sortBy(challenges, order);
        }
      dfd.resolve({
        challenges: challenges,
        totalPagesChallenges: totalPages

      });
    })
    .error(function(err) {
      console.log(err);
    });

    return dfd.promise;
  };

  this.getAllPosts = function(page){

    var pageSize = 7, // set your page size, which is number of records per page
        skip = pageSize * (page-1),
        // totalPosts = 1,
        // totalPages = 1,
        dfd = $q.defer();


    // var time = new Date().getTime();
    // var days = 30;
    // time = time - (86400000 * days)
    // var date = new Date(time);
    // var dd = date.getDate();
    // var mm = date.getMonth()+1; //January is 0!
    // var yyyy = date.getFullYear();

    // if(dd<10) {
    //     dd='0'+dd
    // }

    // if(mm<10) {
    //     mm='0'+mm
    // }

    // date = yyyy+'-' + mm +'-' + dd

    var baseURL = KINVEY_APP_URL + 'posts?query={}&limit='+pageSize+'&skip='+skip+'&sort={"_kmd.ect": -1}';

    // var baseURL = KINVEY_APP_URL + 'posts?query={"_kmd.lmt":{"$gt":"'+date+'"}}';

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_posts) {
      // totalPosts = db_posts.length;
      // totalPages = totalPosts/pageSize;

      if (Object.keys(db_posts).length == 0) {
        totalPages = false;
      } else {
        totalPages = true;
      }

      var sortedPosts =  _.sortBy(db_posts, function(post){ return new Date(post._kmd.ect); }).reverse();

      var postsToShow = sortedPosts.slice(skip, skip + pageSize);

      //add user data to posts
      var posts = _.each(sortedPosts, function(post){
        var baseURL = KINVEY_APP_URL + "comments/";

        $http.get(baseURL,  {
          headers : {
            Authorization: KINVEY_AUTH
          }
        })
        .success(function(db_comments) {
          var comment_data = _.filter(db_comments, function(comment){ return comment.postId == post._id });
          _.each(blocked_users.data, function(blocked_users){
              comment_data = _.without(comment_data, _.findWhere(comment_data, {userId: blocked_users.blockedId}));
          });
          _.each(im_blocked.data, function(blocked_users){
              comment_data = _.without(comment_data, _.findWhere(comment_data, {userId: blocked_users.userId}));
          });
          post.commentCount = Object.keys(comment_data).length;
        })
        .error(function(err) {
          //console.log(err);
        });

        var query = new $kinvey.Query();
        query.equalTo('postId', post._id);
        var promise = $kinvey.DataStore.find('postLikes', query);
        promise.then(function(likes) {
            post.likeCount = Object.keys(likes).length;
        }, function(err) {
            //console.log(err);
        });

        var loggedUser = $kinvey.getActiveUser();
        var userId = loggedUser._id;

        var query = new $kinvey.Query();
        query.equalTo('postId', post._id).and().equalTo('userId', userId);
        var promise = $kinvey.DataStore.find('postLikes', query);
        promise.then(function(row) {
          if (_.isEmpty(row)) {
            post.isLiked = false;
          } else {
            post.isLiked = true;
          }
        }, function(err) {
          //console.log(err);
        });

        var promise = $kinvey.DataStore.find('challenges');
        promise.then(function(models) {
            post.challenge = _.find(models, function(challenge){
              return challenge.id == post.challengeId;
            });
        }, function(err) {
            //console.log(err);
        });


        var query = new $kinvey.Query();
        query.equalTo('_id', post.user_id);
        $kinvey.User.find(query).then(function(users) {
          post.user = _.find(users, function(user){
            if (user.private == true && user._id != userId) {
              post.discard = true;
            }
            return user._id == post.user_id;
          });
        }, function(err) {
          //console.log(err);
        });

        if (blocked_users.data != '') {
          _.each(blocked_users.data, function(blocked_users){
              all_users.data = _.without(all_users.data, _.findWhere(all_users.data, {_id: blocked_users.blockedId}));
              if (post.user_id == blocked_users.blockedId) {
                post.discard = true;
              }
          });
        }

        if (im_blocked.data != '') {
          _.each(im_blocked.data, function(blocked_users){
              all_users.data = _.without(all_users.data, _.findWhere(all_users.data, {_id: blocked_users.userId}));
              if (post.user_id == blocked_users.userId) {
                post.discard = true;
              }
          });
        }

        return post;

      });

      _.each(posts, function(post){
        posts = _.without(posts, _.findWhere(posts, {discard: true}));
      });

      //console.log('test posts', posts);

      dfd.resolve({
        posts: posts,
        totalPagesPosts: totalPages
      });
    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getActivity = function(page){
    var ActivityObject = {};
    // var pageSize = 5, // set your page size, which is number of records per page
    //     skip = pageSize * (page-1),
    //     totalActivity = 1,
    //     totalPages = 1,
        dfd = $q.defer();

    var time = new Date().getTime();
    var days = 7;
    time = time - (86400000 * days)
    var date = new Date(time);
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    date = yyyy+'-' + mm +'-' + dd

    var baseURL = KINVEY_APP_URL + 'posts?query={"_kmd.lmt":{"$gt":"'+date+'"}}';

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_posts) {
      // totalPosts = db_posts.length;
      // totalPages = totalPosts/pageSize;

      var sortedPosts =  _.sortBy(db_posts, function(post){ return new Date(post._kmd.lmt); });

      // var postsToShow = sortedPosts.slice(skip, skip + pageSize);
      var postsToShow = sortedPosts;

      //add user data to posts
      var posts = _.each(postsToShow.reverse(), function(post){
        var baseURL = KINVEY_APP_URL + "comments/";

        $http.get(baseURL,  {
          headers : {
            Authorization: KINVEY_AUTH
          }
        })
        .success(function(db_comments) {
          var comment_data = _.filter(db_comments, function(comment){ return comment.postId == post._id });
          post.commentCount = Object.keys(comment_data).length;
        })
        .error(function(err) {
          //console.log(err);
        });

        if (all_challenges.data) {
          post.challenge = _.find(all_challenges.data, function(challenge){
            return challenge.id == post.challengeId;
          });
        } else {
          var promise = $kinvey.DataStore.find('challenges').then(function(models) {
            post.challenge = _.find(models, function(challenge){
              return challenge.id == post.challengeId;
            });
          }, function(err) {
              //console.log(err);
          });
        }

        if (all_users.data) {
          post.user = _.find(all_users.data, function(user){
            return user._id == post.user_id;
          });
        } else {
          var query = new $kinvey.Query();
          query.equalTo('_id', post.user_id);
          $kinvey.User.find(query).then(function(users) {
            post.user = _.find(users, function(user){
              return user._id == post.user_id;
            });
          }, function(err) {
            //console.log(err);
          });
        }

        return post;
      });

      ActivityObject.posts = posts;

          var baseURL = KINVEY_APP_URL + 'completed?query={"_kmd.lmt":{"$gt":"'+date+'"}}';

          $http.get(baseURL,  {
            headers : {
              Authorization: KINVEY_AUTH
            }
          })
          .success(function(db_completed) {

            var baseURL = KINVEY_APP_URL + "challenges/";

            $http.get(baseURL,  {
              headers : {
                Authorization: KINVEY_AUTH
              }
            })
            .success(function(db_challenges) {
              var completed = _.filter(db_completed, function(complete){
                if (all_users.data) {
                  complete.user = _.find(all_users.data, function(user){
                    return user._id == complete.user_id;
                  });
                } else {
                  var query = new $kinvey.Query();
                  query.equalTo('_id', complete.user_id);
                  $kinvey.User.find().then(function(users) {
                    complete.user = _.find(users, function(user){
                      return user._id == complete.user_id;
                    });
                  }, function(err) {
                    //console.log(err);
                  });
                }
                //console.log("completed service: ", complete )
                  var challenge_data = _.filter(db_challenges, function(challenge){ return challenge.id == complete.challengeId });
                  _.each(challenge_data, function(challenge) {
                    complete.challengeCelebId = challenge.celebId;
                    complete.challenge = challenge;
                    // if (complete.challengeCelebId) {
                    //   var promise = $kinvey.DataStore.find('celebrities');
                    //   promise.then(function(models) {
                    //       complete.user = _.find(models, function(user){
                    //         return user._id == challenge.celebId;
                    //       });
                    //   }, function(err) {
                    //       console.log(err);
                    //   });
                    // } else {
                    //   complete.user = _.find(all_users.data, function(user){ return user._id == challenge.userId; });
                    // }
                  });

                  return complete;

              });

              ActivityObject.completed = completed;
              //console.log('ActivityObject completed', ActivityObject);

            })
            .error(function(err) {
              //console.log(err);
            });

                var baseURL = KINVEY_APP_URL + 'accepted?query={"_kmd.lmt":{"$gt":"'+date+'"}}';

                $http.get(baseURL,  {
                  headers : {
                    Authorization: KINVEY_AUTH
                  }
                })
                .success(function(db_accepted) {

                  var baseURL = KINVEY_APP_URL + "challenges/";

                  $http.get(baseURL,  {
                    headers : {
                      Authorization: KINVEY_AUTH
                    }
                  })
                  .success(function(db_challenges) {
                    var accepted = _.filter(db_accepted, function(accept){
                      if (all_users.data) {
                        accept.user = _.find(all_users.data, function(user){
                          //console.log("accept.user_id: "+accept.user_id);
                          return user._id == accept.user_id;
                        });
                      } else {
                        var query = new $kinvey.Query();
                        query.equalTo('_id', accept.user_id);
                        $kinvey.User.find().then(function(users) {
                          accept.user = _.find(users, function(user){
                            return user._id == accept.user_id;
                          });
                        }, function(err) {
                          //console.log(err);
                        });
                      }
                        var challenge_data = _.filter(db_challenges, function(challenge){ return challenge.id == accept.challengeId });
                        _.each(challenge_data, function(challenge) {
                          accept.challengeCelebId = challenge.celebId;
                          accept.challenge = challenge;
                          accept.user = _.find(all_users.data, function(user){ return user._id == accept.userId; });
                        });

                        return accept;

                    });

                    ActivityObject.accepted = accepted;
                    //console.log('ActivityObject accepted', ActivityObject);
                    setTimeout(function () {
                      dfd.resolve(ActivityObject);
                    }, 800);
                  })
                  .error(function(err) {
                    //console.log(err);
                  });

                })
                .error(function(err) {
                  //console.log(err);
                });

          })
          .error(function(err) {
            //console.log(err);
          });


      // console.log('ActivityObject final', ActivityObject);
      // dfd.resolve(ActivityObject);
    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getFeedByCategory = function(page, categoryId){

    var pageSize = 5, // set your page size, which is number of records per page
        skip = pageSize * (page-1),
        totalChallenges = 1,
        totalPages = 1,
        dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "challenges/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_challenges) {

      totalChallenges = db_challenges.length;
      totalPages = totalChallenges/pageSize;

      var sortedChallenges =  _.sortBy(db_challenges, function(challenge){ return new Date(challenge.date); });

      if(categoryId){
        sortedChallenges = _.filter(sortedChallenges, function(challenge){ return challenge.category.id == categoryId; });
      }

      var challengesToShow = sortedChallenges.slice(skip, skip + pageSize);

      //add user data to challenges
      var challenges = _.each(challengesToShow.reverse(), function(challenge){
          var query = new $kinvey.Query();
          query.equalTo('_id', challenge.celebId);
          var promise = $kinvey.DataStore.find('celebrities', query);
          promise.then(function(models) {
              challenge.user = _.find(models, function(user){
                return user._id == challenge.celebId;
              });
          }, function(err) {
              //console.log(err);
          });
        // challenge.user = _.find(all_users.data, function(user){ return user._id == challenge.userId; });
        return challenge;
      });

      dfd.resolve({
        challenges: challenges,
        totalPages: totalPages
      });
    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getFeedByTrend = function(page, trendId){

    var pageSize = 5, // set your page size, which is number of records per page
        skip = pageSize * (page-1),
        totalChallenges = 1,
        totalPages = 1,
        dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "challenges/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_challenges) {

      totalChallenges = db_challenges.length;
      totalPages = totalChallenges/pageSize;

      var sortedChallenges =  _.sortBy(db_challenges, function(challenge){ return new Date(challenge.date); });

      if(trendId){
        sortedChallenges = _.filter(sortedChallenges, function(challenge){ return challenge.trend.id == trendId; });
      }

      var challengesToShow = sortedChallenges.slice(skip, skip + pageSize);

      //add user data to challenges
      var challenges = _.each(challengesToShow.reverse(), function(challenge){

        var query = new $kinvey.Query();
        query.equalTo('_id', challenge.celebId);
        var promise = $kinvey.DataStore.find('celebrities', query);
        promise.then(function(models) {
            challenge.user = _.find(models, function(user){
              return user._id == challenge.celebId;
            });
        }, function(err) {
            //console.log(err);
        });

        // challenge.user = _.find(all_users.data, function(user){ return user._id == challenge.userId; });
        return challenge;
      });

      dfd.resolve({
        challenges: challenges,
        totalPages: totalPages
      });
    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  // this.getChallengeComments = function(challenge){
  //   var dfd = $q.defer();

  //   var baseURL = KINVEY_APP_URL + "comments/";

  //   $http.get(baseURL,  {
  //     headers : {
  //       Authorization: KINVEY_AUTH
  //     }
  //   })
  //   .success(function(db_comments) {
  //     var comment_data = _.filter(db_comments, function(comment){ return comment.challengeId == challenge.id });

  //     //remove possible duplicates
  //     var comments_userId = _.uniq(_.pluck(comment_data, 'userId'));

  //     var comments = _.map(comment_data, function(comment){
  //       var me;
  //       if (comment.userId == $localStorage.active_user._id) {
  //         me = true
  //       } else {
  //         me = false
  //       };

  //       return {
  //         id: comment._id,
  //         user: _.find(all_users.data, function(user){ return user._id == comment.userId }),
  //         text: comment.comment,
  //         date: comment.date,
  //         me: me
  //       };
  //     });

  //     var sorted =_.sortBy(comments, 'date');
  //     dfd.resolve(sorted);

  //   })
  //   .error(function(err) {
  //     console.log(err);
  //   });

  //   return dfd.promise;
  // };

  this.isLiked = function(challengeId) {
    var dfd = $q.defer();

    var query = new $kinvey.Query();
    query.equalTo('challengeId', parseInt(challengeId));
    var promise = $kinvey.DataStore.find('likes', query);
    promise.then(function(row) {
      if (_.isEmpty(row)) {
        var isLiked = false;
      } else {
        var isLiked = false;
        _.each(row, function(like) {
          if (like.userId == $localStorage.active_user._id) {
            isLiked = true;
          }
        })
      }
      dfd.resolve(isLiked);
    }, function(err) {
      //console.log(err);
    });


    return dfd.promise;
  };

  this.likeChallenge = function(challenge, userId) {
    var promise = $kinvey.DataStore.save('likes', {
        userId: userId,
        challengeId: challenge.id
    });
    promise.then(function(model) {
      //console.log('liked');
    }, function(err) {
        //console.log(err);
    });
  };

  this.removeLikeChallenge = function(challenge, userId) {
    var query = new $kinvey.Query();
    query.equalTo('challengeId', challenge.id).and().equalTo('userId', userId);
    var promise = $kinvey.DataStore.find('likes', query);
    promise.then(function(row) {
      //console.log(row);
      var likeId = row[0]._id;
        var promise = $kinvey.DataStore.destroy('likes', likeId);
        promise.then(function() {
            //console.log('unliked');
        }, function(err) {
            //console.log(err);
        });
    }, function(err) {
        //console.log(err);
    });
  };

  this.isKicked = function(challengeId) {
    var dfd = $q.defer();

    var query = new $kinvey.Query();
    query.equalTo('challengeId', parseInt(challengeId));
    var promise = $kinvey.DataStore.find('kicked', query);
    promise.then(function(row) {
      if (_.isEmpty(row)) {
        var isKicked = false;
      } else {
        var isKicked = false;
        _.each(row, function(kick) {
          //console.log("kick.to_user_id: " + kick.to_user_id)
          //console.log("$localStorage.active_user._id: " + $localStorage.active_user._id)
          if (kick.to_user_id == $localStorage.active_user._id) {
            isKicked = true;
          }
        })
      }
      dfd.resolve(isKicked);
    }, function(err) {
      //console.log(err);
    });


    return dfd.promise;
  };

  this.removeKickedChallenge = function(challenge, userId) {
    var dfd = $q.defer();

    var query = new $kinvey.Query();
    query.equalTo('challengeId', challenge.id).and().equalTo('to_user_id', userId);
    var promise = $kinvey.DataStore.find('kicked', query);
    promise.then(function(row) {
      console.log("row: ",row);
      if (typeof row[0] != 'undefined') {
      if (typeof row[0]._id != 'undefined') {
        var kickId = row[0]._id;
        var promise = $kinvey.DataStore.destroy('kicked', kickId);
        promise.then(function() {
          dfd.resolve(kickId);
            //console.log('remove kicked');
        }, function(err) {
            //console.log(err);
            dfd.resolve(kickId);
        });
      }
    // I don't get a badge decrement on challenge completion unless these lines are in.
    // }else{
    //   console.log('resolved outside');
    //   dfd.resolve(row);

    }
    }, function(err) {
        //console.log(err);
    });
    return dfd.promise;
  };

  this.isAccepted = function(challengeId) {
    var dfd = $q.defer();

    var query = new $kinvey.Query();
    query.equalTo('challengeId', parseInt(challengeId));
    var promise = $kinvey.DataStore.find('accepted', query);
    promise.then(function(row) {
      if (_.isEmpty(row)) {
        var isAccepted = false;
      } else {
        var isAccepted = false;
        _.each(row, function(accept) {
          if (accept.userId == $localStorage.active_user._id) {
            isAccepted = true;
          }
        })
      }
      dfd.resolve(isAccepted);
    }, function(err) {
      //console.log(err);
    });


    return dfd.promise;
  };

  this.isFeedAccepted = function( card) {
   var dfd = $q.defer();
var callbackHolder = "success";
    var query = new $kinvey.Query();
    query.equalTo('challengeId', parseInt(card.id));
    var promise = $kinvey.DataStore.find('accepted', query);

    promise.then(function(row) {

        _.each(row, function(accept) {
          if (accept.userId == $localStorage.active_user._id) {
            card.accepted = true;
            card.completed = false;
          }
        })

      dfd.resolve(callbackHolder);
    }, function(err) {
      //console.log(err);
    });
    return dfd.promise;
  };

  this.isFeedCompleted = function( card) {
    var dfd = $q.defer();
    var callbackHolder = "success";
    var query = new $kinvey.Query();
    query.equalTo('challengeId', parseInt(card.id));
    var promise = $kinvey.DataStore.find('completed', query);
    promise.then(function(row) {

        _.each(row, function(complete) {
          if (complete.user_id == $localStorage.active_user._id) {
            card.completed = true;
            card.accepted = false;
          }
        })

     dfd.resolve(callbackHolder);
    }, function(err) {
      //console.log(err);
    });
    return dfd.promise;
  };

  this.acceptChallenge = function(challenge, userId) {
    var promise = $kinvey.DataStore.save('accepted', {
        userId: userId,
        challengeId: challenge.id
    });
    promise.then(function(model) {
      //console.log('accepted');
    }, function(err) {
        //console.log(err);
    });
  };

  this.removeAcceptChallenge = function(challenge, userId) {
    var query = new $kinvey.Query();
    query.equalTo('challengeId', challenge.id).and().equalTo('userId', userId);
    var promise = $kinvey.DataStore.find('accepted', query);
    promise.then(function(row) {
      //console.log(row);
      if (row[0]) {
        var acceptId = row[0]._id;
        var promise = $kinvey.DataStore.destroy('accepted', acceptId);
        promise.then(function() {
            //console.log('remove accepted');
        }, function(err) {
            //console.log(err);
        });
      }
    }, function(err) {
        //console.log(err);
    });
  };

  this.isCompleted = function(challengeId) {
    var dfd = $q.defer();

    var query = new $kinvey.Query();
    query.equalTo('challengeId', parseInt(challengeId));
    var promise = $kinvey.DataStore.find('completed', query);
    promise.then(function(row) {
      if (_.isEmpty(row)) {
        var isCompleted = false;
      } else {
        var isCompleted = false;
        _.each(row, function(comp) {
          if (comp.user_id == $localStorage.active_user._id) {
            isCompleted = true;
          }
        })
      }
      dfd.resolve(isCompleted);
    }, function(err) {
      //console.log(err);
    });


    return dfd.promise;
  };

  this.getAllCompleted = function() {
    var dfd = $q.defer();
var allCompleted = [];
    var query = new $kinvey.Query();
    //query.equalTo('challengeId', parseInt(challengeId));
    var promise = $kinvey.DataStore.find('completed');
    promise.then(function(row) {

        _.each(row, function(comp) {
          if (comp.user_id == $localStorage.active_user._id) {
            //console.log("adding ",row)
            allCompleted.push(comp.challengeId)
          }
        })

      dfd.resolve(allCompleted);
    }, function(err) {
      //console.log(err);
    });


    return dfd.promise;
  };

  this.getAllAccepted= function() {
    var dfd = $q.defer();
var allAccepted = [];
    var query = new $kinvey.Query();
    //query.equalTo('challengeId', parseInt(challengeId));
    var promise = $kinvey.DataStore.find('accepted');
    promise.then(function(row) {

        _.each(row, function(comp) {
          if (comp.user_id == $localStorage.active_user._id) {
            //console.log("adding ",row)
            allAccepted.push(comp.challengeId)
          }
        })

      dfd.resolve(allAccepted);
    }, function(err) {
      console.log(err);
    });


    return dfd.promise;
  };

  this.getFeaturedChallenge = function(){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + 'featured?query={"type":"challenge"}';

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(featured) {

      $kinvey.DataStore.get('challenges', featured[0].typeId).then(function(model) {
        var challenge = model;
        $kinvey.DataStore.get('celebrities', challenge.celebId).then(function(celeb) {
            challenge.user = celeb;
        }, function(err) {
            console.log(err);
        });

        dfd.resolve(challenge);

      }, function(err) {
          console.log(err);
      });

    })
    .error(function(err) {
      console.log(err);
    });

    return dfd.promise;
  };

  this.getFeaturedPost = function(){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + 'featured?query={"type":"post"}';

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(featured) {

      $kinvey.DataStore.get('posts', featured[0].typeId).then(function(model) {
        var post = model;

        var baseURL = KINVEY_APP_URL + "comments/";

        $http.get(baseURL,  {
          headers : {
            Authorization: KINVEY_AUTH
          }
        })
        .success(function(db_comments) {
          var comment_data = _.filter(db_comments, function(comment){ return comment.postId == post._id });
          _.each(blocked_users.data, function(blocked_users){
              comment_data = _.without(comment_data, _.findWhere(comment_data, {userId: blocked_users.blockedId}));
          });
          _.each(im_blocked.data, function(blocked_users){
              comment_data = _.without(comment_data, _.findWhere(comment_data, {userId: blocked_users.userId}));
          });
          post.commentCount = Object.keys(comment_data).length;
        })
        .error(function(err) {
          console.log(err);
        });

        var query = new $kinvey.Query();
        query.equalTo('postId', post._id);
        var promise = $kinvey.DataStore.find('postLikes', query);
        promise.then(function(likes) {
            post.likeCount = Object.keys(likes).length;
        }, function(err) {
            //console.log(err);
        });

        var loggedUser = $kinvey.getActiveUser();
        var userId = loggedUser._id;

        var query = new $kinvey.Query();
        query.equalTo('postId', post._id).and().equalTo('userId', userId);
        var promise = $kinvey.DataStore.find('postLikes', query);
        promise.then(function(row) {
          if (_.isEmpty(row)) {
            post.isLiked = false;
          } else {
            post.isLiked = true;
          }
        }, function(err) {
          //console.log(err);
        });

        var promise = $kinvey.DataStore.find('challenges');
        promise.then(function(models) {
            post.challenge = _.find(models, function(challenge){
              return challenge.id == post.challengeId;
            });
        }, function(err) {
            console.log(err);
        });

        // if (all_users.data) {
          // post.user = _.find(all_users.data, function(user){
            // return user._id == post.user_id;
          // });
        // } else {
          var query = new $kinvey.Query();
          query.equalTo('_id', post.user_id);
          $kinvey.User.find().then(function(users) {
            post.user = _.find(users, function(user){
              return user._id == post.user_id;
            });
          }, function(err) {
            console.log(err);
          });
        // }

        dfd.resolve(post);

      }, function(err) {
          console.log(err);
      });

    })
    .error(function(err) {
      console.log(err);
    });

    return dfd.promise;
  };

  this.getChallenge = function(challengeId){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "challenges/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_challenges) {
      var challenge = _.find(db_challenges, function(challenge){
        return challenge.id == challengeId;
      });

      var baseURL = KINVEY_APP_URL + "comments/";

      $http.get(baseURL,  {
        headers : {
          Authorization: KINVEY_AUTH
        }
      })
      .success(function(db_comments) {
        var comment_data = _.filter(db_comments, function(comment){ return comment.challengeId == challengeId });
        challenge.count = Object.keys(comment_data).length;
      })
      .error(function(err) {
        //console.log(err);
      });

      var query = new $kinvey.Query();
      query.equalTo('_id', challenge.celebId);
      var promise = $kinvey.DataStore.find('celebrities', query);
      promise.then(function(models) {
          challenge.user = _.find(models, function(user){
            return user._id == challenge.celebId;
          });
      }, function(err) {
          //console.log(err);
      });

      dfd.resolve(challenge);
    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };


  this.getChallengePosts = function(challengeId, page){

    var pageSize = 4;
    var skip = pageSize * (page-1);

    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + 'posts?query={"challengeId":'+challengeId+'}&limit='+pageSize+'&skip='+skip+'&sort={"_kmd.ect": -1}';

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_posts) {

      var sortedPosts =  _.sortBy(db_posts, function(post){ return new Date(post._kmd.ect); }).reverse();
      var posts = _.filter(sortedPosts, function(post){

          var baseURL = KINVEY_APP_URL + "comments/";

          $http.get(baseURL,  {
            headers : {
              Authorization: KINVEY_AUTH
            }
          })
          .success(function(db_comments) {
            var comment_data = _.filter(db_comments, function(comment){ return comment.postId == post._id });
            post.commentCount = Object.keys(comment_data).length;
            //console.log('post.commentCount', post.commentCount);
          })
          .error(function(err) {
            //console.log(err);
          });

          var query = new $kinvey.Query();
          query.equalTo('postId', post._id);
          var promise = $kinvey.DataStore.find('postLikes', query);
          promise.then(function(likes) {
              post.likeCount = Object.keys(likes).length;
          }, function(err) {
              //console.log(err);
          });

          var loggedUser = $kinvey.getActiveUser();
          var userId = loggedUser._id;

          var query = new $kinvey.Query();
          query.equalTo('postId', post._id).and().equalTo('userId', userId);
          var promise = $kinvey.DataStore.find('postLikes', query);
          promise.then(function(row) {
            if (_.isEmpty(row)) {
              post.isLiked = false;
            } else {
              post.isLiked = true;
            }
          }, function(err) {
            //console.log(err);
          });

          var promise = $kinvey.DataStore.find('challenges');
          promise.then(function(models) {
              post.challenge = _.find(models, function(challenge){
                return challenge.id == post.challengeId;
              });
          }, function(err) {
              //console.log(err);
          });

          var query = new $kinvey.Query();
          query.equalTo('_id', post.user_id);
          var promise = $kinvey.User.find(query);
          promise.then(function(models) {
              post.user = _.find(models, function(user){
                if (user.private == true && user._id != userId) {
                  post.discard = true;
                }
                return user._id == post.user_id;
              });
          }, function(err) {
              //console.log(err);
          });
          return post;

      });

      dfd.resolve(posts);

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getPostLikes = function(post){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "postLikes/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_post_likes) {
      var like_data = _.filter(db_post_likes, function(like){ return like.postId == post._id });

      // _.each(blocked_users.data, function(blocked_users){
      //     all_users.data = _.without(all_users.data, _.findWhere(all_users.data, {_id: blocked_users.blockedId}));
      //     comment_data = _.without(comment_data, _.findWhere(comment_data, {userId: blocked_users.blockedId}));
      // });

      // _.each(im_blocked.data, function(blocked_users){
      //     all_users.data = _.without(all_users.data, _.findWhere(all_users.data, {_id: blocked_users.userId}));
      //     comment_data = _.without(comment_data, _.findWhere(comment_data, {userId: blocked_users.userId}));
      // });

      //remove possible duplicates
      var likes_userId = _.uniq(_.pluck(like_data, 'userId'));

      var likes = _.map(like_data, function(like){
        var me;
        if (like.userId == $localStorage.active_user._id) {
          me = true
        } else {
          me = false
        };

        return {
          id: like._id,
          user: _.find(all_users.data, function(user){ return user._id == like.userId }),
          me: me
        };
      });

      dfd.resolve(likes);

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getPostComments = function(post){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "comments/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_comments) {
      var comment_data = _.filter(db_comments, function(comment){ return comment.postId == post._id });

      _.each(blocked_users.data, function(blocked_users){
          all_users.data = _.without(all_users.data, _.findWhere(all_users.data, {_id: blocked_users.blockedId}));
          comment_data = _.without(comment_data, _.findWhere(comment_data, {userId: blocked_users.blockedId}));
      });

      _.each(im_blocked.data, function(blocked_users){
          all_users.data = _.without(all_users.data, _.findWhere(all_users.data, {_id: blocked_users.userId}));
          comment_data = _.without(comment_data, _.findWhere(comment_data, {userId: blocked_users.userId}));
      });

      //remove possible duplicates
      var comments_userId = _.uniq(_.pluck(comment_data, 'userId'));

      var comments = _.map(comment_data, function(comment){
        var me;
        if (comment.userId == $localStorage.active_user._id) {
          me = true
        } else {
          me = false
        };

        return {
          id: comment._id,
          user: _.find(all_users.data, function(user){ return user._id == comment.userId }),
          text: comment.comment,
          date: comment.date,
          me: me
        };
      });

      var sorted =_.sortBy(comments, 'date');
      dfd.resolve(sorted);

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.removeComment = function(commentId){
    var promise = $kinvey.DataStore.destroy('comments', commentId);
    promise.then(function() {
    }, function(err) {
        //console.log(err);
    });
  };

  this.report = function(postId, userId, time){

      var dfd = $q.defer();

      var promise = $kinvey.DataStore.save('reported', {
          userId  : userId,
          postId  : postId,
          time    : time
      });
      promise.then(function(model) {
        dfd.resolve(model);
      }, function(err) {
        //console.log(err);
      });

      return dfd.promise;
  };

  this.reportComment = function(commentId, userId, time){

      var dfd = $q.defer();

      var promise = $kinvey.DataStore.save('reported', {
          userId  : userId,
          commentId  : commentId,
          time    : time
      });
      promise.then(function(model) {
        dfd.resolve(model);
      }, function(err) {
        //console.log(err);
      });

      return dfd.promise;
  };
this.getKarma = function(){
  var dfd = $q.defer();

  $kinvey.User.me().then(function(user) {
    var new_karma = user.karma;
//console.log("new_karma: "+new_karma)
dfd.resolve(user.karma);
}, function(err) {
    //console.log(err);
});
return dfd.promise;
}
this.getDonate= function(){
  var dfd = $q.defer();

  $kinvey.User.me().then(function(user) {
    var new_donate = user.donate;
//console.log("new_donate: "+new_donate)
dfd.resolve(user.donate);
}, function(err) {
    //console.log(err);
});
return dfd.promise;
}
  this.addKarma = function(points){

      var dfd = $q.defer();

      $kinvey.User.me().then(function(user) {
        var new_karma = points + user.karma;
        var new_donate = points + user.donate;

        sharedProperties.setKarma(new_karma);
        sharedProperties.setDonate(new_donate);

        user.karma = new_karma;
        user.donate = new_donate;

        $kinvey.User.update(user).then(function(user) {
          //console.log('new karma', user.karma);
          dfd.resolve(user);
        }, function(err) {
            //console.log(err);
        });

      }, function(err) {
        //console.log(err);
      });

      return dfd.promise;
  };

  this.removeKarma = function(points){

      var dfd = $q.defer();

      $kinvey.User.me().then(function(user) {
        var new_karma = user.karma - points;
        var new_donate = user.donate - points;
        user.karma = new_karma;
        user.donate = new_donate;

        sharedProperties.setKarma(new_karma);
        sharedProperties.setDonate(new_donate);

        $kinvey.User.update(user).then(function(user) {
          //console.log('new karma', user.karma);
          dfd.resolve(user);
        }, function(err) {
            //console.log(err);
        });

      }, function(err) {
        //console.log(err);
      });

      return dfd.promise;
  };

})

.service('PeopleService', function ($http, $q, $localStorage, $kinvey, all_users, blocked_users, im_blocked, KINVEY_AUTH, KINVEY_APP_URL){

  this.getPeopleSuggestions = function(){

    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "peopleSuggestions/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_suggestions) {
      var people_suggestions = _.each(db_suggestions, function(suggestion){
        suggestion.user = _.find(all_users.data, function(user){ return user._id == suggestion.userId; });
        return suggestion;
      });

      dfd.resolve(people_suggestions);

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getPeopleYouMayKnow = function(){

    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "peopleMayKnow/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_may_know) {
      var people_you_may_know = _.each(db_may_know, function(person){
        person.user = _.find(all_users.data, function(user){ return user._id == person.userId; });
        return person;
      });

      dfd.resolve(people_you_may_know);

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getFBInvites = function(){

    var dfd = $q.defer();

    var user = $kinvey.getActiveUser();

    if (typeof user._socialIdentity != 'undefined') {

      var fb_id = user._socialIdentity.facebook.id;
      var access_token = $localStorage.access_token;

      $http.get("https://graph.facebook.com/v2.5/"+fb_id+"/invitable_friends", { params: { access_token: access_token, pretty: '0', limit: '7', format: "json" }}).success(function(response) {
          var fb_friends = _.each(response.data, function(fb_data){
            _.each(fb_data, function(fb_person){
              return fb_person;
            });
          });

          dfd.resolve({
            friends: fb_friends,
            paging: response.paging
          });

          // console.log(response);

          // dfd.resolve(fb_friends);
      });
    } else {
      var fb_friends = {};
      dfd.resolve(fb_friends);
    }

    return dfd.promise;
  };

  this.updateFBFriends = function(usr){

    if (typeof usr._socialIdentity != 'undefined') {

      var fb_id = usr._socialIdentity.facebook.id;
      var access_token = $localStorage.access_token;

      $http.get("https://graph.facebook.com/v2.5/me", { params: { access_token: access_token, fields: 'friends{id,name,picture,email}', format: "json" }}).success(function(response) {
          var fb_friends = _.each(response.friends.data, function(fb_data){
            _.each(fb_data, function(fb_person){
              return fb_person;
            });
          });

          var friends = _.each(fb_friends, function(f_friends){
            var query = new $kinvey.Query();
            query.equalTo('_socialIdentity.facebook.id', f_friends.id);
            var promise = $kinvey.User.find(query);
            promise.then(function(response) {

                _.each(response, function(user){

                  var active_id = $localStorage.active_user._id;

                  var query2 = new $kinvey.Query();
                  query2.equalTo('userId', active_id).and().equalTo('followsId', f_friends.uid);

                  var promise2 = $kinvey.DataStore.find('following', query2);
                  promise2.then(function(row) {
                    if (!row[0]) {
                      var promise3 = $kinvey.DataStore.save('following', {
                          userId: active_id,
                          followsId: user._id,
                          fb_friend: true
                      });

                      promise3.then(function(model) {
                        console.log('fb following model 1', model);
                      }, function(err) {
                          //console.log(err);
                      });
                    } 
                  }, function(err) {
                      //console.log(err);
                  });

                  var query3 = new $kinvey.Query();
                  query3.equalTo('followsId', active_id).and().equalTo('userId', f_friends.uid);

                  var promise4 = $kinvey.DataStore.find('following', query3);
                  promise4.then(function(row) {
                    if (!row[0]) {
                      var promise5 = $kinvey.DataStore.save('following', {
                          userId: user._id,
                          followsId: active_id,
                          fb_friend: true
                      });
                      promise5.then(function(model) {
                        console.log('fb following model 2', model);
                      }, function(err) {
                          //console.log(err);
                      });
                    }
                  }, function(err) {
                      //console.log(err);
                  });
                });

            }, function(err) {
                //console.log(err);
            });
          });

      }).error(function(err) {
        //console.log(err);
      });
    }
  };

  // this.getFBFriends = function(userId){

  //   var dfd = $q.defer();

  //   var user = $kinvey.getActiveUser();

  //   if (typeof user._socialIdentity != 'undefined') {
  //     console.log('got here');
  //     var fb_id = user._socialIdentity.facebook.id;
  //     var access_token = $localStorage.access_token;

  //     $http.get("https://graph.facebook.com/v2.5/me", { params: { access_token: access_token, fields: 'friends{id,name,picture,email}', format: "json" }}).success(function(response) {
  //         var fb_friends = _.each(response.friends.data, function(fb_data){
  //           _.each(fb_data, function(fb_person){
  //             return fb_person;
  //           });
  //         });

  //         var friends = _.each(fb_friends, function(f_friends){
  //           var query = new $kinvey.Query();
  //           query.equalTo('_socialIdentity.facebook.id', f_friends.id);
  //           var promise = $kinvey.User.find(query, { discover: true });
  //           promise.then(function(response) {
  //               _.each(response, function(user){
  //                 f_friends.uid = user._id;
  //               });
  //           }, function(err) {
  //               console.log(err);
  //           });
  //         });

  //         dfd.resolve(friends);

  //     }).error(function(err) {
  //       console.log(err);
  //     });
  //   } else {
  //     dfd.resolve(user);
  //   }

  //   return dfd.promise;
  // };
  this.isAlreadyKicked = function(challengeId, theirs, mine, challenge) {
    var dfd = $q.defer();

    var query = new $kinvey.Query();
    query.equalTo('challengeId', parseInt(challengeId));
    var promise = $kinvey.DataStore.find('kicked', query);
    var ret = {};
    promise.then(function(row) {
      if (_.isEmpty(row)) {
        ret.isKicked = false;
        ret.challenge = challenge;
        ret.challengeId = challengeId;
      } else {
        ret.isKicked = false;
        _.each(row, function(kick) {
          //console.log(kick)
          // console.log("kick.to_user_id: " + kick.to_user_id + " == " + theirs)
          // console.log("$localStorage.active_user._id: " + $localStorage.active_user._id + " == " + mine)
          // console.log("kick.challengeId: " + kick.challengeId + " == " + challengeId)
          if ((kick.to_user_id == theirs) && ($localStorage.active_user._id == mine)) {
            ret.challengeId = challengeId;
            ret.isKicked = true;
            ret.challenge = challenge;
          }
        })
      }
      dfd.resolve(ret);
    }, function(err) {
      //console.log(err);
    });


    return dfd.promise;
  };

  this.getFollowing = function(userId){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "following/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_following) {
      var following_data = _.filter(db_following, function(follow){ return follow.userId == userId });
      //remove possible duplicates
      var following_userId = _.uniq(_.pluck(following_data, 'followsId'));

      var following = _.map(following_userId, function(followingId){
        return {
          userId: followingId,
          userData: _.find(all_users.data, function(user){ return user._id == followingId })
        }
      });

      dfd.resolve(following);

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

//   this.getKickableFollowers = function(userId, challengeId){
//     var dfd = $q.defer();
//
//     var baseURL = KINVEY_APP_URL + "completed/";
//
//     $http.get(baseURL,  {
//       headers : {
//         Authorization: KINVEY_AUTH
//       }
//     })
//     .success(function(db_completed) {
//
//       //var skip = [];
//         var completedAndElligible = _.filter(db_completed, function(complete){
//           return complete.challengeId  != challengeId
//           //  if (complete.challengeId == challengeId) {
//           //      skip.push(complete);
//           //      //console.log(typeof complete.challengeId);
//           // }
//         });
//
//       var baseURL = KINVEY_APP_URL + "following/";
//
//       $http.get(baseURL,  {
//         headers : {
//           Authorization: KINVEY_AUTH
//         }
//       })
//       .success(function(db_following) {
//         var completed = _.filter(completedAndElligible, function(complete){
//           console.log("completed", completedAndElligible)
//           console.log("complete.challenge_id: ", complete.challengeId)
//           console.log("challengeId: ", challengeId)
//           //if (complete.challengeId != challengeId ) {
//           //  console.log("match found")
//             var challenge_data = _.filter(db_following, function(follower){ return follower.userId == userId });
//           //  _.each(challenge_data, function(challenge) {
//               console.log("challenge_data: ", challenge_data)
//               //challenge_data.eligibleFollower = challenge.userId;
//               //console.log("complete.eligibleFollower : " + complete.eligibleFollower)
//                 //complete.challenge = challenge;
//
//                 // var promise = $kinvey.DataStore.find('celebrities');
//                 // promise.then(function(models) {
//                 //     complete.user = _.find(models, function(user){
//                 //       return user._id == challenge.celebId;
//                 //     });
//                 // }, function(err) {
//                 //     //console.log(err);
//                 // });
//                 //complete.challengee = _.find(all_users.data, function(user){ return user._id == theirId; });
//           //  });
//
//             //return complete;
//           //}
// dfd.resolve(challenge_data);
//         });
//
//       })
//       .error(function(err) {
//         //console.log(err);
//       });
//
//     })
//     .error(function(err) {
//       //console.log(err);
//     });
//
//     return dfd.promise;
//   };

  this.getKickableProveIt = function(userId, challengeId){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + 'following?query={"userId":"'+userId+'"}';

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_followers) {

      var baseURL = KINVEY_APP_URL + "completed/";

      $http.get(baseURL,  {
        headers : {
          Authorization: KINVEY_AUTH
        }
      })
      .success(function(db_completed) {

        var skip = [];
        var completed = _.filter(db_completed, function(complete){
            return challengeId == complete.challengeId;
        });

        _.filter(completed, function(complete){
          _.each(db_followers, function(follower){
            if (follower.followsId == complete.user_id) {
              skip.push(follower.followsId);
            }
          });
        });

        var kickableUsers = []
        _.filter(db_followers, function(follower){
          if (skip.indexOf(follower.followsId) === -1) {
            var query = new $kinvey.Query();
            query.equalTo('_id', follower.followsId);
            var promise = $kinvey.User.find(query);
            promise.then(function(user) {
                kickableUsers.push(user);
            }, function(err) {

            });
          }

        });


        setTimeout(function () {
          dfd.resolve(kickableUsers);
          console.log('kickableUsers', kickableUsers);
        }, 800);

      })
      .error(function(err) {
        //console.log(err);
      });

    })
    .error(function(err) {
      console.log(err);
    });

    return dfd.promise;
  };

  this.getKickableChallenges = function(myId, theirId){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "completed/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_completed) {

      var skip = [];
      var completed = _.filter(db_completed, function(complete){
        if (complete.user_id == theirId) {
            skip.push(complete.challengeId);
            //console.log(typeof complete.challengeId);
        }
      });

      var baseURL = KINVEY_APP_URL + "challenges/";

      $http.get(baseURL,  {
        headers : {
          Authorization: KINVEY_AUTH
        }
      })
      .success(function(db_challenges) {
        var completed = _.filter(db_completed, function(complete){
          if (complete.user_id == myId && skip.indexOf(complete.challengeId) === -1) {
            var challenge_data = _.filter(db_challenges, function(challenge){ return challenge.id == complete.challengeId });
            _.each(challenge_data, function(challenge) {
                complete.challenge = challenge;

                var promise = $kinvey.DataStore.find('celebrities');
                promise.then(function(models) {
                    complete.user = _.find(models, function(user){
                      return user._id == challenge.celebId;
                    });
                }, function(err) {
                    //console.log(err);
                });
                complete.challengee = _.find(all_users.data, function(user){ return user._id == theirId; });
            });

            return complete;
          }

        });
        dfd.resolve(completed);
      })
      .error(function(err) {
        //console.log(err);
      });

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.kickChallenge = function(challengeId, myId, theirId){

      var dfd = $q.defer();

      var promise = $kinvey.DataStore.save('kicked', {
          'from_user_id'  : myId,
          'to_user_id'    : theirId,
          'challengeId'   : challengeId
      });
      promise.then(function(model) {
        dfd.resolve(model);
      }, function(err) {
        //console.log(err);
      });

      return dfd.promise;
  };

  this.getFollowers = function(userId){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "following/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_following) {
      var followers_data = _.filter(db_following, function(follow){ return follow.followsId == userId });

      //remove possible duplicates
      var followers_userId = _.uniq(_.pluck(followers_data, 'userId'));

      var followers = _.map(followers_userId, function(followerId){
        return {
          userId: followerId,
          userData: _.find(all_users.data, function(user){ return user._id == followerId }),
          // follow_back: !_.isUndefined(_.find(db_following, function(user){ return (user.userId === userId && user.followsId === followerId) }))
        };
      });

      dfd.resolve(followers);

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getFollowRequests = function(userId){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "requestFollow/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(db_following) {
      var followers_data = _.filter(db_following, function(follow){ return follow.userId == userId });

      //remove possible duplicates
      var followers_userId = _.uniq(_.pluck(followers_data, 'requestedId'));

      var followers = _.map(followers_userId, function(requestedId){
        return {
          userId: requestedId,
          userData: _.find(all_users.data, function(user){ return user._id == requestedId }),
        };
      });

      dfd.resolve(followers);

    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.addFollow = function(myId, theirId){

      var dfd = $q.defer();

      var promise = $kinvey.DataStore.save('following', {
          userId  : myId,
          followsId : theirId
      });
      promise.then(function(model) {
        dfd.resolve(model);
        //console.log("model" , model);
      }, function(err) {
        //console.log(err);
      });

      return dfd.promise;
  };

  this.addFollowRequest = function(myId, theirId){

      var dfd = $q.defer();

      var promise = $kinvey.DataStore.save('requestFollow', {
          userId  : theirId,
          requestedId : myId
      });
      promise.then(function(model) {
        dfd.resolve(model);
        //console.log("model" , model);
      }, function(err) {
        //console.log(err);
      });

      return dfd.promise;
  };

  this.removeFollowRequest = function(myId, theirId) {
    var dfd = $q.defer();

    var query = new $kinvey.Query();
    query.equalTo('userId', myId).and().equalTo('requestedId', theirId);
    var promise = $kinvey.DataStore.find('requestFollow', query);
    promise.then(function(row) {
      if (row[0]) {
        var followId = row[0]._id;
        dfd.resolve(followId);
        var promise = $kinvey.DataStore.destroy('requestFollow', followId);
        promise.then(function() {
            //console.log('remove follow');
        }, function(err) {
            //console.log(err);
        });
      }
    }, function(err) {
        //console.log(err);
    });
    return dfd.promise;
  };

  this.checkRequest = function(myId, theirId) {
    var dfd = $q.defer();

    var query = new $kinvey.Query();
    query.equalTo('userId', theirId).and().equalTo('requestedId', myId);
    var promise = $kinvey.DataStore.find('requestFollow', query);
    promise.then(function(row) {
      //console.log(row);
      if (row[0]) {
        var request = true;
        dfd.resolve(request);
      } else {
        var request = false;
        dfd.resolve(request);
      }
    }, function(err) {
        //console.log(err);
    });
    return dfd.promise;
  };

  this.checkFollowing = function(myId, theirId) {
    var dfd = $q.defer();

    var query = new $kinvey.Query();
    query.equalTo('userId', theirId).and().equalTo('followsId', myId);
    var promise = $kinvey.DataStore.find('following', query);
    promise.then(function(row) {
      //console.log(row);
      if (row[0]) {
        var request = true;
        dfd.resolve(request);
      } else {
        var request = false;
        dfd.resolve(request);
      }
    }, function(err) {
        //console.log(err);
    });
    return dfd.promise;
  };

  this.removeFollow = function(myId, theirId) {
    var query = new $kinvey.Query();
    query.equalTo('userId', myId).and().equalTo('followsId', theirId);
    var promise = $kinvey.DataStore.find('following', query);
    promise.then(function(row) {
      //console.log(row);
      var followId = row[0]._id;
        var promise = $kinvey.DataStore.destroy('following', followId);
        promise.then(function() {
            //console.log('remove follow');
        }, function(err) {
            //console.log(err);
        });
    }, function(err) {
        //console.log(err);
    });
  };

  this.removeFollower = function(myId, theirId) {
    var query = new $kinvey.Query();
    query.equalTo('followsId', myId).and().equalTo('userId', theirId);
    var promise = $kinvey.DataStore.find('following', query);
    promise.then(function(row) {
      //console.log(row);
      var followId = row[0]._id;
        var promise = $kinvey.DataStore.destroy('following', followId);
        promise.then(function() {
            //console.log('remove follow');
        }, function(err) {
            //console.log(err);
        });
    }, function(err) {
        //console.log(err);
    });
  };

  this.report = function(postId, userId, time){

      var dfd = $q.defer();

      var promise = $kinvey.DataStore.save('reported', {
          userId  : userId,
          postId  : postId,
          time    : time
      });
      promise.then(function(model) {
        dfd.resolve(model);
      }, function(err) {
        //console.log(err);
      });

      return dfd.promise;
  };

  this.reportUser = function(my_user_id, their_user_id, time){

      var dfd = $q.defer();

      var promise = $kinvey.DataStore.save('reported', {
          reportedById  : my_user_id,
          reportedId    : their_user_id,
          time          : time
      });
      promise.then(function(model) {
        dfd.resolve(model);
      }, function(err) {
        //console.log(err);
      });

      return dfd.promise;
  };

  this.blockUser = function(my_user_id, their_user_id, time){

      var dfd = $q.defer();

      var promise = $kinvey.DataStore.save('blocked', {
          userId     : my_user_id,
          blockedId  : their_user_id,
          time       : time
      });
      promise.then(function(model) {
        dfd.resolve(model);
      }, function(err) {
        //console.log(err);
      });

      var query = new $kinvey.Query();
      query.equalTo('userId', my_user_id);
      var promise = $kinvey.DataStore.find('blocked', query);
      promise.then(function(blocked) {
          blocked_users.data = blocked;
          dfd.resolve(blocked_users);
      }, function(err) {
          //console.log(err);
      });

      _.each(blocked_users.data, function(blocked_users){
          all_users.data = _.without(all_users.data, _.findWhere(all_users.data, {_id: blocked_users.blockedId}));
      });

      return dfd.promise;
  };

  this.getLeaderboard = function(){

      var dfd = $q.defer();

      var query = new $kinvey.Query();
      query.exists('karma');
      query.descending('karma');
      query.limit(10);
      var promise = $kinvey.User.find(query);
      promise.then(function(response) {
        dfd.resolve(response);
      }, function(err) {
        //console.log(err);
      });

      return dfd.promise;
    };
})


.service('TrendsService', function ($http, $q, $kinvey, KINVEY_AUTH, KINVEY_APP_URL){
  this.getTrends = function(){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "trends/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(trends) {
      dfd.resolve(trends);
    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getTrend = function(trendId){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "trends/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(trends) {
      var trend = _.find(trends, function(trend){ return trend._id == trendId; });
      dfd.resolve(trend);
    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };
})

.service('CategoryService', function ($http, $q, $kinvey, KINVEY_AUTH, KINVEY_APP_URL){
  this.getCategories = function(){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "categories/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(categories) {
      dfd.resolve(categories);
    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };

  this.getCharities = function (){

    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "charities/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(charities) {
      //var category = _.find(categories, function(category){ return category._id == categoryId; });
      dfd.resolve(charities);
    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };


  this.getDonateText = function (){

    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "donate/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(donate) {
      //var category = _.find(categories, function(category){ return category._id == categoryId; });
      dfd.resolve(donate);
    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };


  this.getCategory = function(categoryId){
    var dfd = $q.defer();

    var baseURL = KINVEY_APP_URL + "categories/";

    $http.get(baseURL,  {
      headers : {
        Authorization: KINVEY_AUTH
      }
    })
    .success(function(categories) {
      var category = _.find(categories, function(category){ return category._id == categoryId; });
      dfd.resolve(category);
    })
    .error(function(err) {
      //console.log(err);
    });

    return dfd.promise;
  };
})

.service('VideoService', function ($q){
  // this.saveVideo = function(){
    var deferred = $q.defer();
    var promise = deferred.promise;

    promise.success = function(fn) {
      promise.then(fn);
      return promise;
    }
    promise.error = function(fn) {
      promise.then(null, fn);
      return promise;
    }

    // Resolve the URL to the local file
    // Start the copy process
    function createFileEntry(fileURI) {
      window.resolveLocalFileSystemURL(fileURI, function(entry) {
        return copyFile(entry);
      }, fail);
    }

    // Create a unique name for the videofile
    // Copy the recorded video to the app dir
    function copyFile(fileEntry) {
      var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
      var newName = makeid() + name;

      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
          fileEntry.copyTo(fileSystem2, newName, function(succ) {
            return onCopySuccess(succ);
          }, fail);
        },
        fail
      );
    }

    // Called on successful copy process
    // Creates a thumbnail from the movie
    // The name is the moviename but with .png instead of .mov
    function onCopySuccess(entry) {
      var name = entry.nativeURL.slice(0, -4);
      window.PKVideoThumbnail.createThumbnail (entry.nativeURL, name + '.png', function(prevSucc) {
        return prevImageSuccess(prevSucc);
      }, fail);
    }

    // Called on thumbnail creation success
    // Generates the currect URL to the local moviefile
    // Finally resolves the promies and returns the name
    function prevImageSuccess(succ) {
      var correctUrl = succ.slice(0, -4);
      correctUrl += '.MOV';
      deferred.resolve(correctUrl);
    }

    // Called when anything fails
    // Rejects the promise with an Error
    function fail(error) {
      //console.log('FAIL: ' + error.code);
      deferred.reject('ERROR');
    }

    // Function to make a unique filename
    function makeid() {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for ( var i=0; i < 5; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }

    // The object and functions returned from the Service
    return {
      // This is the initial function we call from our controller
      // Gets the videoData and calls the first service function
      // with the local URL of the video and returns the promise
      saveVideo: function(data) {
        createFileEntry(data[0].localURL);
        return promise;
      }
    }
  // };

})

.service('GooglePlacesService', function($q){
  this.getPlacePredictions = function(query)
  {
    var dfd = $q.defer();
    var service = new google.maps.places.AutocompleteService();

    service.getPlacePredictions({ input: query },
      function(predictions, status){
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          dfd.resolve([]);
        }
        else
        {
          dfd.resolve(predictions);
        }
      });
    return dfd.promise;
  }
})


;
