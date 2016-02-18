'use strict';

angular.module('GmailApp', ['ngRoute', 'ngMaterial', 'ngSanitize'])
    .config(function ($routeProvider, $httpProvider) {
        $httpProvider.defaults.withCredentials = true;

        $routeProvider.when("/inbox", {
            templateUrl: "templates/inbox.html"
        });

        $routeProvider.otherwise({
            templateUrl: "templates/auth.html"
        });
    })
    .controller("MainController", ['$scope', '$log', function ($scope, $log) {


    }])
    .controller("AuthController", ['$scope', '$mdDialog', function ($scope, $mdDialog) {
        $mdDialog.show({
            controller: LoginDialogController,
            templateUrl: 'templates/login_dialog.tmpl.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        }).then(function (answer) {
            if (angular.isDefined(answer) && angular.isString(answer)) {
                if (answer == 'signup') {
                    $scope.showSignUpDialog();
                }
            }
        });

        $scope.showSignUpDialog = function () {

            $mdDialog.show({
                controller: SignUpDialogController,
                templateUrl: 'templates/sign_up_dialog.tmpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false
            });
        }
    }]);

function LoginDialogController($scope, $log, $location, $mdDialog, API) {
    $scope.user = {};

    $scope.toSignUpDialog = function () {
        $mdDialog.hide("signup");
    };

    $scope.login = function () {
        $log.debug('Login');

        var promise = API.user.login($scope.user);
        if (angular.isDefined(promise) && angular.isDefined(promise.then)) {
            promise.then(function () {

                var promise = API.user.getCurrentUser();
                if (angular.isDefined(promise) && angular.isDefined(promise.then)) {
                    promise.then(function () {
                        $mdDialog.hide();
                        $location.path("/inbox");
                    });
                }

            }, function (error) {
                $location.path("/");
                $log.error("Error with data" + error);
            });
        }
    }
}

function SignUpDialogController($scope, $location, $mdToast, API) {
    var promise = API.user.getUsers();
    promise.then(function (data) {
        $scope.userList = data;
    });

    $scope.user = {};

    $scope.signup = function () {
        var matches = false;

        angular.forEach($scope.userList, function (item) {
            if (item.username == $scope.user.username) {
                matches = true;
            }
        });

        if (!matches) {
            var promise = API.user.create($scope.user);
            if (angular.isDefined(promise) && angular.isDefined(promise.then)) {
                promise.then(function () {
                    $location.path('/');
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('User created')
                            .position("right bottom")
                            .hideDelay(1000)
                    );
                });
            }
        } else {
            $scope.user.username = '';

            $mdToast.show(
                $mdToast.simple()
                    .textContent('Username already exist')
                    .position("right bottom")
                    .hideDelay(1000)
            );
        }
    }
}