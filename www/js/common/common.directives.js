angular.module('your_app_name.common.directives', [])

.directive('multiBg', function(_){
	return {
		scope: {
			multiBg: '=',
			interval: '=',
			helperClass: '@'
		},
		controller: function($scope, $element, $attrs) {
			$scope.loaded = false;
			var utils = this;

			this.animateBg = function(){
				// Think i have to use apply because this function is not called from this controller ($scope)
				$scope.$apply(function () {
					$scope.loaded = true;
					$element.css({'background-image': 'url(' + $scope.bg_img + ')'});
				});
			};

			this.setBackground = function(bg) {
				$scope.bg_img = bg;
			};

			if(!_.isUndefined($scope.multiBg))
			{
				if(_.isArray($scope.multiBg) && ($scope.multiBg.length > 1) && !_.isUndefined($scope.interval) && _.isNumber($scope.interval))
				{
					// Then we need to loop through the bg images
					utils.setBackground($scope.multiBg[0]);
				}
				else
				{
					// Then just set the multiBg image as background image
					utils.setBackground($scope.multiBg[0]);
				}
			}
		},
		templateUrl: 'views/common/multi-bg.html',
		restrict: 'A',
		replace: true,
		transclude: true
	};
})


.directive('bg', function() {
	return {
		restrict: 'A',
		require: '^multiBg',
		scope: {
			ngSrc: '@'
		},
		link: function(scope, element, attr, multiBgController) {
			element.on('load', function() {
				multiBgController.animateBg();
		  });
		}
	};
})


.directive('showHideContainer', function(){
	return {
		scope: {

		},
		controller: function($scope, $element, $attrs) {
			$scope.show = false;

			$scope.toggleType = function($event){
				$event.stopPropagation();
				$event.preventDefault();

				$scope.show = !$scope.show;

				// Emit event
				$scope.$broadcast("toggle-type", $scope.show);
			};
		},
		templateUrl: 'views/common/show-hide-password.html',
		restrict: 'A',
		replace: false,
		transclude: true
	};
})


.directive('showHideInput', function(){
	return {
		scope: {

		},
		link: function(scope, element, attrs) {
			// listen to event
			scope.$on("toggle-type", function(event, show){
				var password_input = element[0],
						input_type = password_input.getAttribute('type');

				if(!show)
				{
					password_input.setAttribute('type', 'password');
				}

				if(show)
				{
					password_input.setAttribute('type', 'text');
				}
			});
		},
		require: '^showHideContainer',
		restrict: 'A',
		replace: false,
		transclude: false
	};
})

.directive('preImg', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			ratio:'@',
			helperClass: '@'
		},
		controller: function($scope) {
			$scope.loaded = false;

			this.hideSpinner = function(){
				// Think i have to use apply because this function is not called from this controller ($scope)
				$scope.$apply(function () {
					$scope.loaded = true;
				});
			};
		},
		templateUrl: 'views/common/pre-img.html'
	};
})

.directive('spinnerOnLoad', function() {
	return {
		restrict: 'A',
		require: '^preImg',
		scope: {
			ngSrc: '@'
		},
		link: function(scope, element, attr, preImgController) {
			element.on('load', function() {
				preImgController.hideSpinner();
		  });
		}
	};
})

.directive('triggerUnfollow', function($timeout, $ionicListDelegate) {
	return {
		restrict: 'A',
		require: ['^^ionItem', '^?ionList'],
		scope: {
		},
		link: function(scope, element, attr, ctrls) {
			var itemCtrl = ctrls[0];
			var listCtrl = ctrls[1];

			$timeout(function(){
				var $itemOptions = itemCtrl.$element[0].getElementsByClassName("item-options"),
						$itemContent = itemCtrl.$element[0].getElementsByClassName("item-content"),
						options_width = $itemOptions[0].offsetWidth || 0;

				element.on('click', function() {
					listCtrl.closeOptionButtons();
					ionic.requestAnimationFrame(function() {
						$itemContent[0].style[ionic.CSS.TRANSFORM] = "translate3d(-" + options_width + "px, 0px, 0px)";
						$itemContent[0].$$ionicOptionsOpen = true;
					});
			  });
			}, 0);
		}
	};
})

.directive('socialShare', function($cordovaSocialSharing, $ionicPlatform, $timeout) {
	return {
		restrict: 'A',
		scope: {
			share:'=',
		},
		controller: function($scope) {

		},
		link: function(scope, element, attr, ctrl) {
			scope.disabled = false;
			var post = scope.share;

			scope.disable = function(){
				scope.disabled = true;
				$timeout(function(){ element.attr('disabled',scope.disabled); }, 0);
			};

			scope.enable = function(){
				scope.disabled = false;
				$timeout(function(){ element.attr('disabled',scope.disabled); }, 0);
			};

			element.on('click', function(event) {
				if (scope.disabled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        } else {
          scope.disable();
					$ionicPlatform.ready(function() {
						try {
							$cordovaSocialSharing
				        .share('Check the following post: ' + post.title, null, null, null) // Share via native share sheet
				        .then(function(result) {
				         // Success!
								 scope.enable();
				        }, function(err) {
				         // An error occured. Show a message to the user
								 scope.enable();
				        });
						}
						catch(err) {
					    scope.enable();
						}
			    });
        }
		  });
		}
	};
})

//Use this directive to open external links using inAppBrowser cordova plugin
.directive('dynamicAnchorFix', function($ionicGesture, $timeout, $cordovaInAppBrowser) {
	return {
		scope: {},
		link: function(scope, element, attrs) {
			$timeout(function(){
				var anchors = element.find('a');
				if(anchors.length > 0)
				{
					angular.forEach(anchors, function(a) {

						var anchor = angular.element(a);

						anchor.bind('click', function (event) {
							event.preventDefault();
							event.stopPropagation();

							var href = event.currentTarget.href;
							var	options = {};

							//inAppBrowser see documentation here: http://ngcordova.com/docs/plugins/inAppBrowser/

							$cordovaInAppBrowser.open(href, '_blank', options)
								.then(function(e) {
									// success
								})
								.catch(function(e) {
									console.log("error: " + e);
									// error
								});
						});
					});
				}
			}, 10);
		},
		restrict: 'A',
		replace: false,
		transclude: false
	};
})
;
